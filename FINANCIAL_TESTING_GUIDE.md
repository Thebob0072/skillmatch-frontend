# 🧪 Testing Guide - Financial System

## 📋 Overview
คู่มือทดสอบระบบการเงินแบบครบวงจร สำหรับ Frontend Developers

---

## 🎯 Test Scenarios

### 1. User Registration & Wallet Creation

#### Scenario: New Provider Registration
```typescript
// Test: Wallet should be created automatically

describe('Provider Registration', () => {
  it('should create wallet on provider registration', async () => {
    // Step 1: Register as provider
    const registerData = {
      email: 'provider@test.com',
      username: 'test_provider',
      password: 'SecurePass123!',
      gender_id: 2,
      is_provider: true,
    };
    
    const response = await apiCall('/register', {
      method: 'POST',
      body: JSON.stringify(registerData),
    });
    
    expect(response.token).toBeDefined();
    
    // Step 2: Login and check wallet
    const wallet = await apiCall('/wallet');
    
    expect(wallet.success).toBe(true);
    expect(wallet.data.wallet).toBeDefined();
    expect(wallet.data.wallet.available_balance).toBe(0);
    expect(wallet.data.wallet.pending_balance).toBe(0);
    expect(wallet.data.wallet.total_earned).toBe(0);
  });
});
```

**Expected Result:**
- ✅ Wallet created automatically
- ✅ Initial balances are 0
- ✅ Currency is THB

---

### 2. Bank Account Management

#### Test Case 1: Add Bank Account
```typescript
describe('Bank Account Management', () => {
  it('should add bank account successfully', async () => {
    const bankData = {
      bank_name: 'ธนาคารกสิกรไทย',
      bank_code: 'KBANK',
      account_number: '1234567890',
      account_name: 'John Doe',
      account_type: 'savings',
      is_default: true,
    };
    
    const response = await FinancialService.addBankAccount(bankData);
    
    expect(response.success).toBe(true);
    expect(response.data).toMatchObject({
      bank_name: 'ธนาคารกสิกรไทย',
      account_number: '1234567890',
      is_verified: false, // Initially unverified
      is_active: true,
    });
  });

  it('should validate account number format', async () => {
    const invalidData = {
      bank_name: 'ธนาคารกสิกรไทย',
      bank_code: 'KBANK',
      account_number: '123', // Too short
      account_name: 'John Doe',
      account_type: 'savings',
    };
    
    await expect(
      FinancialService.addBankAccount(invalidData)
    ).rejects.toThrow('Invalid account number format');
  });

  it('should set default account correctly', async () => {
    // Add first account
    await FinancialService.addBankAccount({
      bank_name: 'ธนาคารกสิกรไทย',
      bank_code: 'KBANK',
      account_number: '1111111111',
      account_name: 'John Doe',
      account_type: 'savings',
      is_default: true,
    });
    
    // Add second account with default flag
    await FinancialService.addBankAccount({
      bank_name: 'ธนาคารไทยพาณิชย์',
      bank_code: 'SCB',
      account_number: '2222222222',
      account_name: 'John Doe',
      account_type: 'savings',
      is_default: true,
    });
    
    // Check: Only second account should be default
    const response = await FinancialService.getMyBankAccounts();
    const accounts = response.data || [];
    
    const defaultAccounts = accounts.filter(acc => acc.is_default);
    expect(defaultAccounts).toHaveLength(1);
    expect(defaultAccounts[0].account_number).toBe('2222222222');
  });
});
```

---

### 3. Booking Payment Flow

