import React, { useState, useEffect } from 'react';
import { Upload, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom'; 
import { roleManager } from '../../lib/utils/roleManager';


interface OnboardingForm {
  fullName: string;
  email: string;
  phone: string;
  businessName: string;
  address: string;  // Add this line
  serviceTypes: string[];
  vehicleType: string;
  vehiclePlate: string;
  serviceArea: {
    latitude: number;
    longitude: number;
    radius: number;
  };
  documents: {
    license: File | null;
    insurance: File | null;
    vehicleRegistration: File | null;
  };
}

export default function ProviderOnboarding() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Add role verification in useEffect
  useEffect(() => {
    const verifyProviderAccess = async () => {
      const role = await roleManager.getCurrentRole();
      if (role !== 'provider') {
        navigate('/provider/login');
        return;
      }
    };
    verifyProviderAccess();
  }, [navigate]);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<OnboardingForm>({
    fullName: '',
    email: '',
    phone: '',
    businessName: '',
    address: '',  // Add this line
    serviceTypes: [],
    vehicleType: '',
    vehiclePlate: '',
    serviceArea: {
      latitude: 0,
      longitude: 0,
      radius: 25,
    },
    documents: {
      license: null,
      insurance: null,
      vehicleRegistration: null,
    }
  });

  const handleFileUpload = async (file: File, type: string) => {
    if (!file) return null;
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}/${type}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true // Allow overwriting if file exists
        });

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (!user?.id) throw new Error('User not authenticated');
      
      // Validate required documents
      if (!form.documents.license || !form.documents.insurance || !form.documents.vehicleRegistration) {
        throw new Error('All documents are required');
      }

      // Upload all documents first
      const [licenseUrl, insuranceUrl, registrationUrl] = await Promise.all([
        handleFileUpload(form.documents.license, 'license'),
        handleFileUpload(form.documents.insurance, 'insurance'),
        handleFileUpload(form.documents.vehicleRegistration, 'registration')
      ]);

      // Create provider record with document URLs
      const { data, error } = await supabase
        .from('service_providers')
        .insert({
          user_id: user.id,
          name: form.fullName,
          full_name: form.fullName,
          email: form.email,
          phone: form.phone,
          address: form.address,
          business_name: form.businessName,
          service_types: form.serviceTypes,
          vehicle_type: form.vehicleType,
          vehicle_plate: form.vehiclePlate,
          documents: {
            license: licenseUrl,
            insurance: insuranceUrl,
            vehicle_registration: registrationUrl
          },
          status: 'inactive'  // Changed to match the allowed values
        })
        .select()
        .single();

      if (error) throw error;

      // Create notification for admin
      await supabase
        .from('admin_notifications')
        .insert({
          type: 'provider_onboarding',
          provider_id: data.id,
          message: `New service provider registration: ${form.businessName}`
        });

      // Redirect to provider dashboard after successful onboarding
      navigate('/provider/dashboard');
    } catch (error) {
      console.error('Onboarding error:', error);
      // Add user feedback for errors
      alert('Error uploading documents. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Service Provider Onboarding</h1>
        <p className="text-gray-600 mt-2">Complete the following steps to join our network</p>
      </div>

      {/* Progress Steps */}
      <div className="flex justify-between mb-8">
        {[1, 2, 3].map((stepNumber) => (
          <div
            key={stepNumber}
            className={`flex items-center ${
              step >= stepNumber ? 'text-primary-600' : 'text-gray-400'
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
              step >= stepNumber ? 'border-primary-600' : 'border-gray-300'
            }`}>
              {stepNumber}
            </div>
            <div className="ml-2">
              {stepNumber === 1 && 'Basic Info'}
              {stepNumber === 2 && 'Service Details'}
              {stepNumber === 3 && 'Documents'}
            </div>
          </div>
        ))}
      </div>

      {/* Form Steps */}
      {step === 1 && (
        <div className="space-y-4">
          {/* Basic Info Form Fields */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Business Name</label>
            <input
              type="text"
              value={form.businessName}
              onChange={(e) => setForm({ ...form, businessName: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          {/* Service Details Form Fields */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Service Types</label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {['Towing', 'Tire Change', 'Jump Start', 'Fuel Delivery'].map((service) => (
                <label key={service} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={form.serviceTypes.includes(service.toLowerCase().replace(' ', '_'))}
                    onChange={(e) => {
                      const value = service.toLowerCase().replace(' ', '_');
                      setForm({
                        ...form,
                        serviceTypes: e.target.checked
                          ? [...form.serviceTypes, value]
                          : form.serviceTypes.filter(t => t !== value)
                      });
                    }}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span>{service}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Vehicle Type</label>
            <input
              type="text"
              value={form.vehicleType}
              onChange={(e) => setForm({ ...form, vehicleType: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Vehicle Plate Number</label>
            <input
              type="text"
              value={form.vehiclePlate}
              onChange={(e) => setForm({ ...form, vehiclePlate: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          {/* Document Upload Fields */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Driver's License</label>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setForm({
                    ...form,
                    documents: { ...form.documents, license: file }
                  });
                }
              }}
              className="mt-1 block w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Insurance Document</label>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setForm({
                    ...form,
                    documents: { ...form.documents, insurance: file }
                  });
                }
              }}
              className="mt-1 block w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Vehicle Registration</label>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setForm({
                    ...form,
                    documents: { ...form.documents, vehicleRegistration: file }
                  });
                }
              }}
              className="mt-1 block w-full"
            />
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="text-center py-8">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Application Submitted!</h2>
          <p className="text-gray-600">
            We'll review your application and get back to you within 48 hours.
          </p>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="mt-8 flex justify-between">
        {step > 1 && step < 4 && (
          <button
            onClick={() => setStep(step - 1)}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Back
          </button>
        )}
        {step < 3 && (
          <button
            onClick={() => setStep(step + 1)}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Next
          </button>
        )}
        {step === 3 && (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              'Submit Application'
            )}
          </button>
        )}
      </div>
    </div>
  );
}