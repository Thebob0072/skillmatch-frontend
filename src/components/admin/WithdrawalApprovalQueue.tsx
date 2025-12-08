import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAdminWithdrawals } from '../../hooks';
import financialService from '../../services/financialService';
import type { FinancialWithdrawal } from '../../types';

const WithdrawalApprovalQueue: React.FC = () => {
  const { t } = useTranslation();
  const [statusFilter, setStatusFilter] = useState<string>('pending');
  const { withdrawals, loading, error, processWithdrawal, refetch } = useAdminWithdrawals(statusFilter);

  const [processingId, setProcessingId] = useState<number | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<FinancialWithdrawal | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferReference, setTransferReference] = useState('');

  const handleApprove = async (withdrawal: FinancialWithdrawal) => {
    if (!confirm(`อนุมัติการถอน ${financialService.formatCurrency(withdrawal.requested_amount)}?`)) {
      return;
    }

    setProcessingId(withdrawal.withdrawal_id);
    try {
      await processWithdrawal(withdrawal.withdrawal_id, 'approve');
      await refetch();
    } catch (err: any) {
      alert(err.message || 'เกิดข้อผิดพลาด');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = (withdrawal: FinancialWithdrawal) => {
    setSelectedWithdrawal(withdrawal);
    setShowRejectModal(true);
  };

  const confirmReject = async () => {
    if (!selectedWithdrawal || !rejectionReason.trim()) {
      alert('กรุณาระบุเหตุผล');
      return;
    }

    setProcessingId(selectedWithdrawal.withdrawal_id);
    try {
      await processWithdrawal(selectedWithdrawal.withdrawal_id, 'reject', {
        rejection_reason: rejectionReason,
      });
      setShowRejectModal(false);
      setRejectionReason('');
      setSelectedWithdrawal(null);
      await refetch();
    } catch (err: any) {
      alert(err.message || 'เกิดข้อผิดพลาด');
    } finally {
      setProcessingId(null);
    }
  };

  const handleComplete = (withdrawal: FinancialWithdrawal) => {
    setSelectedWithdrawal(withdrawal);
    setShowTransferModal(true);
  };

  const confirmComplete = async () => {
    if (!selectedWithdrawal || !transferReference.trim()) {
      alert('กรุณาระบุหมายเลขอ้างอิง');
      return;
    }

    setProcessingId(selectedWithdrawal.withdrawal_id);
    try {
      await processWithdrawal(selectedWithdrawal.withdrawal_id, 'complete', {
        transfer_reference: transferReference,
        transfer_slip_url: 'https://storage.googleapis.com/pending-slip-upload',
      });
      setShowTransferModal(false);
      setTransferReference('');
      setSelectedWithdrawal(null);
      await refetch();
    } catch (err: any) {
      alert(err.message || 'เกิดข้อผิดพลาด');
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">คิวอนุมัติการถอนเงิน</h2>
        <p className="text-gray-600 mt-1">จัดการคำขอถอนเงินจากผู้ให้บริการ</p>
      </div>

      {/* Status Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { value: 'pending', label: t('financial.admin.status_pending'), color: 'yellow' },
          { value: 'approved', label: t('financial.admin.status_approved'), color: 'blue' },
          { value: 'completed', label: t('financial.admin.status_completed'), color: 'green' },
          { value: 'rejected', label: t('financial.admin.status_rejected'), color: 'red' },
        ].map(status => (
          <button
            key={status.value}
            onClick={() => setStatusFilter(status.value)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              statusFilter === status.value
                ? `bg-${status.color}-600 text-white`
                : `bg-gray-100 text-gray-600 hover:bg-gray-200`
            }`}
          >
            {status.label}
          </button>
        ))}
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Withdrawals List */}
      <div className="space-y-4">
        {withdrawals.length === 0 ? (
          <div className="bg-gray-50 rounded-xl p-8 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-gray-500">ไม่มีรายการ</p>
          </div>
        ) : (
          withdrawals.map(withdrawal => (
            <div key={withdrawal.withdrawal_id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Provider ID: {withdrawal.user_id}</p>
                      <p className="text-sm text-gray-500">
                        #{withdrawal.withdrawal_id} • {new Date(withdrawal.requested_at).toLocaleDateString('th-TH', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Amount Info */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">จำนวนที่ขอ</p>
                      <p className="text-lg font-bold text-gray-800">
                        {financialService.formatCurrency(withdrawal.requested_amount)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">ค่าธรรมเนียม</p>
                      <p className="text-lg font-bold text-red-600">
                        -{financialService.formatCurrency(withdrawal.fee)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">จำนวนที่โอน</p>
                      <p className="text-lg font-bold text-green-600">
                        {financialService.formatCurrency(withdrawal.net_amount)}
                      </p>
                    </div>
                  </div>

                  {/* Bank Account Info */}
                  {withdrawal.bank_account && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">ข้อมูลบัญชี</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-500">ธนาคาร:</span>
                          <span className="ml-2 font-medium text-gray-800">{withdrawal.bank_account.bank_name}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">เลขบัญชี:</span>
                          <span className="ml-2 font-mono font-medium text-gray-800">
                            {withdrawal.bank_account.account_number}
                          </span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-gray-500">ชื่อบัญชี:</span>
                          <span className="ml-2 font-medium text-gray-800">{withdrawal.bank_account.account_name}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  {withdrawal.notes && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-500 mb-1">หมายเหตุ:</p>
                      <p className="text-sm text-gray-700 bg-gray-50 rounded p-2">{withdrawal.notes}</p>
                    </div>
                  )}

                  {/* Rejection Reason */}
                  {withdrawal.rejection_reason && (
                    <div className="mb-4">
                      <p className="text-sm text-red-600 mb-1">เหตุผลที่ปฏิเสธ:</p>
                      <p className="text-sm text-red-700 bg-red-50 rounded p-2">{withdrawal.rejection_reason}</p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="ml-6 flex flex-col gap-2">
                  {withdrawal.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApprove(withdrawal)}
                        disabled={processingId === withdrawal.withdrawal_id}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 text-sm font-medium whitespace-nowrap"
                      >
                        ✓ อนุมัติ
                      </button>
                      <button
                        onClick={() => handleReject(withdrawal)}
                        disabled={processingId === withdrawal.withdrawal_id}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 text-sm font-medium whitespace-nowrap"
                      >
                        ✗ ปฏิเสธ
                      </button>
                    </>
                  )}
                  
                  {withdrawal.status === 'approved' && (
                    <button
                      onClick={() => handleComplete(withdrawal)}
                      disabled={processingId === withdrawal.withdrawal_id}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm font-medium whitespace-nowrap"
                    >
                      💳 โอนเงินแล้ว
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">ปฏิเสธคำขอถอนเงิน</h3>
            <p className="text-sm text-gray-600 mb-4">
              กรุณาระบุเหตุผลในการปฏิเสธ (จะแจ้งไปยังผู้ให้บริการ)
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
              placeholder="เช่น: ข้อมูลบัญชีไม่ถูกต้อง"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason('');
                  setSelectedWithdrawal(null);
                }}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={confirmReject}
                disabled={!rejectionReason.trim() || processingId !== null}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {processingId ? 'กำลังดำเนินการ...' : 'ยืนยันปฏิเสธ'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transfer Complete Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">ยืนยันการโอนเงิน</h3>
            <p className="text-sm text-gray-600 mb-4">
              กรุณาระบุหมายเลขอ้างอิงการโอน
            </p>
            <input
              type="text"
              value={transferReference}
              onChange={(e) => setTransferReference(e.target.value)}
              placeholder="เช่น: 2025120212345678"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
            />
            <p className="text-xs text-gray-500 mb-4">
              💡 อัพโหลดสลิปใน Modal ถัดไป
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowTransferModal(false);
                  setTransferReference('');
                  setSelectedWithdrawal(null);
                }}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={confirmComplete}
                disabled={!transferReference.trim() || processingId !== null}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {processingId ? 'กำลังดำเนินการ...' : 'ยืนยัน'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WithdrawalApprovalQueue;
