import React from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export default function Navigation() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<'user' | 'provider' | null>(null);

  useEffect(() => {
    const user = supabase.auth.user();
    if (user?.user_metadata?.user_type) {
      setUserType(user.user_metadata.user_type);
    }
  }, []);

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold">Road Assist</h1>
            </div>
            {userType === 'user' && (
              <div className="ml-6 flex space-x-4">
                <button onClick={() => navigate('/request')}>Request Service</button>
                <button onClick={() => navigate('/history')}>Service History</button>
              </div>
            )}
            {userType === 'provider' && (
              <div className="ml-6 flex space-x-4">
                <button onClick={() => navigate('/dashboard')}>Dashboard</button>
                <button onClick={() => navigate('/earnings')}>Earnings</button>
              </div>
            )}
          </div>
          <button
            onClick={() => supabase.auth.signOut()}
            className="text-gray-600 hover:text-gray-900"
          >
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
}