import { createClient } from '@/lib/supabase/server';
import Image from 'next/image';
import DeleteProductButton from './DeleteButton';
import Link from 'next/link';
import ProductSearch from '@/components/admin/ProductSearch';

export const revalidate = 0; // Ensure fresh data on every request

export default async function AdminProductsPage({
    searchParams,
}: {
    searchParams?: {
        query?: string;
    };
}) {
    const query = searchParams?.query || '';
    const supabase = createClient();

    let productQuery = supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

    if (query) {
        productQuery = productQuery.ilike('name', `%${query}%`);
    }

    const { data: products, error } = await productQuery;

    console.log('Admin Product Fetch:', { count: products?.length, error });

    if (error) {
        return (
            <div className="p-6 text-red-500">
                Error fetching products: {error.message}
            </div>
        );
    }

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-8 w-full">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-xl font-semibold text-gray-900">Products</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        A list of all products in your store including their name, category, price, and image.
                    </p>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                    <Link
                        href="/admin/add-product"
                        className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
                    >
                        Add Product
                    </Link>
                </div>
            </div>

            <div className="mt-8 flex flex-col">
                <div className="mb-4 w-full md:w-1/3">
                    <ProductSearch />
                </div>
                <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                            Image
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Name
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Category
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Price
                                        </th>
                                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                            <span className="sr-only">Actions</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {products?.map((product) => (
                                        <tr key={product.id}>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                                                <div className="h-10 w-10 relative">
                                                    <Image
                                                        src={product.image_url || '/placeholder.png'}
                                                        alt={product.name}
                                                        fill
                                                        className="rounded-full object-cover"
                                                    />
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">
                                                {product.name}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                {product.category}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                ₹{product.price}
                                            </td>
                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                <div className="flex justify-end items-center gap-2">
                                                    <Link
                                                        href={`/admin/products/${product.id}/edit`}
                                                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                                                        title="Edit Product"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                                                    </Link>
                                                    <DeleteProductButton id={product.id} name={product.name} />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {(!products || products.length === 0) && (
                                        <tr>
                                            <td colSpan={5} className="py-6 text-center text-gray-500 text-sm">
                                                No products found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

