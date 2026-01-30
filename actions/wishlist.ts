'use server'

import { createActionClient, createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function toggleWishlist(productId: string) {
    const supabase = createActionClient()

    // Check if user is logged in
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: 'You must be logged in to add items to your wishlist.' }
    }

    // Check if item exists in wishlist
    const { data: existing } = await supabase
        .from('wishlist')
        .select('id')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .single()

    if (existing) {
        // Remove
        const { error } = await supabase
            .from('wishlist')
            .delete()
            .eq('id', existing.id)

        if (error) return { error: error.message }
        revalidatePath('/')
        return { action: 'removed' }
    } else {
        // Add
        const { error } = await supabase
            .from('wishlist')
            .insert({
                user_id: user.id,
                product_id: productId
            })

        if (error) return { error: error.message }
        revalidatePath('/')
        return { action: 'added' }
    }
}

export async function getWishlistIds() {
    try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) return []

        const { data } = await supabase
            .from('wishlist')
            .select('product_id')
            .eq('user_id', user.id)

        return data?.map(item => item.product_id) || []
    } catch (error) {
        console.error('Failed to get wishlist ids (likely missing env vars):', error);
        return [];
    }
}
