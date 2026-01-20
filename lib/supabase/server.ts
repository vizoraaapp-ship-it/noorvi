import 'server-only'
import { createServerComponentClient, createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/types/supabase'
import { SupabaseClient } from '@supabase/supabase-js'

export const createClient = (): SupabaseClient<Database> => {
    const cookieStore = cookies()
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
    return createServerActionClient<Database>({ cookies: () => cookieStore }) as any as SupabaseClient<Database>
}

export const createSafeSupabaseClient = () => {
    const cookieStore = cookies()
    try {
        return createServerComponentClient<Database>({ cookies: () => cookieStore })
    } catch (error) {
        // Return null if something fails (missing envs etc)
        console.error('Failed to create supabase client:', error)
        return null
    }
}
