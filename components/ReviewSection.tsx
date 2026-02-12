'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';
import { getReviews } from '@/actions/reviews';
import { Star } from 'lucide-react';

interface ReviewSectionProps {
    productId: string;
    userId?: string;
}

export default function ReviewSection({ productId, userId }: ReviewSectionProps) {
    const searchParams = useSearchParams();
    const [reviews, setReviews] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(searchParams.get('review') === 'true');

    const fetchReviews = async () => {
        setIsLoading(true);
        const { data } = await getReviews(productId);
        setReviews(data || []);
        setIsLoading(false);
    };

    useEffect(() => {
        const init = async () => {
            await fetchReviews();
            // If we are coming from order history or no reviews yet, auto-show form
            if (userId && (searchParams.get('review') === 'true')) {
                setShowForm(true);
            }
        };
        init();
    }, [productId, userId, searchParams]);

    // Handle auto-show in render logic for better UX when reviews load
    useEffect(() => {
        if (!isLoading && reviews.length === 0 && userId && !showForm) {
            setShowForm(true);
        }
    }, [isLoading, reviews.length, userId, showForm]);

    const averageRating = reviews.length > 0
        ? (reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length).toFixed(1)
        : 0;

    return (
        <section className="mt-12 bg-white rounded-lg shadow-sm p-4 md:p-8 border border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900">Customer Reviews</h2>
                    <div className="flex items-center gap-2 mt-2">
                        <div className="flex text-yellow-400">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <Star
                                    key={s}
                                    className={`h-5 w-5 ${Number(averageRating) >= s ? 'fill-current' : 'text-gray-200'}`}
                                />
                            ))}
                        </div>
                        <span className="text-lg font-bold text-gray-900">{averageRating} out of 5</span>
                        <span className="text-sm text-gray-500">({reviews.length} reviews)</span>
                    </div>
                </div>

                {userId ? (
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className={`px-6 py-2.5 font-bold rounded-lg transition-all shadow-sm ${showForm
                            ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                    >
                        {showForm ? 'Cancel' : 'Write a Review'}
                    </button>
                ) : (
                    <Link
                        href="/login"
                        className="px-6 py-2.5 bg-gray-100 text-gray-600 font-bold rounded-lg hover:bg-gray-200 transition-colors shadow-sm"
                    >
                        Login to Review
                    </Link>
                )}
            </div>

            {showForm && (
                <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-500">
                    <ReviewForm
                        productId={productId}
                        onSuccess={() => {
                            setShowForm(false);
                            fetchReviews();
                        }}
                    />
                </div>
            )}

            <ReviewList
                reviews={reviews}
                isLoading={isLoading}
                productId={productId}
                currentUserId={userId}
                onDeleteSuccess={fetchReviews}
            />
        </section>
    );
}
