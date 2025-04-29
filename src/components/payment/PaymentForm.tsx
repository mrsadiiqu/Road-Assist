import React from 'react';
import { usePaystackPayment } from 'react-paystack';
import { X, CreditCard, MapPin, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

interface PaymentFormProps {
  amount: number;
  requestId: string;
  onSuccess: () => void;
  onClose: () => void;
  breakdown?: {
    baseFee: number;
    distanceFee: number;
    serviceFee: number;
    total: number;
  };
  serviceType?: string;
  distance?: number;
}

export default function PaymentForm({ 
  amount, 
  requestId, 
  onSuccess, 
  onClose,
  breakdown,
  serviceType,
  distance
}: PaymentFormProps) {
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
      
      <div className="space-y-6 mb-8">
        {serviceType && (
          <div className="flex items-center text-gray-600">
            <Truck className="h-5 w-5 mr-3" />
            <span>Service Type: <span className="font-medium text-gray-900">{serviceType}</span></span>
          </div>
        )}

        {distance && (
          <div className="flex items-center text-gray-600">
            <MapPin className="h-5 w-5 mr-3" />
            <span>Distance: <span className="font-medium text-gray-900">{distance.toFixed(1)} km</span></span>
          </div>
        )}

        {breakdown ? (
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center text-gray-600">
              <div className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                <span>Base Fee</span>
              </div>
              <span className="font-medium">₦{breakdown.baseFee.toLocaleString()}</span>
            </div>

            <div className="flex justify-between items-center text-gray-600">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                <span>Distance Fee</span>
              </div>
              <span className="font-medium">₦{breakdown.distanceFee.toLocaleString()}</span>
            </div>

            <div className="flex justify-between items-center text-gray-600">
              <div className="flex items-center">
                <Truck className="h-5 w-5 mr-2" />
                <span>Service Fee</span>
              </div>
              <span className="font-medium">₦{breakdown.serviceFee.toLocaleString()}</span>
            </div>

            <div className="border-t pt-3 mt-3">
              <div className="flex justify-between items-center text-gray-900 font-semibold">
                <span>Total Amount</span>
                <span>₦{breakdown.total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-xl font-semibold">₦{amount.toLocaleString()}</p>
          </div>
        )}

        <div className="text-sm text-gray-500">
          <p>Payment will be processed securely via Paystack</p>
        </div>
      </div>

      <button
        onClick={() => initializePayment({ onSuccess: onSuccessHandler, onClose: onCloseHandler })}
        className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2"
      >
        <CreditCard className="h-5 w-5" />
        <span>Pay Now</span>
      </button>
    </div>
  );
}