#### Test Case: Complete Booking with Payment
```typescript
describe('Booking Payment Flow', () => {
  it('should process booking payment correctly', async () => {
    // Step 1: Create booking with payment
    const bookingData = {
      provider_id: 456,
      package_id: 1,
      booking_date: '2025-12-10',
      booking_time: '14:00:00',
      notes: 'Test booking',
    };
    
    const response = await apiCall('/bookings/create-with-payment', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
    
    expect(response.checkout_url).toBeDefined();
    expect(response.session_id).toBeDefined();
    expect(response.booking_id).toBeDefined();
    
    // Step 2: Simulate successful payment (via Stripe webhook)
    // In real test, you'd use Stripe test mode
    
    // Step 3: Check provider wallet
    const wallet = await apiCall('/wallet', {
      headers: { Authorization: `Bearer ${providerToken}` },
    });
    
    // Provider should receive 87.25% of booking price
    const bookingPrice = 1000;
    const expectedEarnings = bookingPrice * 0.8725; // ฿872.50
    
    expect(wallet.data.wallet.pending_balance).toBe(expectedEarnings);
  });

  it('should calculate fees correctly', () => {
    const bookingPrice = 1000;
    
    // Fee breakdown
    const stripeFee = bookingPrice * 0.0275; // 2.75% = ฿27.50
    const platformCommission = bookingPrice * 0.10; // 10% = ฿100.00
    const totalFees = stripeFee + platformCommission; // ฿127.50
    const providerEarnings = bookingPrice - totalFees; // ฿872.50
    
    expect(stripeFee).toBe(27.50);
    expect(platformCommission).toBe(100.00);
    expect(totalFees).toBe(127.50);
    expect(providerEarnings).toBe(872.50);
    expect(providerEarnings / bookingPrice).toBeCloseTo(0.8725);
  });
});
```

---

### 4. Withdrawal Process

#### Test Case: Request Withdrawal
```typescript
describe('Withdrawal Process', () => {
  beforeAll(async () => {
    // Setup: Add verified bank account
    await FinancialService.addBankAccount({
      bank_name: 'ธนาคารกสิกรไทย',
      bank_code: 'KBANK',
      account_number: '1234567890',
      account_name: 'Provider Test',
      account_type: 'savings',
      is_default: true,
    });
    
    // Admin verifies account
    await FinancialService.adminVerifyBankAccount(1);
  });

  it('should request withdrawal successfully', async () => {
    const withdrawalData = {
      bank_account_id: 1,
      amount: 500,
    };
    
    const response = await FinancialService.requestWithdrawal(withdrawalData);
    
    expect(response.success).toBe(true);
    expect(response.data).toMatchObject({
      requested_amount: 500,
      fee: 10,
      net_amount: 490,
      status: 'pending',
    });
  });

  it('should validate minimum withdrawal amount', async () => {
    const invalidData = {
      bank_account_id: 1,
      amount: 50, // Below minimum (100)
    };
    
    await expect(
      FinancialService.requestWithdrawal(invalidData)
    ).rejects.toThrow('Minimum withdrawal amount is 100');
  });

  it('should check available balance', async () => {
    // Assume available balance is 100
    const withdrawalData = {
      bank_account_id: 1,
      amount: 200, // More than available
    };
    
    await expect(
      FinancialService.requestWithdrawal(withdrawalData)
    ).rejects.toThrow('Insufficient balance');
  });

  it('should require verified bank account', async () => {
    // Add unverified account
    const unverifiedAccount = await FinancialService.addBankAccount({
      bank_name: 'ธนาคารกรุงเทพ',
      bank_code: 'BBL',
      account_number: '9999999999',
      account_name: 'Provider Test',
      account_type: 'savings',
    });
    
    const withdrawalData = {
      bank_account_id: unverifiedAccount.data.bank_account_id,
      amount: 500,
    };
    
    await expect(
      FinancialService.requestWithdrawal(withdrawalData)
    ).rejects.toThrow('Bank account must be verified');
  });
});
```

---

### 5. Admin Approval Workflow

#### Test Case: Admin Processes Withdrawal
```typescript
describe('Admin Withdrawal Approval', () => {
  let withdrawalId: number;
  
  beforeAll(async () => {
    // Provider requests withdrawal
    const response = await FinancialService.requestWithdrawal({
      bank_account_id: 1,
      amount: 1000,
    });
    withdrawalId = response.data.withdrawal_id;
  });

  it('should approve withdrawal', async () => {
    const response = await FinancialService.adminProcessWithdrawal(
      withdrawalId,
      { action: 'approve' }
    );
    
    expect(response.success).toBe(true);
    expect(response.data.status).toBe('approved');
    expect(response.data.approved_at).toBeDefined();
  });

  it('should reject withdrawal with reason', async () => {
    const response = await FinancialService.adminProcessWithdrawal(
      withdrawalId,
      {
        action: 'reject',
        rejection_reason: 'Invalid bank account details',
      }
    );
    
    expect(response.success).toBe(true);
    expect(response.data.status).toBe('rejected');
    expect(response.data.rejection_reason).toBe('Invalid bank account details');
    expect(response.data.rejected_at).toBeDefined();
  });

  it('should complete withdrawal with transfer slip', async () => {
    // First approve
    await FinancialService.adminProcessWithdrawal(withdrawalId, {
      action: 'approve',
    });
    
    // Then complete with slip
    const response = await FinancialService.adminProcessWithdrawal(
      withdrawalId,
      {
        action: 'complete',
        transfer_reference: '2025120212345678',
        transfer_slip_url: 'https://storage.googleapis.com/.../masked_slip.jpg',
      }
    );
    
    expect(response.success).toBe(true);
    expect(response.data.status).toBe('completed');
    expect(response.data.transfer_reference).toBe('2025120212345678');
    expect(response.data.completed_at).toBeDefined();
  });
});
```

