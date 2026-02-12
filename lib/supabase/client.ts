import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/supabase'

let client: any = null;

export const createClient = () => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.warn('Supabase Env Vars missing, returning mock client for build safety.');
        return {
            auth: {
                getSession: async () => ({ data: { session: null }, error: null }),
                getUser: async () => ({ data: { user: null }, error: null }),
                onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
                signOut: async () => ({ error: null }),
            },
            from: () => ({ select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null, error: null }), maybeSingle: () => Promise.resolve({ data: null, error: null }), order: () => Promise.resolve({ data: [], error: null }) }) }) })
        } as any;
    }

    // Reuse client on the browser to avoid multiple "lock" initializations
    if (typeof window !== 'undefined' && client) return client;

    const newClient = createClientComponentClient<Database>()

    if (typeof window !== 'undefined') client = newClient;
    return newClient;
}
