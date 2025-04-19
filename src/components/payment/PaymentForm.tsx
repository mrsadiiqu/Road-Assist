import React from 'react';
import { usePaystackPayment } from 'react-paystack';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

interface PaymentFormProps {
  amount: number;
  requestId: string;
  onSuccess: () => void;
  onClose: () => void;
}

export default function PaymentForm({ amount, requestId, onSuccess, onClose }: PaymentFormProps) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const config = {
    reference: `${requestId}-${new Date().getTime()}`,
    email: user?.email || '',
    amount: amount * 100, // Convert to kobo
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    metadata: {
      custom_fields: [
        {
          display_name: "Request ID",
          variable_name: "request_id",
          value: requestId
        }
      ]
    }
  };

  const initializePayment = usePaystackPayment(config);

  const onSuccessHandler = () => {
    onSuccess();
    navigate('/payment/success');
  };

  const onCloseHandler = () => {
    onClose();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Complete Payment</h2>
        <button
          onClick={onCloseHandler}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      
      <div className="mb-6">
        <p className="text-gray-600">Amount: ₦{amount.toLocaleString()}</p>
      </div>

      <button
        onClick={() => initializePayment({ onSuccess: onSuccessHandler, onClose: onCloseHandler })}
        className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors"
      >
        Pay Now
      </button>
    </div>
  );
}