---

### 6. Transaction History

#### Test Case: View Transaction History
```typescript
describe('Transaction History', () => {
  it('should fetch transactions with pagination', async () => {
    const response = await FinancialService.getMyTransactions(1, 20);
    
    expect(response.success).toBe(true);
    expect(response.data).toHaveProperty('items');
    expect(response.data).toHaveProperty('total');
    expect(response.data).toHaveProperty('page');
    expect(response.data.items).toBeInstanceOf(Array);
  });

  it('should filter by transaction type', async () => {
    const response = await FinancialService.getMyTransactions(
      1,
      20,
      TransactionType.PROVIDER_EARNING
    );
    
    expect(response.success).toBe(true);
    const items = response.data.items;
    
    items.forEach(transaction => {
      expect(transaction.type).toBe(TransactionType.PROVIDER_EARNING);
    });
  });

  it('should display correct fee breakdown', async () => {
    const response = await FinancialService.getMyTransactions(1, 1);
    const transaction = response.data.items[0];
    
    if (transaction.type === TransactionType.PROVIDER_EARNING) {
      expect(transaction).toHaveProperty('amount'); // Original booking price
      expect(transaction).toHaveProperty('commission_amount'); // 12.75%
      expect(transaction).toHaveProperty('net_amount'); // 87.25%
      
      const feePercentage = 
        (transaction.commission_amount! / transaction.amount) * 100;
      expect(feePercentage).toBeCloseTo(12.75);
    }
  });
});
```

---

### 7. GOD Financial Dashboard

#### Test Case: Admin Financial Summary
```typescript
describe('GOD Financial Dashboard', () => {
  it('should fetch financial summary', async () => {
    const response = await FinancialService.adminGetFinancialSummary();
    
    expect(response.success).toBe(true);
    expect(response.data).toMatchObject({
      today_revenue: expect.any(Number),
      today_commission: expect.any(Number),
      month_revenue: expect.any(Number),
      month_commission: expect.any(Number),
      pending_withdrawals_count: expect.any(Number),
      pending_withdrawals_amount: expect.any(Number),
      active_providers: expect.any(Number),
      total_transactions_today: expect.any(Number),
    });
  });

  it('should calculate commission correctly', async () => {
    const response = await FinancialService.adminGetFinancialSummary();
    const { month_revenue, month_commission } = response.data;
    
    // Commission should be 10% of total revenue
    const expectedCommission = month_revenue * 0.10;
    expect(month_commission).toBeCloseTo(expectedCommission);
  });
});
```

---

## 🎨 Component Testing

### Provider Wallet Dashboard
```tsx
import { render, screen, waitFor } from '@testing-library/react';
import WalletDashboard from '@/components/WalletDashboard';

describe('WalletDashboard Component', () => {
  it('should display wallet balances', async () => {
    render(<WalletDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('ยอดพร้อมถอน')).toBeInTheDocument();
      expect(screen.getByText('ยอดรอยืนยัน')).toBeInTheDocument();
      expect(screen.getByText('รายได้สะสม')).toBeInTheDocument();
    });
  });

  it('should show loading state', () => {
    render(<WalletDashboard />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('should handle error state', async () => {
    // Mock API error
    jest.spyOn(FinancialService, 'getMyWallet').mockRejectedValue(
      new Error('Failed to fetch wallet')
    );
    
    render(<WalletDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText(/failed to fetch wallet/i)).toBeInTheDocument();
    });
  });
});
```

