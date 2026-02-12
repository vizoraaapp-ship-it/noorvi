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

    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    // Initial load
    useEffect(() => {
        setCartCount(getCart().reduce((acc, item) => acc + item.quantity, 0));

        // Listen for updates
        const handleCartUpdate = () => {
            setCartCount(getCart().reduce((acc, item) => acc + item.quantity, 0));
        };

        window.addEventListener('cart-updated', handleCartUpdate);
        return () => window.removeEventListener('cart-updated', handleCartUpdate);
    }, []);

    // Scroll handler for hiding navbar
    useEffect(() => {
        const controlNavbar = () => {
            if (typeof window !== 'undefined') {
                // If menu is open, always show navbar
                if (isMenuOpen) {
                    setIsVisible(true);
                    return;
                }

                if (window.scrollY > lastScrollY) { // if scroll down hide the navbar
                    setIsVisible(false);
                } else { // if scroll up show the navbar
                    setIsVisible(true);
                }

                // Remember current page location to use in the next move
                setLastScrollY(window.scrollY);
            }
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('scroll', controlNavbar);

            // cleanup function
            return () => {
                window.removeEventListener('scroll', controlNavbar);
            };
        }
    }, [lastScrollY, isMenuOpen]);

    // Lock body scroll when menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
            setIsVisible(true); // Ensure visible when menu opens
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMenuOpen]);

    // Hide Navbar on Admin pages
    if (pathname?.startsWith('/admin')) return null;

    return (
        <nav className={`sticky top-0 left-0 right-0 z-50 bg-[#0F0F0F] border-b border-white/10 transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                {/* Top Row: Menu, Logo, Actions */}
                <div className="flex items-center justify-between h-20 gap-2">

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
                                <span className="font-bold text-xl md:text-3xl text-white italic tracking-wider drop-shadow-md">VEDA BEAUTY</span>
                                <span className="text-[9px] md:text-[10px] text-white/70 font-bold uppercase tracking-[0.2em]">
                                    Professional Wholesale
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
                                        className="flex items-center gap-2 text-sm font-bold text-white hover:text-veda-gold transition-colors drop-shadow-sm"
                                    >
                                        <User className="h-5 w-5" />
                                        <span>Account</span>
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

                        <Link href="/cart" className="flex items-center gap-2 font-bold text-white hover:text-veda-gold transition-all duration-300">
                            <div className="relative">
                                <ShoppingCart className="h-6 w-6 drop-shadow-sm" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-1 bg-veda-gold text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center border border-veda-dark shadow-lg">
                                        {cartCount}
                                    </span>
                                )}
                            </div>
                            <span className="hidden md:inline text-sm drop-shadow-sm">Cart</span>
                        </Link>
                    </div>
                </div>

                {/* Mobile Search Bar (Separate Row) */}
                {pathname !== '/cart' && (
                    <div className="md:hidden pb-2">
                        <Suspense fallback={<div className="h-10 bg-gray-100 rounded-lg animate-pulse" />}>
                            <SearchBar />
                        </Suspense>
                    </div>
                )}
            </div>

            {/* Mobile Sidebar Overlay */}
            {isMenuOpen && (
                <div
                    className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm md:hidden"
                    onClick={() => setIsMenuOpen(false)}
                />
            )}

            {/* Mobile Sidebar */}
            <div className={`fixed top-0 left-0 bottom-0 w-full h-[100dvh] bg-white z-50 transform transition-transform duration-300 ease-in-out md:hidden flex flex-col ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {/* Sidebar Header */}
                <div className="p-6 border-b border-gray-100 relative">
                    {/* Close button absolute top right */}
                    <button
                        onClick={() => setIsMenuOpen(false)}
                        className="absolute top-4 right-4 p-2 text-gray-500 hover:text-veda-dark bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="h-6 w-6" />
                    </button>

                    <div className="mb-6 mt-2">
                        <div className="bg-veda-dark/5 p-3 rounded-full ring-1 ring-gray-200 w-fit mb-4">
                            <User className="h-8 w-8 text-veda-dark" />
                        </div>
                    </div>

                    {user ? (
                        <div>
                            <p className="text-gray-400 text-[10px] uppercase tracking-widest font-bold mb-2">Logged in as</p>
                            <p className="font-serif text-2xl text-veda-dark truncate leading-tight">{user.user_metadata?.full_name || user.email}</p>
                        </div>
                    ) : (
                        <div>
                            <p className="font-serif text-2xl text-veda-dark mb-6">Welcome Guest</p>
                            <div className="flex gap-3">
                                <Link
                                    href="/login"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex-1 py-3 bg-veda-dark text-white text-center rounded-xl text-sm font-bold hover:bg-black transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/signup"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex-1 py-3 border border-gray-200 text-veda-dark text-center rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar Links */}
                <div className="flex-1 overflow-y-auto py-6">
                    <div className="space-y-2 px-3">
                        {user && (
                            <Link
                                href="/account"
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center gap-4 px-5 py-4 text-gray-600 hover:bg-gray-50 hover:text-veda-dark rounded-2xl transition-all group"
                            >
                                <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-white transition-colors shadow-sm">
                                    <User className="h-5 w-5" />
                                </div>
                                <span className="font-medium text-lg">My Profile</span>
                            </Link>
                        )}

                        <Link
                            href="/cart"
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center gap-4 px-5 py-4 text-gray-600 hover:bg-gray-50 hover:text-veda-dark rounded-2xl transition-all group"
                        >
                            <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-white transition-colors shadow-sm">
                                <ShoppingBag className="h-5 w-5" />
                            </div>
                            <span className="font-medium text-lg">My Cart</span>
                            {cartCount > 0 && (
                                <span className="ml-auto bg-[#FF2D55] text-white text-xs font-bold px-2 py-1 rounded-full">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        <Link
                            href="/account/wishlist"
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center gap-4 px-5 py-4 text-gray-600 hover:bg-gray-50 hover:text-veda-dark rounded-2xl transition-all group"
                        >
                            <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-white transition-colors shadow-sm">
                                <Heart className="h-5 w-5" />
                            </div>
                            <span className="font-medium text-lg">My Wishlist</span>
                        </Link>
                    </div>

                    <div className="border-t border-gray-100 mx-6 my-6 pt-6">
                        <Link
                            href="#"
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center gap-4 px-4 py-2 text-gray-400 hover:text-veda-dark transition-colors"
                        >
                            <HelpCircle className="h-5 w-5" />
                            <span className="font-medium">Help & Support</span>
                        </Link>
                    </div>
                </div>

                {/* Sidebar Footer */}
                {user && (
                    <div className="p-6 border-t border-gray-100 bg-gray-50">
                        <button
                            onClick={() => {
                                signOut();
                                setIsMenuOpen(false);
                            }}
                            className="flex items-center justify-center gap-2 w-full px-4 py-4 text-[#FF2D55] bg-white border border-gray-100 hover:bg-[#FF2D55]/5 rounded-2xl transition-colors font-bold text-sm uppercase tracking-wider shadow-sm"
                        >
                            <LogOut className="h-5 w-5" />
                            <span>Logout</span>
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
}
