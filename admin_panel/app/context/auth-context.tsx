// app/context/auth-context.tsx
'use client'
import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { auth, provider } from '../firebase';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    try {
      const signin = await signInWithPopup(auth, provider);
      const user = signin.user

      if(user){
        router.push('/dashboard')
      }
      else{
        alert('There is an error')
      }
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <AuthContext.Provider 
      value={{
        user,
        loading,
        signIn: handleSignIn,
        signOut: handleSignOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}