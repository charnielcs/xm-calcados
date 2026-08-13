// Native Lightweight Supabase Client for React (Zero external dependencies)
// Clean and sanitize URL (strips trailing slashes or accidental /rest/v1/ paths)
const rawUrl = import.meta.env.VITE_SUPABASE_URL || '';
const rawAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabaseUrl = rawUrl.trim().replace(/\/rest\/v1\/?$/i, '').replace(/\/+$/, '');
export const supabaseAnonKey = rawAnonKey.trim();

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://xyzcompany.supabase.co'
);

// Generic REST Fetch helper
async function supabaseFetch(endpoint, options = {}) {
  if (!isSupabaseConfigured) {
    return { data: null, error: { message: 'Supabase URL e Anon Key não configuradas no .env' } };
  }

  const headers = {
    'Content-Type': 'application/json',
    'apikey': supabaseAnonKey,
    'Authorization': `Bearer ${options.accessToken || supabaseAnonKey}`,
    ...(options.headers || {})
  };

  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  try {
    const res = await fetch(`${supabaseUrl}${cleanEndpoint}`, {
      method: options.method || 'GET',
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined
    });

    const data = await res.json();
    if (!res.ok) {
      return {
        data: null,
        error: {
          message: data.msg || data.error_description || data.message || data.error || 'Erro na requisição'
        }
      };
    }
    return { data, error: null };
  } catch (err) {
    return { data: null, error: { message: err.message } };
  }
}

// Supabase Auth Methods
export const supabaseAuth = {
  async signUp(email, password, fullName) {
    if (!isSupabaseConfigured) {
      return { data: null, error: { message: 'Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY' } };
    }
    const res = await supabaseFetch('/auth/v1/signup', {
      method: 'POST',
      body: { email, password, data: { full_name: fullName } }
    });
    return res;
  },

  async signInWithPassword(email, password) {
    if (!isSupabaseConfigured) {
      return { data: null, error: { message: 'Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY' } };
    }
    const res = await supabaseFetch('/auth/v1/token?grant_type=password', {
      method: 'POST',
      body: { email, password }
    });
    return res;
  },

  async signOut(accessToken) {
    if (!isSupabaseConfigured) return;
    await supabaseFetch('/auth/v1/logout', {
      method: 'POST',
      accessToken
    });
  }
};

// Supabase Database Table REST API
export const supabaseDb = {
  async getProfile(userId, accessToken) {
    const res = await supabaseFetch(`/rest/v1/profiles?id=eq.${userId}&select=*`, {
      method: 'GET',
      accessToken
    });
    return res.data && res.data.length > 0 ? res.data[0] : null;
  },

  async upsertProfile(profileData, accessToken) {
    return await supabaseFetch('/rest/v1/profiles', {
      method: 'POST',
      headers: { 'Prefer': 'resolution=merge-duplicates,return=representation' },
      body: profileData,
      accessToken
    });
  },

  async createOrder(orderData, accessToken) {
    return await supabaseFetch('/rest/v1/orders', {
      method: 'POST',
      headers: { 'Prefer': 'return=representation' },
      body: orderData,
      accessToken
    });
  },

  async createOrderItems(itemsData, accessToken) {
    return await supabaseFetch('/rest/v1/order_items', {
      method: 'POST',
      headers: { 'Prefer': 'return=representation' },
      body: itemsData,
      accessToken
    });
  }
};