### Bank Account Manager
```tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BankAccountManager from '@/components/BankAccountManager';

describe('BankAccountManager Component', () => {
  it('should display add account form', () => {
    render(<BankAccountManager />);
    
    const addButton = screen.getByText('+ เพิ่มบัญชี');
    fireEvent.click(addButton);
    
    expect(screen.getByLabelText('ธนาคาร')).toBeInTheDocument();
    expect(screen.getByLabelText('เลขบัญชี')).toBeInTheDocument();
    expect(screen.getByLabelText('ชื่อบัญชี')).toBeInTheDocument();
  });

  it('should validate account number', async () => {
    render(<BankAccountManager />);
    
    fireEvent.click(screen.getByText('+ เพิ่มบัญชี'));
    
    const accountNumberInput = screen.getByPlaceholderText('1234567890');
    fireEvent.change(accountNumberInput, { target: { value: '123' } });
    
    const submitButton = screen.getByText('บันทึก');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/invalid/i)).toBeInTheDocument();
    });
  });

  it('should add account successfully', async () => {
    render(<BankAccountManager />);
    
    fireEvent.click(screen.getByText('+ เพิ่มบัญชี'));
    
    fireEvent.change(screen.getByLabelText('ธนาคาร'), {
      target: { value: 'KBANK' },
    });
    fireEvent.change(screen.getByPlaceholderText('1234567890'), {
      target: { value: '1234567890' },
    });
    fireEvent.change(screen.getByPlaceholderText('นาย สมชาย ใจดี'), {
      target: { value: 'John Doe' },
    });
    
    fireEvent.click(screen.getByText('บันทึก'));
    
    await waitFor(() => {
      expect(screen.getByText('เพิ่มบัญชีธนาคารสำเร็จ')).toBeInTheDocument();
    });
  });
});
```

---

## 🔄 Integration Testing

### End-to-End Booking to Withdrawal Flow
```typescript
describe('E2E: Booking to Withdrawal', () => {
  it('should complete full payment cycle', async () => {
    // Step 1: Client books service
    const booking = await apiCall('/bookings/create-with-payment', {
      method: 'POST',
      body: JSON.stringify({
        provider_id: 456,
        package_id: 1,
        booking_date: '2025-12-10',
        booking_time: '14:00:00',
      }),
    });
    
    expect(booking.checkout_url).toBeDefined();
    
    // Step 2: Simulate Stripe payment success
    // (In real test, use Stripe test webhooks)
    
    // Step 3: Check provider pending balance
    const walletAfterPayment = await apiCall('/wallet', {
      headers: { Authorization: `Bearer ${providerToken}` },
    });
    
    expect(walletAfterPayment.data.wallet.pending_balance).toBe(872.50);
    
    // Step 4: Wait 7 days (simulate)
    // In real test, you'd use date mocking
    
    // Step 5: Funds move to available balance
    const walletAfter7Days = await apiCall('/wallet', {
      headers: { Authorization: `Bearer ${providerToken}` },
    });
    
    expect(walletAfter7Days.data.wallet.available_balance).toBe(872.50);
    expect(walletAfter7Days.data.wallet.pending_balance).toBe(0);
    
    // Step 6: Provider adds bank account
    await FinancialService.addBankAccount({
      bank_name: 'ธนาคารกสิกรไทย',
      bank_code: 'KBANK',
      account_number: '1234567890',
      account_name: 'Provider Test',
      account_type: 'savings',
      is_default: true,
    });
    
    // Step 7: Admin verifies bank account
    await FinancialService.adminVerifyBankAccount(1);
    
    // Step 8: Provider requests withdrawal
    const withdrawal = await FinancialService.requestWithdrawal({
      bank_account_id: 1,
      amount: 500,
    });
    
    expect(withdrawal.data.status).toBe('pending');
    expect(withdrawal.data.net_amount).toBe(490); // After ฿10 fee
    
    // Step 9: Admin approves
    await FinancialService.adminProcessWithdrawal(
      withdrawal.data.withdrawal_id,
      { action: 'approve' }
    );
    
    // Step 10: Admin completes with transfer slip
    await FinancialService.adminProcessWithdrawal(
      withdrawal.data.withdrawal_id,
      {
        action: 'complete',
        transfer_reference: 'REF123456',
        transfer_slip_url: 'https://storage.googleapis.com/.../slip.jpg',
      }
    );
    
    // Step 11: Check final wallet balance
    const finalWallet = await apiCall('/wallet', {
      headers: { Authorization: `Bearer ${providerToken}` },
    });
    
    expect(finalWallet.data.wallet.available_balance).toBe(372.50); // 872.50 - 500
    expect(finalWallet.data.wallet.total_withdrawn).toBe(500);
  });
});
```

