import React, { useState, useEffect } from 'react';
import { MessageSquare, User, Clock, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function AdminSupport() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('open');

  useEffect(() => {
    fetchSupportTickets();
  }, [filter]);

  async function fetchSupportTickets() {
    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .select(`
          *,
          user_profiles (
            full_name,
            email,
            phone
          )
        `)
        .eq('status', filter === 'all' ? undefined : filter)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTickets(data || []);
    } catch (error) {
      console.error('Error fetching support tickets:', error);
    } finally {
      setLoading(false);
    }
  }

  async function updateTicketStatus(ticketId, status) {
    try {
      const { error } = await supabase
        .from('support_tickets')
        .update({ status })
        .eq('id', ticketId);

      if (error) throw error;
      
      setTickets(tickets.map(ticket => 
        ticket.id === ticketId ? { ...ticket, status } : ticket
      ));
    } catch (error) {
      console.error('Error updating ticket:', error);
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Support Tickets</h1>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-lg border-gray-300"
        >
          <option value="all">All Tickets</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-4 text-gray-500">No tickets found</div>
        ) : (
          tickets.map(ticket => (
            <div key={ticket.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-medium">{ticket.subject}</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(ticket.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    ticket.status === 'resolved' ? 'bg-green-100 text-green-800' :
                    ticket.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {ticket.status}
                  </span>
                  {ticket.status !== 'resolved' && (
                    <select
                      value={ticket.status}
                      onChange={(e) => updateTicketStatus(ticket.id, e.target.value)}
                      className="text-sm border-gray-300 rounded-md"
                    >
                      <option value="open">Open</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-2">
                  <User className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium">{ticket.user_profiles?.full_name}</p>
                    <p className="text-sm text-gray-600">{ticket.user_profiles?.email}</p>
                    <p className="text-sm text-gray-600">{ticket.user_profiles?.phone}</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">{ticket.description}</p>
                </div>

                {ticket.response && (
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-2">Response</h4>
                    <p className="text-gray-700">{ticket.response}</p>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}