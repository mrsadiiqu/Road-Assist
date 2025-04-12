import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Car, CreditCard, Star } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function ServiceHistory() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchServiceHistory();
  }, [filter]);

  async function fetchServiceHistory() {
    try {
      const { data } = await supabase
        .from('service_requests')
        .select(`
          *,
          service_providers (
            full_name,
            business_name
          ),
          payments (
            amount,
            status,
            payment_method
          ),
          service_ratings (
            rating,
            feedback
          )
        `)
        .eq('user_id', supabase.auth.user().id)
        .order('created_at', { ascending: false });

      if (data) {
        if (filter !== 'all') {
          setServices(data.filter(service => service.status === filter));
        } else {
          setServices(data);
        }
      }
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Service History</h1>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-md border-gray-300"
        >
          <option value="all">All Services</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="space-y-4">
        {services.map(service => (
          <div key={service.id} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-medium">{service.service_type}</h3>
                <p className="text-sm text-gray-600">
                  {new Date(service.created_at).toLocaleDateString()}
                </p>
              </div>
              <span className={`px-2 py-1 rounded-full text-sm ${
                service.status === 'completed' ? 'bg-green-100 text-green-800' :
                service.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {service.status}
              </span>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center">
                <Car className="h-4 w-4 mr-2" />
                <span>{service.service_providers?.business_name}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                <span>{service.location.description}</span>
              </div>
              <div className="flex items-center">
                <CreditCard className="h-4 w-4 mr-2" />
                <span>₦{service.payments?.[0]?.amount}</span>
              </div>
            </div>

            {service.service_ratings?.[0] && (
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < service.service_ratings[0].rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {service.service_ratings[0].feedback}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}