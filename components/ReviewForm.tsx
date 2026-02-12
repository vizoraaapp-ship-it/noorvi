'use client';

import { useState, useRef } from 'react';
import { Star, Upload, X, Loader2, Image as ImageIcon, Video, User } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { submitReview, ReviewMedia } from '@/actions/reviews';

interface ReviewFormProps {
    productId: string;
    onSuccess: () => void;
}

export default function ReviewForm({ productId, onSuccess }: ReviewFormProps) {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [content, setContent] = useState('');
    const [media, setMedia] = useState<{ file: File; type: 'image' | 'video'; preview: string }[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const supabase = createClientComponentClient();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length + media.length > 5) {
            setError('Maximum 5 media files allowed');
            return;
        }

        const newMedia = files.map(file => ({
            file,
            type: file.type.startsWith('image/') ? 'image' as const : 'video' as const,
            preview: URL.createObjectURL(file)
        }));

        setMedia([...media, ...newMedia]);
        setError(null);
    };

    const removeMedia = (index: number) => {
        const item = media[index];
        URL.revokeObjectURL(item.preview);
        setMedia(media.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            setError('Please select a rating');
            return;
        }
        if (!content.trim() && media.length === 0) {
            setError('Please provide a comment or upload media');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const uploadedMedia: ReviewMedia[] = [];

            // 1. Upload files to Supabase Storage
            for (const item of media) {
                const fileExt = item.file.name.split('.').pop();
                const fileName = `${productId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

                const { data, error: uploadError } = await supabase.storage
                    .from('review-media')
                    .upload(fileName, item.file);

                if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);

                const { data: { publicUrl } } = supabase.storage
                    .from('review-media')
                    .getPublicUrl(fileName);

                uploadedMedia.push({ url: publicUrl, type: item.type });
            }

            // 2. Submit review record
            const result = await submitReview({
                productId,
                rating,
                content,
                media: uploadedMedia
            });

            if (result.error) {
                setError(result.error);
            } else {
                onSuccess();
            }
        } catch (err: any) {
            console.error('Catch block error in ReviewForm:', err);
            setError(err.message || 'An unexpected error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* User Profile Header */}
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center">
                            <User className="h-6 w-6 text-blue-400" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-900 leading-none">Your Public Profile</p>
                            <p className="text-[11px] text-gray-400 mt-1 uppercase tracking-wider font-medium">Posting publicly</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Rate your experience</label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <button
                                        key={s}
                                        type="button"
                                        onMouseEnter={() => setHoverRating(s)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        onClick={() => setRating(s)}
                                        className="focus:outline-none transition-transform hover:scale-110 active:scale-90"
                                    >
                                        <Star
                                            className={`h-10 w-10 ${(hoverRating || rating) >= s ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'
                                                } transition-colors duration-200`}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                rows={4}
                                className="w-full px-4 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder-gray-400 text-sm md:text-base leading-relaxed bg-gray-50/30"
                                placeholder="Share your experience with this product... What did you love about it?"
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Add Photos or Video</label>
                                <span className="text-[10px] text-gray-400 font-bold uppercase">{media.length} / 5</span>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {media.map((item, i) => (
                                    <div key={i} className="relative h-20 w-20 md:h-24 md:w-24 rounded-xl overflow-hidden border border-gray-200 shadow-sm group">
                                        {item.type === 'image' ? (
                                            <img src={item.preview} alt="preview" className="h-full w-full object-cover transition-transform group-hover:scale-110" />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center bg-gray-100">
                                                <Video className="h-8 w-8 text-gray-400" />
                                            </div>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => removeMedia(i)}
                                            className="absolute top-1.5 right-1.5 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}

                                {media.length < 5 && (
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="h-20 w-20 md:h-24 md:w-24 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 text-gray-400 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50/50 transition-all gap-1.5"
                                    >
                                        <div className="p-2 bg-gray-50 rounded-full group-hover:bg-blue-100 transition-colors">
                                            <Upload className="h-5 w-5" />
                                        </div>
                                        <span className="text-[9px] font-bold uppercase tracking-wider">Upload</span>
                                    </button>
                                )}
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                multiple
                                accept="image/*,video/*"
                            />
                            <p className="mt-3 text-[10px] text-gray-400 flex items-center gap-1">
                                <Upload className="h-3 w-3" /> Max 5 files. Support images and videos up to 50MB.
                            </p>
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100 flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                            {error}
                        </div>
                    )}

                    <div className="flex items-center gap-4 pt-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 active:scale-[0.98]"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Publishing...
                                </>
                            ) : (
                                'Post Your Review'
                            )}
                        </button>
                    </div>

                    <p className="text-center text-[10px] text-gray-400">
                        By posting, you agree to our Community Guidelines. Be helpful and polite!
                    </p>
                </form>
            </div>
        </div>
    );
}
