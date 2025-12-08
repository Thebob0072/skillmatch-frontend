# 👮 Admin Withdrawal Approval System - Frontend Guide

## 📋 Overview
คู่มือสำหรับ Admin ในการจัดการคำขอถอนเงินของ Provider

---

## 🎯 Features

- View pending withdrawal requests
- Approve/Reject withdrawals with reason
- Upload transfer slip (original + masked)
- Track GOD platform bank accounts
- Financial dashboard overview

---

## 🔐 Admin Authentication

```typescript
// Check if user is Admin
const isAdmin = user?.tier_id === 5 && user?.access_level === 999;

// Protected Route
<Route 
  path="/admin/withdrawals" 
  element={
    <AdminRoute>
      <WithdrawalApprovalPage />
    </AdminRoute>
  } 
/>
```

---

## 🧩 Admin Components

### 1. Withdrawal Approval Queue

```tsx
// src/components/admin/WithdrawalApprovalQueue.tsx

import React, { useState, useEffect } from 'react';
import FinancialService from '@/services/FinancialService';
import { Withdrawal, WithdrawalStatus } from '@/types/financial';
import { formatCurrency, formatDate } from '@/utils/formatters';

const WithdrawalApprovalQueue: React.FC = () => {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<WithdrawalStatus | 'all'>('all');
  const [processingId, setProcessingId] = useState<number | null>(null);

  useEffect(() => {
    fetchWithdrawals();
  }, [filter]);

  const fetchWithdrawals = async () => {
    try {
      setLoading(true);
      const status = filter === 'all' ? undefined : filter;
      const response = await FinancialService.adminGetPendingWithdrawals(status);
      
      if (response.success && response.data) {
        setWithdrawals(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch withdrawals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (withdrawalId: number) => {
    if (!confirm('ยืนยันการอนุมัติคำขอถอนเงิน?')) return;

    setProcessingId(withdrawalId);
    try {
      const response = await FinancialService.adminProcessWithdrawal(withdrawalId, {
        action: 'approve',
      });

      if (response.success) {
        alert('อนุมัติสำเร็จ! กรุณาโอนเงินและอัพโหลดสลิป');
        fetchWithdrawals();
      } else {
        alert(response.error || 'เกิดข้อผิดพลาด');
      }
    } catch (error: any) {
      alert(error.response?.data?.error || 'เกิดข้อผิดพลาด');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (withdrawalId: number) => {
    const reason = prompt('กรุณาระบุเหตุผลในการปฏิเสธ:');
    if (!reason) return;

    setProcessingId(withdrawalId);
    try {
      const response = await FinancialService.adminProcessWithdrawal(withdrawalId, {
        action: 'reject',
        rejection_reason: reason,
      });

      if (response.success) {
        alert('ปฏิเสธคำขอสำเร็จ');
        fetchWithdrawals();
      } else {
        alert(response.error || 'เกิดข้อผิดพลาด');
      }
    } catch (error: any) {
      alert(error.response?.data?.error || 'เกิดข้อผิดพลาด');
    } finally {
      setProcessingId(null);
    }
  };

  const handleComplete = async (
    withdrawalId: number,
    transferRef: string,
    originalSlipUrl: string,
    maskedSlipUrl: string
  ) => {
    setProcessingId(withdrawalId);
    try {
      const response = await FinancialService.adminProcessWithdrawal(withdrawalId, {
        action: 'complete',
        transfer_reference: transferRef,
        transfer_slip_url: maskedSlipUrl, // Provider will see this
      });

      if (response.success) {
        alert('บันทึกการโอนเงินสำเร็จ! Provider ได้รับการแจ้งเตือนแล้ว');
        fetchWithdrawals();
      } else {
        alert(response.error || 'เกิดข้อผิดพลาด');
      }
    } catch (error: any) {
      alert(error.response?.data?.error || 'เกิดข้อผิดพลาด');
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status: WithdrawalStatus) => {
    const styles: Record<WithdrawalStatus, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-blue-100 text-blue-800',
      processing: 'bg-indigo-100 text-indigo-800',
      completed: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      failed: 'bg-gray-100 text-gray-800',
    };
    
    const labels: Record<WithdrawalStatus, string> = {
      pending: 'รอดำเนินการ',
      approved: 'อนุมัติแล้ว',
      processing: 'กำลังดำเนินการ',
      completed: 'เสร็จสิ้น',
      rejected: 'ปฏิเสธ',
      failed: 'ล้มเหลว',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">คำขอถอนเงิน</h2>
        
        {/* Status Filter */}
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="all">ทั้งหมด ({withdrawals.length})</option>
          <option value={WithdrawalStatus.PENDING}>รอดำเนินการ</option>
          <option value={WithdrawalStatus.APPROVED}>อนุมัติแล้ว</option>
          <option value={WithdrawalStatus.COMPLETED}>เสร็จสิ้น</option>
          <option value={WithdrawalStatus.REJECTED}>ปฏิเสธ</option>
        </select>
      </div>

      {/* Withdrawal List */}
      <div className="space-y-4">
        {withdrawals.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">ไม่มีคำขอถอนเงิน</p>
          </div>
        ) : (
          withdrawals.map((withdrawal) => (
            <WithdrawalCard
              key={withdrawal.withdrawal_id}
              withdrawal={withdrawal}
              processingId={processingId}
              onApprove={handleApprove}
              onReject={handleReject}
              onComplete={handleComplete}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default WithdrawalApprovalQueue;
```

