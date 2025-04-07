import axios from 'axios';

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

export async function verifyPayment(reference: string): Promise<VerifyResponse> {
  try {
    const response = await axios.get(
      `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Payment verification failed:', error);
    throw new Error('Failed to verify payment');
  }
}

export async function createPaymentRecord(params: {
  requestId: string;
  amount: number;
  reference: string;
  status: string;
  paymentMethod: string;
}) {
  try {
    // TODO: Save payment record to database
    console.log('Creating payment record:', params);
  } catch (error) {
    console.error('Failed to create payment record:', error);
    throw new Error('Failed to create payment record');
  }
}

export async function updateRequestStatus(params: {
  requestId: string;
  status: string;
}) {
  try {
    // TODO: Update service request status in database
    console.log('Updating request status:', params);
  } catch (error) {
    console.error('Failed to update request status:', error);
    throw new Error('Failed to update request status');
  }
} 