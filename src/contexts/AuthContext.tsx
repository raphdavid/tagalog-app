import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { useSupabase } from '../utils/supabase';

type AuthState = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  userRole: string | null;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { supabase, session: initialSession } = useSupabase();
  const [authState, setAuthState] = useState<Omit<AuthState, 'signOut'>>({
    user: initialSession?.user || null,
    session: initialSession,
    isLoading: !initialSession, // If we have initial session, don't load
    isAuthenticated: !!initialSession,
    userRole: 'user', // Default role
  });

  useEffect(() => {
    let mounted = true;

    console.log('Auth provider mounted, initial session:', !!initialSession);

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event, 'has session:', !!session);
        
        if (!mounted) return;

        if (session) {
          // Immediately set authenticated state - don't wait for profile
          setAuthState({
            user: session.user,
            session,
            isLoading: false, // Important: set to false immediately
            isAuthenticated: true,
            userRole: 'user', // Default role
          });

          // Try to fetch role in background (don't block UI)
          try {
            const { data: userData } = await supabase
              .from('profiles')
              .select('role')
              .eq('id', session.user.id)
              .single();

            if (mounted && userData?.role) {
              setAuthState(prev => ({
                ...prev,
                userRole: userData.role,
              }));
            }
          } catch (error) {
            console.warn('Could not fetch user role:', error);
            // Don't update loading state - keep as authenticated with default role
          }
        } else {
          // No session - user is not authenticated
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

    // If we already have a session from provider, no need to fetch again
    if (initialSession) {
      console.log('Using initial session');
      setAuthState({
        user: initialSession.user,
        session: initialSession,
        isLoading: false,
        isAuthenticated: true,
        userRole: 'user',
      });
    } else {
      // Only try to get session if we don't have one
      console.log('No initial session, checking auth state...');
      
      // Add timeout to prevent hanging
      const timeoutId = setTimeout(() => {
        if (mounted) {
          console.log('Auth check timed out, setting as unauthenticated');
          setAuthState(prev => ({
            ...prev,
            isLoading: false,
          }));
        }
      }, 3000);

      supabase.auth.getSession().then(({ data: { session } }) => {
        clearTimeout(timeoutId);
        if (!mounted) return;

        console.log('Got session from getSession:', !!session);
        
        if (session) {
          setAuthState({
            user: session.user,
            session,
            isLoading: false,
            isAuthenticated: true,
            userRole: 'user',
          });
        } else {
          setAuthState(prev => ({
            ...prev,
            isLoading: false,
          }));
        }
      }).catch(error => {
        clearTimeout(timeoutId);
        console.error('Error getting session:', error);
        if (mounted) {
          setAuthState(prev => ({
            ...prev,
            isLoading: false,
          }));
        }
      });
    }

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase, initialSession]);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const contextValue = useMemo(() => ({
    ...authState,
    signOut
  }), [authState]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 