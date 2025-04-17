import { supabase } from '../supabase';

export type UserRole = 'user' | 'provider' | 'admin' | null;

export const roleManager = {
  async getCurrentRole(): Promise<UserRole> {
    try {
      // First check Supabase auth
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return null;

      // Check user metadata first
      const role = user.user_metadata?.role;
      if (role) return role;

      // Fallback to adminData in localStorage
      const adminData = localStorage.getItem('adminData');
      if (adminData) {
        const parsedData = JSON.parse(adminData);
        if (parsedData?.session?.user?.user_metadata?.role === 'admin') {
          return 'admin';
        }
      }

      return null;
    } catch (error) {
      console.error('Error getting current role:', error);
      return null;
    }
  },

  async verifyRole(expectedRole: UserRole): Promise<boolean> {
    const currentRole = await this.getCurrentRole();
    return currentRole === expectedRole;
  },

  async updateRole(role: UserRole): Promise<void> {
    const { error } = await supabase.auth.updateUser({
      data: { role }
    });

    if (error) throw error;
  }
};