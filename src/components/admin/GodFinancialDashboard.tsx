import React from 'react';
import { useFinancialSummary } from '../../hooks';
import financialService from '../../services/financialService';

const GodFinancialDashboard: React.FC = () => {
  const { summary, loading, error, refetch } = useFinancialSummary();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-600">เกิดข้อผิดพลาด: {error}</p>
        <button
          onClick={refetch}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          ลองอีกครั้ง
        </button>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <p className="text-yellow-800">ไม่พบข้อมูล</p>
      </div>
    );
  }

  const {
    today_revenue,
    today_commission,
    month_revenue,
    month_commission,
    pending_withdrawals_count,
    pending_withdrawals_amount,
    active_providers,
    total_transactions_today,
    total_stripe_fees,
    net_platform_earnings,
  } = summary;

  // Calculate percentages
  const todayCommissionPercent = today_revenue > 0 ? (today_commission / today_revenue) * 100 : 0;
  const monthCommissionPercent = month_revenue > 0 ? (month_commission / month_revenue) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">👑 GOD Financial Dashboard</h2>
          <p className="text-gray-600 mt-1">ภาพรวมการเงินของแพลตฟอร์ม</p>
        </div>
        <button
          onClick={refetch}
          className="flex items-center gap-2 px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          รีเฟรช
        </button>
      </div>

      {/* Today's Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Today Revenue */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-blue-100 text-sm font-medium">รายได้วันนี้</span>
            <svg className="w-8 h-8 text-blue-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-3xl font-bold">
            {financialService.formatCurrency(today_revenue)}
          </div>
          <p className="text-blue-100 text-xs mt-2">
            {total_transactions_today} รายการ
          </p>
        </div>

        {/* Today Commission */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-green-100 text-sm font-medium">ค่าคอมวันนี้</span>
            <svg className="w-8 h-8 text-green-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div className="text-3xl font-bold">
            {financialService.formatCurrency(today_commission)}
          </div>
          <p className="text-green-100 text-xs mt-2">
            {todayCommissionPercent.toFixed(2)}% ของรายได้
          </p>
        </div>

        {/* Pending Withdrawals */}
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-yellow-100 text-sm font-medium">รอถอนเงิน</span>
            <svg className="w-8 h-8 text-yellow-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-3xl font-bold">
            {financialService.formatCurrency(pending_withdrawals_amount)}
          </div>
          <p className="text-yellow-100 text-xs mt-2">
            {pending_withdrawals_count} รายการ
          </p>
        </div>

        {/* Active Providers */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-purple-100 text-sm font-medium">ผู้ให้บริการ</span>
            <svg className="w-8 h-8 text-purple-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div className="text-3xl font-bold">{active_providers}</div>
          <p className="text-purple-100 text-xs mt-2">ผู้ให้บริการที่ใช้งานอยู่</p>
        </div>
      </div>

      {/* Monthly Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Month Revenue */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">รายได้เดือนนี้</h3>
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div className="text-4xl font-bold text-blue-600 mb-2">
            {financialService.formatCurrency(month_revenue)}
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">ค่าคอมมิชชั่น</span>
            <span className="font-semibold text-green-600">
              {financialService.formatCurrency(month_commission)} ({monthCommissionPercent.toFixed(2)}%)
            </span>
          </div>
        </div>

        {/* Platform Earnings */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">กำไรสุทธิแพลตฟอร์ม</h3>
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-4xl font-bold text-green-600 mb-2">
            {financialService.formatCurrency(net_platform_earnings)}
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">หัก Stripe Fees</span>
            <span className="font-semibold text-red-600">
              -{financialService.formatCurrency(total_stripe_fees)}
            </span>
          </div>
        </div>
      </div>

      {/* Breakdown */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">การคำนวณรายได้</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center pb-3 border-b border-gray-200">
            <span className="text-gray-600">รายได้รวมจากการจอง</span>
            <span className="font-semibold text-gray-800">
              {financialService.formatCurrency(month_revenue)}
            </span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b border-gray-200">
            <span className="text-gray-600">ค่าคอมมิชชั่นแพลตฟอร์ม (10%)</span>
            <span className="font-semibold text-green-600">
              +{financialService.formatCurrency(month_commission)}
            </span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b border-gray-200">
            <span className="text-gray-600">ค่าธรรมเนียม Stripe (2.75%)</span>
            <span className="font-semibold text-red-600">
              -{financialService.formatCurrency(total_stripe_fees)}
            </span>
          </div>
          <div className="flex justify-between items-center pt-2">
            <span className="text-lg font-semibold text-gray-800">กำไรสุทธิแพลตฟอร์ม</span>
            <span className="text-2xl font-bold text-green-600">
              {financialService.formatCurrency(net_platform_earnings)}
            </span>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <h4 className="font-medium text-purple-800 mb-2 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          ข้อมูลสำคัญ
        </h4>
        <ul className="text-sm text-purple-600 space-y-1">
          <li>• ค่าคอมมิชชั่นแพลตฟอร์ม: 10% ของราคาจอง</li>
          <li>• ค่าธรรมเนียม Stripe: 2.75% ของราคาจอง</li>
          <li>• ผู้ให้บริการได้รับ: 87.25% ของราคาจอง</li>
          <li>• ยอดรอถอน: เงินที่รอโอนให้ผู้ให้บริการ</li>
          <li>• กำไรสุทธิ: ค่าคอมมิชชั่น - Stripe Fees</li>
        </ul>
      </div>
    </div>
  );
};

export default GodFinancialDashboard;
