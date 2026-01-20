import 'server-only'
import { createServerComponentClient, createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/types/supabase'
import { SupabaseClient } from '@supabase/supabase-js'

export const createClient = (): SupabaseClient<Database> => {
    const cookieStore = cookies()
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        // Safe fallback for build time - return a dummy client or throw strictly at runtime
        // Since we marked pages as dynamic, this shouldn't run during build for those pages.
        // But for safety:
        throw new Error('Supabase Env Vars missing');
    }
    return createServerComponentClient<Database>({
        cookies: () => ({
            getAll: () => cookieStore.getAll(),
            get: (name: string) => cookieStore.get(name),
            set: (name: string, value: string, options: any) => {
                // Server Components cannot set cookies. 
                // We rely on Middleware to refresh sessions.
            },
            remove: (name: string, options: any) => {
                // Server Components cannot remove cookies.
            },
        } as any)
    }) as any as SupabaseClient<Database>
}

export const createActionClient = (): SupabaseClient<Database> => {
    const cookieStore = cookies()
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        throw new Error('Supabase Env Vars missing');
    }
    return createServerActionClient<Database>({ cookies: () => cookieStore }) as any as SupabaseClient<Database>
}

export const createSafeSupabaseClient = () => {
    const cookieStore = cookies()
    try {
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
            console.warn('Supabase Env Vars missing during createSafeSupabaseClient');
            return null;
        }
        return createServerComponentClient<Database>({
            cookies: () => ({
                getAll: () => cookieStore.getAll(),
                get: (name: string) => cookieStore.get(name),
                set: (name: string, value: string, options: any) => { },
                remove: (name: string, options: any) => { },
            } as any)
        })
    } catch (error) {
        // Return null if something fails (missing envs etc)
        console.error('Failed to create supabase client:', error)
        return null
    }
}