---

### 2. Withdrawal Card Component

```tsx
// src/components/admin/WithdrawalCard.tsx

import React, { useState } from 'react';
import { Withdrawal, WithdrawalStatus } from '@/types/financial';
import { formatCurrency, formatDate } from '@/utils/formatters';
import TransferSlipUploader from './TransferSlipUploader';

interface WithdrawalCardProps {
  withdrawal: Withdrawal;
  processingId: number | null;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
  onComplete: (id: number, ref: string, originalUrl: string, maskedUrl: string) => void;
}

const WithdrawalCard: React.FC<WithdrawalCardProps> = ({
  withdrawal,
  processingId,
  onApprove,
  onReject,
  onComplete,
}) => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const isProcessing = processingId === withdrawal.withdrawal_id;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            #{withdrawal.withdrawal_uuid}
          </h3>
          <p className="text-sm text-gray-600">
            User ID: {withdrawal.user_id}
          </p>
        </div>
        {getStatusBadge(withdrawal.status)}
      </div>

      {/* Amount Info */}
      <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
        <div>
          <p className="text-sm text-gray-600">จำนวนที่ขอถอน</p>
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(withdrawal.requested_amount)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">ยอดโอน (หักค่าธรรมเนียม)</p>
          <p className="text-2xl font-bold text-green-600">
            {formatCurrency(withdrawal.net_amount)}
          </p>
          <p className="text-xs text-gray-500">
            ค่าธรรมเนียม: {formatCurrency(withdrawal.fee)}
          </p>
        </div>
      </div>

      {/* Bank Account Info */}
      {withdrawal.bank_account && (
        <div className="mb-4 p-4 bg-indigo-50 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">
            ข้อมูลบัญชีธนาคาร
          </h4>
          <div className="space-y-1 text-sm">
            <p>
              <span className="text-gray-600">ธนาคาร:</span>{' '}
              <span className="font-medium">{withdrawal.bank_account.bank_name}</span>
            </p>
            <p>
              <span className="text-gray-600">เลขบัญชี:</span>{' '}
              <span className="font-medium">{withdrawal.bank_account.account_number}</span>
            </p>
            <p>
              <span className="text-gray-600">ชื่อบัญชี:</span>{' '}
              <span className="font-medium">{withdrawal.bank_account.account_name}</span>
            </p>
            <p>
              <span className="text-gray-600">ประเภท:</span>{' '}
              <span className="font-medium">
                {withdrawal.bank_account.account_type === 'savings' ? 'ออมทรัพย์' : 'กระแสรายวัน'}
              </span>
            </p>
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="mb-4 text-sm text-gray-600 space-y-1">
        <p>📅 ขอถอนเมื่อ: {formatDate(withdrawal.requested_at)}</p>
        {withdrawal.approved_at && (
          <p>✅ อนุมัติเมื่อ: {formatDate(withdrawal.approved_at)}</p>
        )}
        {withdrawal.completed_at && (
          <p>💰 โอนเงินเมื่อ: {formatDate(withdrawal.completed_at)}</p>
        )}
        {withdrawal.rejected_at && (
          <p>❌ ปฏิเสธเมื่อ: {formatDate(withdrawal.rejected_at)}</p>
        )}
      </div>

      {/* Rejection Reason */}
      {withdrawal.rejection_reason && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">
            <strong>เหตุผลที่ปฏิเสธ:</strong> {withdrawal.rejection_reason}
          </p>
        </div>
      )}

      {/* Transfer Reference */}
      {withdrawal.transfer_reference && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">
            <strong>เลขที่อ้างอิง:</strong> {withdrawal.transfer_reference}
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 mt-4">
        {withdrawal.status === WithdrawalStatus.PENDING && (
          <>
            <button
              onClick={() => onApprove(withdrawal.withdrawal_id)}
              disabled={isProcessing}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'กำลังดำเนินการ...' : '✓ อนุมัติ'}
            </button>
            <button
              onClick={() => onReject(withdrawal.withdrawal_id)}
              disabled={isProcessing}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'กำลังดำเนินการ...' : '✗ ปฏิเสธ'}
            </button>
          </>
        )}

        {withdrawal.status === WithdrawalStatus.APPROVED && (
          <button
            onClick={() => setShowUploadModal(true)}
            disabled={isProcessing}
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            💰 อัพโหลดสลิปโอนเงิน
          </button>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <TransferSlipUploader
          withdrawalId={withdrawal.withdrawal_id}
          netAmount={withdrawal.net_amount}
          bankAccount={withdrawal.bank_account!}
          onComplete={(ref, originalUrl, maskedUrl) => {
            onComplete(withdrawal.withdrawal_id, ref, originalUrl, maskedUrl);
            setShowUploadModal(false);
          }}
          onCancel={() => setShowUploadModal(false)}
        />
      )}
    </div>
  );
};

export default WithdrawalCard;
```

