import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabase';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { requestId } = req.body;

    if (!requestId) {
      return res.status(400).json({ message: 'Request ID is required' });
    }

    // Get the service request
    const { data: request, error: requestError } = await supabase
      .from('service_requests')
      .select('*')
      .eq('id', requestId)
      .single();

    if (requestError) {
      return res.status(404).json({ message: 'Service request not found' });
    }

    // Find available service providers that offer the requested service type
    const { data: providers, error: providersError } = await supabase
      .from('service_providers')
      .select('*')
      .eq('status', 'active')
      .contains('service_types', [request.service_type]);

    if (providersError) {
      return res.status(500).json({ message: 'Error finding service providers' });
    }

    if (!providers || providers.length === 0) {
      return res.status(404).json({ message: 'No available service providers found' });
    }

    // Find the nearest provider (simplified version)
    // In a real app, you would calculate distances and find the truly nearest provider
    const provider = providers[0];

    // Assign the provider to the request
    const { data: updatedRequest, error: updateError } = await supabase
      .from('service_requests')
      .update({
        provider_id: provider.id,
        status: 'accepted'
      })
      .eq('id', requestId)
      .select()
      .single();

    if (updateError) {
      return res.status(500).json({ message: 'Error assigning provider' });
    }

    return res.status(200).json({
      status: true,
      message: 'Service provider assigned successfully',
      data: {
        provider: {
          id: provider.id,
          name: provider.name,
          phone: provider.phone,
          eta: '15 minutes' // This would be calculated based on distance
        }
      }
    });
  } catch (error) {
    console.error('Service matching error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}