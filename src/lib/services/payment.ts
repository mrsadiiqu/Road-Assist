import axios from 'axios';
import { supabase } from '../supabase';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_BASE_URL = 'https://api.paystack.co';

interface PaymentResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

interface VerifyResponse {
  status: boolean;
  message: string;
  data: {
    amount: number;
    currency: string;
    transaction_date: string;
    status: string;
    reference: string;
    domain: string;
    metadata: {
      request_id: string;
    };
    gateway_response: string;
    channel: string;
    ip_address: string;
    fees: number;
    authorization: {
      authorization_code: string;
      card_type: string;
      last4: string;
      exp_month: string;
      exp_year: string;
      bin: string;
      bank: string;
      channel: string;
      signature: string;
      reusable: boolean;
      country_code: string;
    };
  };
}

export async function initializePayment(params: {
  email: string;
  amount: number;
  requestId: string;
  callback_url?: string;
}): Promise<PaymentResponse> {
  try {
    const response = await axios.post(
      `${PAYSTACK_BASE_URL}/transaction/initialize`,
      {
        email: params.email,
        amount: params.amount * 100, // Convert to kobo
        reference: `REQ_${params.requestId}_${Date.now()}`,
        callback_url: params.callback_url,
        metadata: {
          request_id: params.requestId
        }
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Payment initialization failed:', error);
    throw new Error('Failed to initialize payment');
  }
}

// Verify payment with Paystack
export async function verifyPayment(reference: string) {
  try {
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error verifying payment:', error);
    return { status: false };
  }
}

// Create payment record in database
export async function createPaymentRecord({
  requestId,
  amount,
  reference,
  status,
  paymentMethod
}: {
  requestId: string;
  amount: number;
  reference: string;
  status: string;
  paymentMethod: string;
}) {
  const { data, error } = await supabase
    .from('payments')
    .insert({
      request_id: requestId,
      amount,
      reference,
      status,
      payment_method: paymentMethod,
      created_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Update service request status
export async function updateRequestStatus({
  requestId,
  status
}: {
  requestId: string;
  status: string;
}) {
  const { data, error } = await supabase
    .from('service_requests')
    .update({ status })
    .eq('id', requestId)
    .select()
    .single();

  if (error) throw error;
  return data;
}