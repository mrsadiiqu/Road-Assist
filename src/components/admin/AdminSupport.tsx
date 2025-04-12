import React, { useState, useEffect } from 'react';
import { MessageSquare, Phone, Mail, Clock, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface SupportTicket {
  id: string;
  user_id: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  user_profiles: {
    full_name: string;
    phone: string;
    email: string;
  };
}

export default function AdminSupport() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [reply, setReply] = useState('');

  useEffect(() => {
    fetchTickets();
  }, []);

  async function fetchTickets() {
    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .select(`
          *,
          user_profiles (
            full_name,
            phone,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTickets(data || []);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleStatusUpdate = async (ticketId: string, status: SupportTicket['status']) => {
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
      console.error('Error updating ticket status:', error);
    }
  };

  const handleReply = async () => {
    if (!selectedTicket || !reply.trim()) return;

    try {
      const { error } = await supabase
        .from('support_responses')
        .insert({
          ticket_id: selectedTicket.id,
          message: reply,
          admin_response: true
        });

      if (error) throw error;
      
      // Update ticket status to in_progress if it's open
      if (selectedTicket.status === 'open') {
        await handleStatusUpdate(selectedTicket.id, 'in_progress');
      }

      setReply('');
      // Optionally, fetch updated responses
    } catch (error) {
      console.error('Error sending reply:', error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Support Tickets</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Tickets List */}
        <div className="col-span-1 bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="font-semibold">Active Tickets</h2>
          </div>
          
          {loading ? (
            <div className="flex justify-center p-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            </div>
          ) : (
            <div className="divide-y">
              {tickets.map(ticket => (
                <div
                  key={ticket.id}
                  onClick={() => setSelectedTicket(ticket)}
                  className={`p-4 cursor-pointer hover:bg-gray-50 ${
                    selectedTicket?.id === ticket.id ? 'bg-primary-50' : ''
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{ticket.subject}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      ticket.status === 'open' 
                        ? 'bg-red-100 text-red-800'
                        : ticket.status === 'in_progress'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {ticket.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{ticket.message}</p>
                  <div className="flex items-center mt-2 text-xs text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    {new Date(ticket.created_at).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Ticket Details */}
        {selectedTicket && (
          <div className="col-span-1 lg:col-span-2 bg-white rounded-lg shadow-sm">
            <div className="p-4 border-b">
              <h2 className="font-semibold">{selectedTicket.subject}</h2>
              <div className="mt-2 flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-1" />
                  {selectedTicket.user_profiles.email}
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-1" />
                  {selectedTicket.user_profiles.phone}
                </div>
              </div>
            </div>

            <div className="p-4">
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="text-gray-700">{selectedTicket.message}</p>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reply
                </label>
                <textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  rows={4}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  placeholder="Type your response..."
                />
                <div className="mt-4 flex justify-between">
                  <select
                    value={selectedTicket.status}
                    onChange={(e) => handleStatusUpdate(selectedTicket.id, e.target.value as SupportTicket['status'])}
                    className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                  <button
                    onClick={handleReply}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                  >
                    Send Reply
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}