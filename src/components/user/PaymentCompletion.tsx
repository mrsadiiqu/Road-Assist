import React, { useState, useEffect } from 'react';
import { CreditCard, Receipt, CheckCircle, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function PaymentCompletion() {
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');

  useEffect(() => {
    fetchPendingPayment();
  }, []);

  async function fetchPendingPayment() {
    const { data } = await supabase
      .from('payments')
      .select(`
        *,
        service_requests (
          service_type,
          location,
          service_providers (
            full_name,
            business_name
          )
        )
      `)
      .eq('status', 'pending')
      .eq('user_id', supabase.auth.user().id)
      .single();

    if (data) setPayment(data);
  }

  async function handlePayment() {
    setLoading(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      await supabase
        .from('payments')
        .update({
          status: 'completed',
          payment_method: paymentMethod,
          completed_at: new Date().toISOString()
        })
        .eq('id', payment.id);

      setPayment(prev => ({ ...prev, status: 'completed' }));
    } catch (error) {
      console.error('Payment error:', error);
    } finally {
      setLoading(false);
    }
  }

  if (!payment) return null;

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Complete Payment</h2>
        
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium">Service Details</h3>
            <p className="text-sm text-gray-600 mt-1">
              {payment.service_requests.service_type}
            </p>
            <p className="text-lg font-medium mt-2">
              Amount: ₦{payment.amount}
            </p>
          </div>

          <div>
            <h3 className="font-medium mb-2">Payment Method</h3>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  checked={paymentMethod === 'card'}
                  onChange={() => setPaymentMethod('card')}
                  className="text-primary-600"
                />
                <span>Card Payment</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  checked={paymentMethod === 'cash'}
                  onChange={() => setPaymentMethod('cash')}
                  className="text-primary-600"
                />
                <span>Cash Payment</span>
              </label>
            </div>
          </div>

          {payment.status === 'completed' ? (
            <div className="text-center py-4">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
              <p className="font-medium">Payment Completed</p>
            </div>
          ) : (
            <button
              onClick={handlePayment}
              disabled={loading}
              className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin mx-auto" />
              ) : (
                'Complete Payment'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}