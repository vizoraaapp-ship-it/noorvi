import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Package, Clock, MapPin } from 'lucide-react'

export default async function OrdersPage() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Fetch user profile for phone number fallback
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    // Fetch orders: matching user_id OR matching phone number (for older orders)
    // Note: 'or' syntax in Supabase needs explicit formatting
    let query = supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

    // If we have a user_id column, we filter by it.
    // If migration hasn't run, this might error if column doesn't exist?
    // We assume migration runs.

    // Constructing specific query to fetch by user_id
    // If linking by phone acts as a fallback:
    if (profile?.phone) {
        query = query.or(`user_id.eq.${user.id},phone.eq.${profile.phone}`)
    } else {
        query = query.eq('user_id', user.id)
    }

    const { data: orders, error } = await query

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <Link href="/account" className="flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors">
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Back to Account
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900 mt-2">My Orders</h1>
                </div>

                {error && (
                    <div className="bg-red-50 p-4 rounded-md mb-6">
                        <p className="text-red-700">Failed to load orders. Please try again later.</p>
                        <p className="text-xs text-red-500 mt-1">{error.message}</p>
                    </div>
                )}

                {orders && orders.length > 0 ? (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                                <div className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-4">
                                            <div className="bg-blue-50 p-3 rounded-lg text-blue-600">
                                                <Package className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900">{order.product_name}</h3>
                                                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                                    <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-medium">
                                                        Qty: {order.quantity}
                                                    </span>
                                                    <span>•</span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="h-3 w-3" />
                                                        {new Date(order.created_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Order Placed
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-gray-50 flex items-start gap-2 text-sm text-gray-600">
                                        <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                                        <p>{order.address}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                        <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">No orders found</h3>
                        <p className="text-gray-500 mt-1">Looks like you haven&apos;t placed any orders yet.</p>
                        <Link href="/" className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
                            Start Shopping
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}
