import { createClient } from '@/lib/supabase/server'
import { Users, ShoppingBag, CreditCard, TrendingUp, Calendar, DollarSign } from 'lucide-react'

// Helper to format currency
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(amount)
}

export default async function AdminDashboard() {
    const supabase = createClient()

    // --- Fetch Analytics Data ---

    // 1. Total Users
    const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })

    // 2. Total Orders
    const { count: totalOrders } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })

    // 3. Financials & Temporal Data
    // We fetch all orders with created_at and total_price to aggregate in JS
    // (Supabase/Postgrest aggregation is limited without RPCs)
    const { data: orders } = await supabase
        .from('orders')
        .select('created_at, total_price')

    // Aggregation Logic
    const now = new Date()
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()

    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(now.getDate() - 7)
    const startOfWeek = oneWeekAgo.toISOString()

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

    let totalIncome = 0
    let monthlyIncome = 0
    let weeklyIncome = 0
    let dailyIncome = 0

    let monthlyOrders = 0
    let weeklyOrders = 0
    let dailyOrders = 0

    orders?.forEach(order => {
        const price = Number(order.total_price) || 0
        const date = order.created_at

        totalIncome += price

        if (date >= startOfMonth) {
            monthlyIncome += price
            monthlyOrders++
        }
        if (date >= startOfWeek) {
            weeklyIncome += price
            weeklyOrders++
        }
        if (date >= startOfDay) {
            dailyIncome += price
            dailyOrders++
        }
    })


    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
                <p className="mt-1 text-gray-500">Overview of your store&apos;s performance.</p>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Users */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Users</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{totalUsers || 0}</p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg text-blue-600">
                        <Users className="h-6 w-6" />
                    </div>
                </div>

                {/* Total Orders */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Orders</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{totalOrders || 0}</p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg text-purple-600">
                        <ShoppingBag className="h-6 w-6" />
                    </div>
                </div>

                {/* Total Income */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(totalIncome)}</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg text-green-600">
                        <DollarSign className="h-6 w-6" />
                    </div>
                </div>

                {/* Daily Income */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Today&apos;s Income</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(dailyIncome)}</p>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded-lg text-yellow-600">
                        <TrendingUp className="h-6 w-6" />
                    </div>
                </div>
            </div>

            {/* Detailed Stats Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Order Statistics */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900">Order Statistics</h3>
                    </div>
                    <div className="p-6">
                        <dl className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <div className="bg-gray-50 p-4 rounded-lg text-center">
                                <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">Today</dt>
                                <dd className="mt-2 text-xl font-semibold text-gray-900">{dailyOrders}</dd>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg text-center">
                                <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">This Week</dt>
                                <dd className="mt-2 text-xl font-semibold text-gray-900">{weeklyOrders}</dd>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg text-center">
                                <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">This Month</dt>
                                <dd className="mt-2 text-xl font-semibold text-gray-900">{monthlyOrders}</dd>
                            </div>
                        </dl>
                    </div>
                </div>

                {/* Revenue Statistics */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900">Revenue Statistics</h3>
                    </div>
                    <div className="p-6">
                        <dl className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <div className="bg-gray-50 p-4 rounded-lg text-center">
                                <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">Today</dt>
                                <dd className="mt-2 text-xl font-semibold text-gray-900 text-green-600">{formatCurrency(dailyIncome)}</dd>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg text-center">
                                <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">This Week</dt>
                                <dd className="mt-2 text-xl font-semibold text-gray-900 text-green-600">{formatCurrency(weeklyIncome)}</dd>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg text-center">
                                <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">This Month</dt>
                                <dd className="mt-2 text-xl font-semibold text-gray-900 text-green-600">{formatCurrency(monthlyIncome)}</dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    )
}