---

## 🐛 Error Scenarios

### Test Edge Cases
```typescript
describe('Error Handling', () => {
  it('should handle expired token', async () => {
    // Set expired token
    localStorage.setItem('auth_token', 'expired_token_xyz');
    
    await expect(
      FinancialService.getMyWallet()
    ).rejects.toMatchObject({
      response: { status: 401 },
    });
  });

  it('should handle network error', async () => {
    // Mock network failure
    jest.spyOn(axios, 'get').mockRejectedValue(new Error('Network Error'));
    
    await expect(
      FinancialService.getMyWallet()
    ).rejects.toThrow('Network Error');
  });

  it('should handle duplicate withdrawal request', async () => {
    // Request withdrawal twice
    await FinancialService.requestWithdrawal({
      bank_account_id: 1,
      amount: 500,
    });
    
    await expect(
      FinancialService.requestWithdrawal({
        bank_account_id: 1,
        amount: 500,
      })
    ).rejects.toThrow('Duplicate withdrawal request detected');
  });

  it('should handle concurrent withdrawal processing', async () => {
    const withdrawalId = 1;
    
    // Two admins try to approve same withdrawal
    const approval1 = FinancialService.adminProcessWithdrawal(withdrawalId, {
      action: 'approve',
    });
    
    const approval2 = FinancialService.adminProcessWithdrawal(withdrawalId, {
      action: 'approve',
    });
    
    await Promise.allSettled([approval1, approval2]);
    
    // One should succeed, one should fail
    const results = await Promise.allSettled([approval1, approval2]);
    const succeeded = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;
    
    expect(succeeded).toBe(1);
    expect(failed).toBe(1);
  });
});
```

---

## 📊 Performance Testing

### Load Testing
```typescript
describe('Performance Tests', () => {
  it('should handle 100 concurrent wallet requests', async () => {
    const requests = Array(100).fill(null).map(() => 
      FinancialService.getMyWallet()
    );
    
    const startTime = Date.now();
    await Promise.all(requests);
    const endTime = Date.now();
    
    const duration = endTime - startTime;
    expect(duration).toBeLessThan(5000); // Should complete within 5 seconds
  });

  it('should paginate transactions efficiently', async () => {
    const startTime = Date.now();
    
    // Fetch 100 transactions across 5 pages
    const pages = [1, 2, 3, 4, 5];
    const requests = pages.map(page => 
      FinancialService.getMyTransactions(page, 20)
    );
    
    await Promise.all(requests);
    const endTime = Date.now();
    
    const duration = endTime - startTime;
    expect(duration).toBeLessThan(3000);
  });
});
```

---

## ✅ Test Coverage Goals

### Coverage Targets
- **Unit Tests:** 80%+ coverage
- **Integration Tests:** 70%+ coverage
- **E2E Tests:** Key user journeys covered

### Critical Paths to Test
1. ✅ Provider registration → Wallet creation
2. ✅ Booking payment → Provider earnings
3. ✅ Bank account verification → Withdrawal request
4. ✅ Admin approval → Fund transfer
5. ✅ Transaction history → Accurate reporting

---

## 🔧 Test Setup

### Jest Configuration
```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/test/**',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

### Test Setup File
```typescript
// src/test/setup.ts
import '@testing-library/jest-dom';
import { setupServer } from 'msw/node';
import { rest } from 'msw';

// Mock API server
export const server = setupServer(
  rest.get('http://localhost:8080/wallet', (req, res, ctx) => {
    return res(
      ctx.json({
        success: true,
        data: {
          wallet: {
            available_balance: 1000,
            pending_balance: 500,
            total_earned: 5000,
          },
          recent_transactions: [],
        },
      })
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

---

## 🚀 Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test WalletDashboard.test.tsx

# Watch mode
npm test -- --watch

# E2E tests
npm run test:e2e
```

---

**Last Updated:** December 2, 2025  
**Test Framework:** Jest + React Testing Library  
**Status:** ✅ Ready for Testing
