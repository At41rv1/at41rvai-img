
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import app, { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp, updateDoc } from 'firebase/firestore';

const auth = getAuth(app);

export interface UserData {
  uid: string;
  email: string;
  displayName?: string | null;
  photoURL?: string | null;
  subscription: 'basic' | 'ultimate';
  createdAt: any;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        
        if (userDocSnap.exists()) {
          const existingData = userDocSnap.data() as UserData;
          // All logged in users get ultimate
          if (existingData.subscription !== 'ultimate') {
            await updateDoc(userDocRef, { subscription: 'ultimate' });
            setUserData({ ...existingData, subscription: 'ultimate' });
          } else {
            setUserData(existingData);
          }
        } else {
          // Create new user document in Firestore
          const newUser: UserData = {
            uid: user.uid,
            email: user.email!,
            displayName: user.displayName,
            photoURL: user.photoURL,
            subscription: 'ultimate',
            createdAt: serverTimestamp(),
          };
          await setDoc(userDocRef, newUser);
          setUserData(newUser);
        }
        setUser(user);
      } else {
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = { user, userData, loading };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
