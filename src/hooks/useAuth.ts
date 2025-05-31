import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { useSupabase } from '../utils/supabase';

type AuthState = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  userRole: string | null;
};

export function useAuth(): AuthState & {
  signOut: () => Promise<void>;
} {
  const { supabase, session: initialSession } = useSupabase();
  const [authState, setAuthState] = useState<AuthState>({
    user: initialSession?.user || null,
    session: initialSession,
    isLoading: true,
    isAuthenticated: !!initialSession,
    userRole: null,
  });

  useEffect(() => {
    // Get the initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          const { data: userData } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();

          setAuthState({
            user: session.user,
            session,
            isLoading: false,
            isAuthenticated: true,
            userRole: userData?.role || 'user',
          });
        } else {
          setAuthState({
            user: null,
            session: null,
            isLoading: false,
            isAuthenticated: false,
            userRole: null,
          });
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
        }));
      }
    };

    getInitialSession();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session) {
          const { data: userData } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();

          setAuthState({
            user: session.user,
            session,
            isLoading: false,
            isAuthenticated: true,
            userRole: userData?.role || 'user',
          });
        } else {
          setAuthState({
            user: null,
            session: null,
            isLoading: false,
            isAuthenticated: false,
            userRole: null,
          });
        }
      }
    );

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return { ...authState, signOut };
}