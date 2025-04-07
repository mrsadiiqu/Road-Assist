import { NextApiRequest, NextApiResponse } from 'next';
import { verifyPayment, createPaymentRecord, updateRequestStatus } from '../../../lib/services/payment';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { reference } = req.body;

    if (!reference) {
      return res.status(400).json({ message: 'Reference is required' });
    }

    // Verify payment with Paystack
    const verification = await verifyPayment(reference);

    if (!verification.status) {
      return res.status(400).json({ message: 'Payment verification failed' });
    }

    const { data } = verification;
    const requestId = data.metadata.request_id;

    // Create payment record
    await createPaymentRecord({
      requestId,
      amount: data.amount / 100, // Convert from kobo to naira
      reference: data.reference,
      status: data.status,
      paymentMethod: data.channel
    });

    // Update service request status
    if (data.status === 'success') {
      await updateRequestStatus({
        requestId,
        status: 'paid'
      });
    }

    return res.status(200).json({
      status: true,
      message: 'Payment verified successfully',
      data: {
        amount: data.amount / 100,
        status: data.status,
        reference: data.reference
      }
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 