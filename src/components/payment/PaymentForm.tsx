import React, { useState } from 'react';
import { usePaystackPayment } from 'react-paystack';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';

interface PaymentFormProps {
  amount: number;
  requestId: string;
  onSuccess: () => void;
  onClose: () => void;
}

export default function PaymentForm({ amount, requestId, onSuccess, onClose }: PaymentFormProps) {
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const config = {
    reference: (new Date()).getTime().toString(),
    email: user?.email || '',
    amount: amount * 100, // Convert to kobo
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
    metadata: {
      request_id: requestId
    }
  };
  
  const initializePayment = usePaystackPayment(config);
  
  const handlePaymentSuccess = async (reference: { reference: string }) => {
    setIsProcessing(true);
    try {
      const response = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reference: reference.reference }),
      });
      
      const data = await response.json();
      
      if (data.status) {
        onSuccess();
      } else {
        console.error('Payment verification failed:', data.message);
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Complete Payment</h2>
      <p className="mb-4">Amount: ₦{amount.toLocaleString()}</p>
      
      {isProcessing ? (
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
          <span className="ml-2">Processing payment...</span>
        </div>
      ) : (
        <div className="flex flex-col space-y-4">
          <button
            onClick={() => {
              initializePayment({
                onSuccess: handlePaymentSuccess,
                onClose
              });
            }}
            className="bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Pay with Paystack
          </button>
          <button
            onClick={onClose}
            className="border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}