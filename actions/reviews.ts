'use server';

import { createSafeSupabaseClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export interface ReviewMedia {
    url: string;
    type: 'image' | 'video';
}

export interface ReviewSubmitData {
    productId: string;
    rating: number;
    content: string;
    media: ReviewMedia[];
}

export async function submitReview(data: ReviewSubmitData) {
    const supabase = createSafeSupabaseClient();
    if (!supabase) return { error: 'Failed to initialize Supabase' };

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'You must be logged in to post a review' };

    const { error } = await supabase
        .from('reviews')
        .insert({
            product_id: data.productId,
            user_id: user.id,
            rating: data.rating,
            content: data.content,
            media: data.media
        } as any);

    if (error) {
        console.error('Error submitting review to Supabase:', error);
        return { error: `Database error: ${error.message}` };
    }

    revalidatePath(`/product/${data.productId}`);
    return { success: true };
}

export async function getReviews(productId: string) {
    const supabase = createSafeSupabaseClient();
    if (!supabase) return { data: [] };

    const { data, error } = await supabase
        .from('reviews')
        .select(`
            *,
            profiles:user_id (
                full_name
            )
        `)
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching reviews:', error);
        return { data: [], error: error.message };
    }

    return { data: data || [] };
}

export async function deleteReview(reviewId: string, productId: string) {
    const supabase = createSafeSupabaseClient();
    if (!supabase) return { error: 'Failed to initialize Supabase' };

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Authentication required' };

    // Delete the review (RLS will handle ownership check, but we double check here)
    const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId)
        .eq('user_id', user.id);

    if (error) {
        console.error('Error deleting review:', error);
        return { error: error.message };
    }

    revalidatePath(`/product/${productId}`);
    return { success: true };
}
