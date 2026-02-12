'use client';

import { Star } from 'lucide-react';

interface RatingSummaryProps {
    average: string;
    count: number;
}

export default function RatingSummary({ average, count }: RatingSummaryProps) {
    const handleScroll = () => {
        const element = document.getElementById('reviews');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <button
            onClick={handleScroll}
            className="flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity"
        >
            <div className="bg-green-600 text-white text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1 shadow-sm">
                {average} <Star className="h-3 w-3 fill-white" />
            </div>
            <span className="text-sm text-gray-500 font-medium underline-offset-4 hover:underline text-left">
                ({count} {count === 1 ? 'review' : 'reviews'})
            </span>
        </button>
    );
}
