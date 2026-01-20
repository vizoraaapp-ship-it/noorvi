import { createClient } from '@/lib/supabase/server'
export const dynamic = 'force-dynamic';
import { redirect } from 'next/navigation'
import { signOut } from '@/actions/auth'
import Link from 'next/link'
import { Package, Heart, Ticket, Headphones, ChevronRight } from 'lucide-react'

export default async function AccountPage() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Fetch profile data
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            {/* Dashboard Headers */}
            <div className="max-w-7xl mx-auto mb-8">
                <div className="bg-white rounded-lg shadow-sm p-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Hello, {profile?.full_name || 'User'}</h1>
                        <p className="text-gray-500 text-sm mt-1">{user.email}</p>
                    </div>
                </div>
            </div>

            {/* Feature Grid */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <Link href="/account/orders" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                        <div className="bg-blue-50 p-3 rounded-lg text-blue-600">
                            <Package className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">Orders</h3>
                            <p className="text-xs text-gray-500">Check your status</p>
                        </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </Link>

                <Link href="/account/wishlist" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                        <div className="bg-pink-50 p-3 rounded-lg text-pink-600">
                            <Heart className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">Wishlist</h3>
                            <p className="text-xs text-gray-500">Your saved items</p>
                        </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-pink-600 transition-colors" />
                </Link>

                <Link href="#" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                        <div className="bg-purple-50 p-3 rounded-lg text-purple-600">
                            <Ticket className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">Coupons</h3>
                            <p className="text-xs text-gray-500">Deals & offers</p>
                        </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
                </Link>

                <Link href="#" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                        <div className="bg-green-50 p-3 rounded-lg text-green-600">
                            <Headphones className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">Help Center</h3>
                            <p className="text-xs text-gray-500">Support & FAQ</p>
                        </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-green-600 transition-colors" />
                </Link>
            </div>

            {/* Detailed Info Section (Original) */}
            <div className="max-w-7xl mx-auto bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Account Details</h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">Manage your profile information.</p>
                    </div>
                    <form action={signOut}>
                        <button className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                            Sign out
                        </button>
                    </form>
                </div>
                <div className="border-t border-gray-200">
                    <dl>
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Full name</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {profile?.full_name || 'N/A'}
                            </dd>
                        </div>
                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Email address</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {user.email}
                            </dd>
                        </div>
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Phone number</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {profile?.phone || 'N/A'}
                            </dd>
                        </div>
                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Member since</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {new Date(user.created_at).toLocaleDateString()}
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>
        </div>
    )
}