---

### 3. Transfer Slip Uploader

```tsx
// src/components/admin/TransferSlipUploader.tsx

import React, { useState } from 'react';
import { BankAccount } from '@/types/financial';
import { formatCurrency } from '@/utils/formatters';

interface TransferSlipUploaderProps {
  withdrawalId: number;
  netAmount: number;
  bankAccount: BankAccount;
  onComplete: (reference: string, originalSlipUrl: string, maskedSlipUrl: string) => void;
  onCancel: () => void;
}

const TransferSlipUploader: React.FC<TransferSlipUploaderProps> = ({
  withdrawalId,
  netAmount,
  bankAccount,
  onComplete,
  onCancel,
}) => {
  const [transferRef, setTransferRef] = useState('');
  const [originalSlipFile, setOriginalSlipFile] = useState<File | null>(null);
  const [originalSlipPreview, setOriginalSlipPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setOriginalSlipFile(file);
      
      // Preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setOriginalSlipPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!transferRef || !originalSlipFile) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    setUploading(true);

    try {
      // 1. Upload original slip to GCS (with GOD account details visible)
      const originalSlipUrl = await uploadToGCS(originalSlipFile, `slips/original/${withdrawalId}_${Date.now()}.jpg`);
      
      // 2. Create masked version (blur/hide GOD account number)
      const maskedSlipUrl = await createMaskedSlip(originalSlipUrl, `slips/masked/${withdrawalId}_${Date.now()}.jpg`);
      
      // 3. Complete withdrawal
      onComplete(transferRef, originalSlipUrl, maskedSlipUrl);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('อัพโหลดล้มเหลว กรุณาลองใหม่');
    } finally {
      setUploading(false);
    }
  };

  // Mock upload function - replace with actual GCS upload
  const uploadToGCS = async (file: File, path: string): Promise<string> => {
    // TODO: Implement actual GCS upload
    // const formData = new FormData();
    // formData.append('file', file);
    // const response = await fetch('/api/upload', { method: 'POST', body: formData });
    // return response.json().then(data => data.url);
    
    return `https://storage.googleapis.com/skillmatch/${path}`;
  };

  // Mock mask function - replace with actual image processing
  const createMaskedSlip = async (originalUrl: string, path: string): Promise<string> => {
    // TODO: Implement actual image masking (blur GOD account number)
    // This should be done server-side for security
    
    return `https://storage.googleapis.com/skillmatch/${path}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold mb-4">อัพโหลดสลิปโอนเงิน</h3>

        {/* Withdrawal Info */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">ยอดโอน:</span>
            <span className="font-bold text-green-600">{formatCurrency(netAmount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">ธนาคาร:</span>
            <span className="font-medium">{bankAccount.bank_name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">เลขบัญชี:</span>
            <span className="font-medium">{bankAccount.account_number}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">ชื่อบัญชี:</span>
            <span className="font-medium">{bankAccount.account_name}</span>
          </div>
        </div>

        {/* Transfer Reference Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            เลขที่อ้างอิงการโอน *
          </label>
          <input
            type="text"
            value={transferRef}
            onChange={(e) => setTransferRef(e.target.value)}
            placeholder="เช่น 2025120212345678"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        {/* File Upload */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            สลิปโอนเงิน (รูปเต็ม - มีเลขบัญชี GOD) *
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            ⚠️ รูปนี้จะถูกแปลงเป็น masked version ก่อนส่งให้ Provider
          </p>
        </div>

        {/* Preview */}
        {originalSlipPreview && (
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">ตัวอย่าง:</p>
            <img
              src={originalSlipPreview}
              alt="Slip Preview"
              className="w-full max-h-96 object-contain border border-gray-300 rounded-lg"
            />
          </div>
        )}

        {/* Important Notes */}
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="text-sm font-semibold text-yellow-800 mb-2">⚠️ สำคัญ:</h4>
          <ul className="text-xs text-yellow-700 space-y-1 list-disc list-inside">
            <li>ระบบจะซ่อนเลขบัญชี GOD อัตโนมัติก่อนส่งให้ Provider</li>
            <li>Provider จะเห็นเฉพาะ: จำนวนเงิน, เลขบัญชีปลายทาง (4 ตัวท้าย), วันเวลา</li>
            <li>สลิปต้นฉบับจะเก็บไว้สำหรับการตรวจสอบภายในเท่านั้น</li>
            <li>Provider จะได้รับแจ้งเตือนผ่าน WebSocket และ Email</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleUpload}
            disabled={uploading || !transferRef || !originalSlipFile}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? 'กำลังอัพโหลด...' : '✓ อัพโหลดและบันทึก'}
          </button>
          <button
            onClick={onCancel}
            disabled={uploading}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50"
          >
            ยกเลิก
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransferSlipUploader;
```

---

### 4. GOD Financial Dashboard

```tsx
// src/components/admin/GodFinancialDashboard.tsx

import React, { useState, useEffect } from 'react';
import FinancialService from '@/services/FinancialService';
import { FinancialSummary } from '@/types/financial';
import { formatCurrency } from '@/utils/formatters';

const GodFinancialDashboard: React.FC = () => {
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const response = await FinancialService.adminGetFinancialSummary();
      
      if (response.success && response.data) {
        setSummary(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch summary:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!summary) return null;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">GOD Financial Dashboard</h2>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Today Revenue */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
          <h3 className="text-sm font-medium text-blue-100">รายได้วันนี้</h3>
          <p className="text-3xl font-bold mt-2">{formatCurrency(summary.today_revenue)}</p>
          <p className="text-xs text-blue-100 mt-1">
            Commission: {formatCurrency(summary.today_commission)}
          </p>
        </div>

        {/* Month Revenue */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
          <h3 className="text-sm font-medium text-green-100">รายได้เดือนนี้</h3>
          <p className="text-3xl font-bold mt-2">{formatCurrency(summary.month_revenue)}</p>
          <p className="text-xs text-green-100 mt-1">
            Commission: {formatCurrency(summary.month_commission)}
          </p>
        </div>

        {/* Pending Withdrawals */}
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg shadow-lg p-6 text-white">
          <h3 className="text-sm font-medium text-yellow-100">คำขอถอนรอดำเนินการ</h3>
          <p className="text-3xl font-bold mt-2">{summary.pending_withdrawals_count}</p>
          <p className="text-xs text-yellow-100 mt-1">
            Total: {formatCurrency(summary.pending_withdrawals_amount)}
          </p>
        </div>

        {/* Active Providers */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
          <h3 className="text-sm font-medium text-purple-100">Provider ที่ใช้งาน</h3>
          <p className="text-3xl font-bold mt-2">{summary.active_providers}</p>
          <p className="text-xs text-purple-100 mt-1">
            Transactions Today: {summary.total_transactions_today}
          </p>
        </div>
      </div>

      {/* Commission Breakdown */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">💰 Commission Breakdown</h3>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm text-gray-600">Platform Commission (10%)</p>
              <p className="text-xs text-gray-500">From all bookings</p>
            </div>
            <p className="text-xl font-bold text-green-600">
              {formatCurrency(summary.month_commission)}
            </p>
          </div>

          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm text-gray-600">Stripe Fees (2.75%)</p>
              <p className="text-xs text-gray-500">Payment processing fees</p>
            </div>
            <p className="text-xl font-bold text-gray-600">
              {formatCurrency(summary.month_revenue * 0.0275)}
            </p>
          </div>

          <div className="flex justify-between items-center p-4 bg-indigo-50 rounded-lg border-2 border-indigo-200">
            <div>
              <p className="text-sm font-semibold text-indigo-900">Total Platform Earnings</p>
              <p className="text-xs text-indigo-600">GOD receives 10% after Stripe fees</p>
            </div>
            <p className="text-2xl font-bold text-indigo-600">
              {formatCurrency(summary.month_commission)}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">🚀 Quick Actions</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => window.location.href = '/admin/withdrawals'}
            className="p-4 border-2 border-yellow-300 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors"
          >
            <p className="text-2xl mb-2">⏳</p>
            <p className="font-semibold">Process Withdrawals</p>
            <p className="text-sm text-gray-600">{summary.pending_withdrawals_count} pending</p>
          </button>

          <button
            onClick={() => window.location.href = '/admin/reports'}
            className="p-4 border-2 border-blue-300 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <p className="text-2xl mb-2">📊</p>
            <p className="font-semibold">Generate Reports</p>
            <p className="text-sm text-gray-600">Financial analytics</p>
          </button>

          <button
            onClick={() => window.location.href = '/admin/bank-accounts'}
            className="p-4 border-2 border-green-300 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <p className="text-2xl mb-2">🏦</p>
            <p className="font-semibold">Manage Bank Accounts</p>
            <p className="text-sm text-gray-600">Platform accounts</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GodFinancialDashboard;
```

---

## 🔒 Security Considerations

### Transfer Slip Masking Process

```typescript
// Backend should handle masking server-side
// Example masking algorithm:

interface MaskingConfig {
  blurAccountNumber: boolean;      // Blur GOD account number
  showRecipientLast4Only: boolean; // Show only last 4 digits of recipient
  preserveAmount: boolean;          // Keep transfer amount visible
  preserveDateTime: boolean;        // Keep date/time visible
}

const maskTransferSlip = async (
  originalImageUrl: string,
  config: MaskingConfig
): Promise<string> => {
  // Server-side image processing:
  // 1. Load original image
  // 2. Detect text regions (OCR)
  // 3. Blur GOD account number region
  // 4. Replace recipient account with "***7890"
  // 5. Save masked version
  // 6. Return masked image URL
  
  // Use libraries like:
  // - Sharp (image processing)
  // - Tesseract (OCR)
  // - Canvas API (drawing/blurring)
  
  return maskedImageUrl;
};
```

---

## 📝 Admin Workflow

### Step-by-Step Process

1. **View Pending Withdrawals**
   ```
   Admin Dashboard → Withdrawals → Filter: Pending
   ```

2. **Review Request**
   - Check provider details
   - Verify bank account info
   - Check withdrawal amount
   - Review provider wallet balance

3. **Approve or Reject**
   - ✅ Approve → Status changes to "approved"
   - ❌ Reject → Enter reason → Provider notified

4. **Transfer Funds** (After Approval)
   - Use GOD platform bank account
   - Transfer to provider's bank account
   - Get transfer reference number

5. **Upload Transfer Slip**
   - Enter transfer reference
   - Upload original slip (with GOD account visible)
   - System automatically creates masked version
   - Click "Complete"

6. **Provider Notification**
   - WebSocket real-time notification
   - Email with masked slip attached
   - Provider can download masked slip

---

## 🎯 Testing Checklist

- [ ] View pending withdrawal requests
- [ ] Approve withdrawal successfully
- [ ] Reject withdrawal with reason
- [ ] Upload transfer slip (original)
- [ ] Verify masked slip created
- [ ] Complete withdrawal process
- [ ] Check provider receives notification
- [ ] Verify GOD account hidden in masked slip
- [ ] Check financial summary updates
- [ ] Test filter by withdrawal status

---

**Last Updated:** December 2, 2025  
**Admin Access Level:** GOD (tier_id=5, access_level=999)  
**Status:** ✅ Ready for Integration
