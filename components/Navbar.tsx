'use client';

import Link from 'next/link';
import { ShoppingCart, Menu } from 'lucide-react';
import { useState, useEffect, Suspense } from 'react';
import { getCart } from '@/lib/cart';
import SearchBar from './SearchBar';
import { useAuth } from '@/context/AuthProvider';
import { User, LogOut, X, Package, Heart, HelpCircle, ShoppingBag } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const { user, signOut } = useAuth();
    console.log('Navbar: Auth User:', user?.email);
    const router = useRouter();
    const pathname = usePathname();

    // Hide Navbar on Admin pages
    if (pathname?.startsWith('/admin')) return null;

    useEffect(() => {
        // Initial load
        setCartCount(getCart().reduce((acc, item) => acc + item.quantity, 0));

        // Listen for updates
        const handleCartUpdate = () => {
            setCartCount(getCart().reduce((acc, item) => acc + item.quantity, 0));
        };

        window.addEventListener('cart-updated', handleCartUpdate);
        return () => window.removeEventListener('cart-updated', handleCartUpdate);
    }, []);

    return (
        <nav className="bg-white text-gray-800 sticky top-0 z-50 shadow-sm border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-2 md:px-4">
                {/* Top Row: Menu, Logo, Actions */}
                <div className="flex items-center justify-between h-14 gap-2">

                    <div className="flex items-center gap-1 md:gap-2">
                        {/* Hamburger Menu */}
                        <button
                            onClick={() => setIsMenuOpen(true)}
                            className="md:hidden p-1 text-gray-600 hover:bg-gray-100 rounded-full"
                        >
                            <Menu className="h-5 w-5 md:h-6 md:w-6" />
                        </button>

                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-1">
                            <div className="flex flex-col leading-none">
                                <span className="font-bold text-base md:text-xl text-blue-600 italic tracking-wide">VEDA BEAUTY</span>
                                <span className="text-[9px] md:text-xs text-gray-500 font-medium">
                                    Wholesale Cosmetic
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Search */}
                    <div className="hidden md:flex flex-1 max-w-xl mx-6">
                        <Suspense fallback={<div className="h-10 bg-gray-100 rounded-md animate-pulse" />}>
                            <SearchBar />
                        </Suspense>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 md:gap-6">
                        {/* Auth Logic */}
                        {user ? (
                            <>
                                <div className="hidden md:flex items-center gap-6">
                                    <Link
                                        href="/account"
                                        className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                                    >
                                        <User className="h-5 w-5" />
                                        <span>My Profile</span>
                                    </Link>
                                    <button
                                        onClick={() => signOut()}
                                        className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
                                    >
                                        <LogOut className="h-5 w-5" />
                                        <span>Logout</span>
                                    </button>
                                </div>
                                {/* Mobile View: Logic handled in Sidebar, but maybe show a small icon? For 320px, space is premium. Let's hide 'You' text and just rely on Sidebar or just Cart. */}
                            </>
                        ) : (
                            <Link href="/login">
                                <button className="hidden md:block px-6 py-1 text-blue-600 bg-white border border-gray-200 font-medium text-sm hover:bg-blue-600 hover:text-white transition-colors rounded-sm">
                                    Login
                                </button>
                            </Link>
                        )}

                        <Link href="/cart" className="flex items-center gap-2 font-medium text-gray-700">
                            <div className="relative">
                                <ShoppingCart className="h-6 w-6" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center border border-white">
                                        {cartCount}
                                    </span>
                                )}
                            </div>
                            <span className="hidden md:inline text-sm">Cart</span>
                        </Link>
                    </div>
                </div>

                {/* Mobile Search Bar (Separate Row) */}
                <div className="md:hidden pb-2">
                    <Suspense fallback={<div className="h-10 bg-gray-100 rounded-lg animate-pulse" />}>
                        <SearchBar />
                    </Suspense>
                </div>
            </div>

            {/* Mobile Sidebar Overlay */}
            {isMenuOpen && (
                <div
                    className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm md:hidden"
                    onClick={() => setIsMenuOpen(false)}
                />
            )}

            {/* Mobile Sidebar */}
            <div className={`fixed top-0 left-0 bottom-0 w-[280px] bg-white z-50 transform transition-transform duration-300 ease-in-out md:hidden flex flex-col ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {/* Sidebar Header */}
                <div className="bg-blue-600 p-4 text-white">
                    <div className="flex justify-between items-start mb-4">
                        <div className="bg-white/20 p-2 rounded-full">
                            <User className="h-8 w-8 text-white" />
                        </div>
                        <button onClick={() => setIsMenuOpen(false)} className="p-1 hover:bg-white/20 rounded-full">
                            <X className="h-6 w-6" />
                        </button>
                    </div>
                    {user ? (
                        <div>
                            <p className="text-blue-100 text-sm">Welcome back,</p>
                            <p className="font-bold text-lg truncate">{user.user_metadata?.full_name || user.email}</p>
                        </div>
                    ) : (
                        <div>
                            <p className="font-bold text-lg mb-2">Welcome Guest</p>
                            <div className="flex gap-3">
                                <Link
                                    href="/login"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="px-4 py-1.5 bg-white text-blue-600 rounded text-sm font-semibold shadow-sm"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/signup"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="px-4 py-1.5 border border-white text-white rounded text-sm font-semibold"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar Links */}
                <div className="flex-1 overflow-y-auto py-2">
                    <div className="py-2">
                        {user && (
                            <Link
                                href="/account"
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center gap-4 px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                            >
                                <User className="h-5 w-5" />
                                <span className="font-medium">My Account</span>
                            </Link>
                        )}

                        <Link
                            href="/cart"
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center gap-4 px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                        >
                            <ShoppingBag className="h-5 w-5" />
                            <span className="font-medium">My Cart</span>
                        </Link>

                        <Link
                            href="/account/wishlist"
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center gap-4 px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                        >
                            <Heart className="h-5 w-5" />
                            <span className="font-medium">My Wishlist</span>
                        </Link>
                    </div>

                    <div className="border-t border-gray-100 my-2 pt-2">
                        <Link
                            href="#"
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center gap-4 px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                        >
                            <HelpCircle className="h-5 w-5" />
                            <span className="font-medium">Help Center</span>
                        </Link>
                    </div>
                </div>

                {/* Sidebar Footer */}
                {user && (
                    <div className="p-4 border-t border-gray-100">
                        <button
                            onClick={() => {
                                signOut();
                                setIsMenuOpen(false);
                            }}
                            className="flex items-center gap-2 w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        >
                            <LogOut className="h-5 w-5" />
                            <span className="font-medium">Logout</span>
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
}
