import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Star, Clock, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function RequestTracking() {
  const [activeRequest, setActiveRequest] = useState(null);
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    fetchActiveRequest();
    subscribeToUpdates();
  }, []);

  async function fetchActiveRequest() {
    const { data, error } = await supabase
      .from('service_requests')
      .select(`
        *,
        service_providers (
          id,
          full_name,
          phone,
          vehicle_type,
          vehicle_plate
        )
      `)
      .eq('user_id', supabase.auth.user().id)
      .in('status', ['pending', 'accepted', 'in_progress'])
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (!error && data) {
      setActiveRequest(data);
    }
  }

  function subscribeToUpdates() {
    supabase
      .channel('service_requests')
      .on('UPDATE', payload => {
        if (payload.new.user_id === supabase.auth.user().id) {
          setActiveRequest(payload.new);
          if (payload.new.status === 'completed') {
            setShowRating(true);
          }
        }
      })
      .subscribe();
  }

  async function submitRating() {
    try {
      await supabase
        .from('service_ratings')
        .insert({
          request_id: activeRequest.id,
          provider_id: activeRequest.service_providers.id,
          rating,
          feedback,
          user_id: supabase.auth.user().id
        });

      setShowRating(false);
      setActiveRequest(null);
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  }

  if (!activeRequest) return null;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Active Request</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Status</span>
            <span className={`px-2 py-1 rounded-full text-sm ${
              activeRequest.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              activeRequest.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
              'bg-green-100 text-green-800'
            }`}>
              {activeRequest.status.replace('_', ' ')}
            </span>
          </div>

          <div className="flex items-start space-x-3">
            <MapPin className="h-5 w-5 text-gray-400" />
            <p>{activeRequest.location.description}</p>
          </div>

          {activeRequest.service_providers && (
            <div className="border-t pt-4 mt-4">
              <h3 className="font-medium mb-2">Service Provider</h3>
              <div className="space-y-2">
                <p>{activeRequest.service_providers.full_name}</p>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span>{activeRequest.service_providers.phone}</span>
                </div>
                <p className="text-sm text-gray-600">
                  Vehicle: {activeRequest.service_providers.vehicle_type} ({activeRequest.service_providers.vehicle_plate})
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {showRating && (
        <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Rate Your Experience</h3>
          <div className="space-y-4">
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`p-1 ${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                >
                  <Star className="h-8 w-8 fill-current" />
                </button>
              ))}
            </div>
            <textarea
              placeholder="Share your feedback..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full p-2 border rounded-lg"
              rows={3}
            />
            <button
              onClick={submitRating}
              className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg"
            >
              Submit Rating
            </button>
          </div>
        </div>
      )}
    </div>
  );
}