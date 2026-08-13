import { createContext, useContext, useState, useEffect } from 'react';
import { supabaseAuth, supabaseDb, isSupabaseConfigured } from '../lib/supabase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [sessionToken, setSessionToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check saved session in localStorage
    const savedSession = localStorage.getItem('xm_supabase_session');
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        setUser(parsed.user);
        setSessionToken(parsed.access_token);
        if (parsed.user && isSupabaseConfigured) {
          supabaseDb.getProfile(parsed.user.id, parsed.access_token).then((prof) => {
            if (prof) setProfile(prof);
          });
        }
      } catch (e) {
        console.error(e);
      }
    }
    setLoading(false);
  }, []);

  // SignUp Function
  const signUp = async (email, password, fullName) => {
    if (!isSupabaseConfigured) {
      const newUser = {
        id: `usr_${Date.now()}`,
        email,
        full_name: fullName || email.split('@')[0],
        cpf: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        cep: ''
      };
      localStorage.setItem('xm_supabase_session', JSON.stringify({ user: newUser, access_token: 'local-token' }));
      setUser(newUser);
      setProfile(newUser);
      return { user: newUser, error: null };
    }

    const { data, error } = await supabaseAuth.signUp(email, password, fullName);
    if (error) return { user: null, error };

    if (data?.user) {
      const userObj = data.user;
      const accessToken = data.access_token;
      setUser(userObj);
      setSessionToken(accessToken);

      const profilePayload = {
        id: userObj.id,
        full_name: fullName,
        email: email
      };

      await supabaseDb.upsertProfile(profilePayload, accessToken);
      setProfile(profilePayload);
      localStorage.setItem('xm_supabase_session', JSON.stringify({ user: userObj, access_token: accessToken }));
    }

    return { user: data?.user, error: null };
  };

  // SignIn Function
  const signIn = async (email, password) => {
    if (!isSupabaseConfigured) {
      const saved = localStorage.getItem('xm_supabase_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        setUser(parsed.user);
        setProfile(parsed.user);
        return { user: parsed.user, error: null };
      }
      const newUser = {
        id: `usr_${Date.now()}`,
        email,
        full_name: email.split('@')[0]
      };
      localStorage.setItem('xm_supabase_session', JSON.stringify({ user: newUser, access_token: 'local-token' }));
      setUser(newUser);
      setProfile(newUser);
      return { user: newUser, error: null };
    }

    const { data, error } = await supabaseAuth.signInWithPassword(email, password);
    if (error) return { user: null, error };

    if (data?.user) {
      const userObj = data.user;
      const accessToken = data.access_token;
      setUser(userObj);
      setSessionToken(accessToken);

      localStorage.setItem('xm_supabase_session', JSON.stringify({ user: userObj, access_token: accessToken }));

      const prof = await supabaseDb.getProfile(userObj.id, accessToken);
      if (prof) setProfile(prof);
    }

    return { user: data?.user, error: null };
  };

  // SignOut Function
  const signOut = async () => {
    if (sessionToken && isSupabaseConfigured) {
      await supabaseAuth.signOut(sessionToken);
    }
    localStorage.removeItem('xm_supabase_session');
    setUser(null);
    setProfile(null);
    setSessionToken(null);
  };

  // Update Profile Function
  const updateProfile = async (updatedFields) => {
    if (!user) return;

    if (!isSupabaseConfigured) {
      const newProfile = { ...profile, ...updatedFields };
      localStorage.setItem('xm_supabase_session', JSON.stringify({ user, access_token: 'local-token' }));
      setProfile(newProfile);
      return { error: null };
    }

    const payload = {
      id: user.id,
      email: user.email,
      ...updatedFields
    };

    const { error } = await supabaseDb.upsertProfile(payload, sessionToken);
    if (!error) {
      setProfile((prev) => ({ ...prev, ...updatedFields }));
    }
    return { error };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        sessionToken,
        loading,
        signUp,
        signIn,
        signOut,
        updateProfile,
        isSupabaseConfigured
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
