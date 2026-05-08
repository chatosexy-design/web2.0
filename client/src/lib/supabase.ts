// Supabase client disabled while using MongoDB
export const supabase = {
  auth: {
    signInWithPassword: () => Promise.resolve({ data: {}, error: { message: 'Auth disabled' } }),
    signOut: () => Promise.resolve({ error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
  }
} as any;
