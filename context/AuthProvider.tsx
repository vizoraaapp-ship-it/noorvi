'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

interface AuthContextType {
    user: User | null;
    session: Session | null;
    isLoading: boolean;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const [supabase] = useState(() => createClient());

    console.log('AuthProvider: Rendering, user:', user?.email);

    useEffect(() => {
        let mounted = true;

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((event: string, session: Session | null) => {
            console.log('AuthProvider: onAuthStateChange event:', event, 'User:', session?.user?.email);

            if (mounted) {
                setSession(session);
                setUser(session?.user ?? null);
                setIsLoading(false);
            }

            if (event === 'SIGNED_OUT') {
                router.refresh();
            }
        });

        // Trigger an initial session check via onAuthStateChange logic or just accessing the property?
        // Actually, createClientComponentClient from auth-helpers typically initializes session from cookie.
        // But onAuthStateChange might not fire INITIAL_SESSION immediately in all versions of auth-helpers?
        // Let's safe guard it.

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, [router, supabase]);

    const signOut = async () => {
        await supabase.auth.signOut();
        router.refresh();
    };

    return (
        <AuthContext.Provider value={{ user, session, isLoading, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
