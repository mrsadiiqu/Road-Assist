import React, { useState, useEffect } from 'react';
import { Save, RefreshCw } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    basePrice: 0,
    perKmPrice: 0,
    commissionRate: 0,
    maxRadius: 0,
    autoAssignTimeout: 0,
    supportEmail: '',
    supportPhone: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      const { data, error } = await supabase
        .from('app_settings')
        .select('*')
        .single();

      if (error) throw error;
      if (data) setSettings(data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const { error } = await supabase
        .from('app_settings')
        .update(settings)
        .eq('id', 1);

      if (error) throw error;
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Application Settings</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="font-semibold mb-4">Pricing Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Base Price (₦)</label>
              <input
                type="number"
                value={settings.basePrice}
                onChange={(e) => setSettings(prev => ({ ...prev, basePrice: Number(e.target.value) }))}
                className="mt-1 block w-full rounded-md border-gray-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Price per KM (₦)</label>
              <input
                type="number"
                value={settings.perKmPrice}
                onChange={(e) => setSettings(prev => ({ ...prev, perKmPrice: Number(e.target.value) }))}
                className="mt-1 block w-full rounded-md border-gray-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Commission Rate (%)</label>
              <input
                type="number"
                value={settings.commissionRate}
                onChange={(e) => setSettings(prev => ({ ...prev, commissionRate: Number(e.target.value) }))}
                className="mt-1 block w-full rounded-md border-gray-300"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="font-semibold mb-4">Service Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Max Service Radius (KM)</label>
              <input
                type="number"
                value={settings.maxRadius}
                onChange={(e) => setSettings(prev => ({ ...prev, maxRadius: Number(e.target.value) }))}
                className="mt-1 block w-full rounded-md border-gray-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Auto-assign Timeout (minutes)</label>
              <input
                type="number"
                value={settings.autoAssignTimeout}
                onChange={(e) => setSettings(prev => ({ ...prev, autoAssignTimeout: Number(e.target.value) }))}
                className="mt-1 block w-full rounded-md border-gray-300"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="font-semibold mb-4">Support Contact</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Support Email</label>
              <input
                type="email"
                value={settings.supportEmail}
                onChange={(e) => setSettings(prev => ({ ...prev, supportEmail: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Support Phone</label>
              <input
                type="tel"
                value={settings.supportPhone}
                onChange={(e) => setSettings(prev => ({ ...prev, supportPhone: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300"
              />
            </div>
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg flex items-center"
          >
            {saving ? (
              <RefreshCw className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Save className="h-5 w-5 mr-2" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}