'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { Profile } from '@/types';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, phone: string, password: string, fullName?: string) => Promise<void>;
  signIn: (identifier: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }: any) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, phone: string, password: string, fullName?: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password,
      options: {
        data: {
          full_name: fullName || '',
          phone_number: cleanPhone,
        },
        emailRedirectTo: undefined,
      },
    });

    if (error) {
      if (error.message.includes('Signups not allowed')) {
        throw new Error(
          'Бүртгэл идэвхгүй байна. Суpabase dashboard-аас "Enable email signups" асаах шаардлагатай. ' +
          'Authentication → Providers → Email → Enable email signups'
        );
      }
      
      throw error;
    }
    
    if (data.user) {
      setUser(data.user);
      await fetchProfile(data.user.id);
    }
  };

  const signIn = async (identifier: string, password: string) => {
    const isEmail = identifier.includes('@');
    
    let emailToUse: string;
    
    if (isEmail) {
      emailToUse = identifier.trim();
    } else {
      const cleanPhone = identifier.replace(/[^0-9]/g, '');
      
      if (!cleanPhone || cleanPhone.length < 8) {
        throw new Error('Утасны дугаар буруу байна');
      }
      
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('email')
        .eq('phone_number', cleanPhone)
        .single();
      
      if (profileError) {
        throw new Error('Утасны дугаараар бүртгэл олдсонгүй. И-мэйл ашиглана уу.');
      }
      
      if (!profile?.email) {
        throw new Error('Бүртгэлийн мэдээлэл дутуу байна. Та дахин бүртгүүлнэ үү.');
      }
      
      emailToUse = profile.email;
    }
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: emailToUse,
      password,
    });

    if (error) {
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  const isAdmin = profile?.role === 'admin';

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    refreshProfile,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
