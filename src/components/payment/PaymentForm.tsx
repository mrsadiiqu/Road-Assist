import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAppStore } from '../../lib/store';

interface PaymentFormProps {
  requestId: string;
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function PaymentForm({ requestId, amount, onSuccess, onCancel }: PaymentFormProps) {
  const { isLoading, error } = useAppStore();
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success' | 'failed'>('pending');

  const handlePayment = async () => {
    try {
      // Initialize Paystack payment
      const handler = (window as any).PaystackPop.setup({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
        email: 'customer@example.com', // TODO: Get from user profile
        amount: amount * 100, // Convert to kobo
        currency: 'NGN',
        ref: `REQ_${requestId}_${Date.now()}`,
        callback: function(response: any) {
          // Verify payment on backend
          verifyPayment(response.reference);
        },
        onClose: function() {
          onCancel();
        }
      });
      handler.openIframe();
    } catch (err) {
      console.error('Payment initialization failed:', err);
      setPaymentStatus('failed');
    }
  };

  const verifyPayment = async (reference: string) => {
    try {
      // TODO: Call backend API to verify payment
      // const response = await fetch('/api/payments/verify', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ reference })
      // });
      // const data = await response.json();
      
      // Mock successful payment for now
      setPaymentStatus('success');
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (err) {
      console.error('Payment verification failed:', err);
      setPaymentStatus('failed');
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm overflow-hidden"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Payment Details</h2>
            <CreditCard className="h-6 w-6 text-primary-600" />
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {paymentStatus === 'pending' && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Service Request</span>
                  <span className="text-sm font-medium text-gray-900">#{requestId}</span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm text-gray-600">Amount</span>
                  <span className="text-lg font-semibold text-gray-900">
                    ₦{amount.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    disabled
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CVV
                    </label>
                    <input
                      type="text"
                      placeholder="123"
                      className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      disabled
                    />
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={onCancel}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePayment}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Pay Now'
                  )}
                </button>
              </div>
            </div>
          )}

          {paymentStatus === 'success' && (
            <div className="text-center py-8">
              <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Payment Successful!</h3>
              <p className="text-sm text-gray-500">
                Your payment has been processed successfully. You will be redirected shortly.
              </p>
            </div>
          )}

          {paymentStatus === 'failed' && (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Payment Failed</h3>
              <p className="text-sm text-gray-500 mb-4">
                There was an error processing your payment. Please try again.
              </p>
              <button
                onClick={() => setPaymentStatus('pending')}
                className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
} 