import React, { useState, useEffect } from 'react';
import { DollarSign, Calendar, Download, Search } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('week');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPayments();
  }, [dateRange]);

  async function fetchPayments() {
    try {
      let query = supabase
        .from('payments')
        .select(`
          *,
          service_requests (
            service_type,
            user_profiles (
              full_name
            ),
            service_providers (
              business_name
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (dateRange === 'week') {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        query = query.gte('created_at', weekAgo.toISOString());
      } else if (dateRange === 'month') {
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        query = query.gte('created_at', monthAgo.toISOString());
      }

      const { data, error } = await query;
      if (error) throw error;
      setPayments(data || []);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredPayments = payments.filter(payment => 
    payment.service_requests?.user_profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.service_requests?.service_providers?.business_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalAmount = filteredPayments.reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Payments</h1>
        <div className="flex items-center space-x-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="rounded-lg border-gray-300"
          >
            <option value="all">All Time</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
          </select>
          <button className="flex items-center px-4 py-2 bg-gray-100 rounded-lg">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold">₦{totalAmount}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b">
          <div className="flex items-center">
            <Search className="h-5 w-5 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search by user or provider..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border-none focus:ring-0"
            />
          </div>
        </div>

        <div className="divide-y">
          {loading ? (
            <div className="p-4 text-center">Loading...</div>
          ) : (
            filteredPayments.map(payment => (
              <div key={payment.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">
                      {payment.service_requests?.user_profiles?.full_name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {payment.service_requests?.service_type}
                    </p>
                    <p className="text-sm text-gray-600">
                      Provider: {payment.service_requests?.service_providers?.business_name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₦{payment.amount}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(payment.created_at).toLocaleDateString()}
                    </p>
                    <span className={`text-sm ${
                      payment.status === 'completed' ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {payment.status}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}