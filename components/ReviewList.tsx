'use client';

import { Star, User, Loader2, Play, Trash2 } from 'lucide-react';
import { deleteReview } from '@/actions/reviews';
import { useState } from 'react';

interface ReviewListProps {
    reviews: any[];
    isLoading: boolean;
    productId: string;
    currentUserId?: string;
    onDeleteSuccess?: () => void;
}

export default function ReviewList({ reviews, isLoading, productId, currentUserId, onDeleteSuccess }: ReviewListProps) {
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    const handleDelete = async (reviewId: string) => {
        if (!confirm('Are you sure you want to delete this review?')) return;

        setIsDeleting(reviewId);
        const result = await deleteReview(reviewId, productId);

        if (result.success) {
            onDeleteSuccess?.();
        } else {
            alert(result.error || 'Failed to delete review');
        }
        setIsDeleting(null);
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
                <p className="text-gray-500 font-medium">Loading reviews...</p>
            </div>
        );
    }

    if (reviews.length === 0) {
        return (
            <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                    < Star className="h-8 w-8 text-gray-300" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">No reviews yet</h3>
                <p className="text-gray-500 mt-1">Be the first to share your experience with this product!</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {reviews.map((review) => (
                <div key={review.id} className="pb-8 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center overflow-hidden">
                                {review.profiles?.avatar_url ? (
                                    <img src={review.profiles.avatar_url} alt="avatar" className="h-full w-full object-cover" />
                                ) : (
                                    <User className="h-6 w-6 text-blue-400" />
                                )}
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 leading-none">
                                    {review.profiles?.full_name || 'Verified Buyer'}
                                </h4>
                                <div className="flex items-center gap-2 mt-1.5">
                                    <div className="flex text-yellow-400">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <Star
                                                key={s}
                                                className={`h-3.5 w-3.5 ${review.rating >= s ? 'fill-current' : 'text-gray-200'}`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">
                                        {new Date(review.created_at).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {currentUserId === review.user_id && (
                            <button
                                onClick={() => handleDelete(review.id)}
                                disabled={isDeleting === review.id}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all disabled:opacity-50"
                                title="Delete Review"
                            >
                                {isDeleting === review.id ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <Trash2 className="h-5 w-5" />
                                )}
                            </button>
                        )}
                    </div>

                    <div className="pl-0 md:pl-15">
                        <p className="text-gray-700 leading-relaxed text-sm md:text-base mb-4">
                            {review.content}
                        </p>

                        {review.media && review.media.length > 0 && (
                            <div className="flex flex-wrap gap-3">
                                {review.media.map((item: any, i: number) => (
                                    <div
                                        key={i}
                                        className="relative h-20 w-20 md:h-28 md:w-28 rounded-lg overflow-hidden border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity bg-gray-50"
                                        onClick={() => window.open(item.url, '_blank')}
                                    >
                                        {item.type === 'image' ? (
                                            <img src={item.url} alt="review" className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center relative">
                                                <video src={item.url} className="h-full w-full object-cover" />
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                                    <Play className="h-8 w-8 text-white fill-white/50" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
