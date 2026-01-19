'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createActionClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// Admin Credentials
const ADMIN_USER = 'admin0526'
const ADMIN_PASS = 'admin0526'
const ADMIN_COOKIE = 'admin_session_token'

export async function adminLogin(formData: FormData) {
    const username = formData.get('username') as string
    const password = formData.get('password') as string

    if (!username || !password) {
        return { error: 'Username and password are required' }
    }

    if (username === ADMIN_USER && password === ADMIN_PASS) {
        // Set secure cookie
        cookies().set(ADMIN_COOKIE, 'true', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge: 60 * 60 * 24 // 1 day
        })
        redirect('/admin/dashboard')
    }

    return { error: 'Invalid credentials' }
}

export async function adminLogout() {
    cookies().delete(ADMIN_COOKIE)
    redirect('/admin')
}

export async function addProduct(state: any, formData: FormData) {
    const name = formData.get('name') as string
    const brand = formData.get('brand') as string
    const category = formData.get('category') as string
    const price = parseFloat(formData.get('price') as string)
    const description = formData.get('description') as string

    // File upload handling - modified for multiple images
    const imageFiles = formData.getAll('images') as File[]

    if (!name || !price || !category || !imageFiles || imageFiles.length === 0) {
        return { error: 'Name, Price, Category and at least one Image are required' }
    }

    const supabase = createActionClient()
    const imageUrls: string[] = []

    // Upload all images
    for (const file of imageFiles) {
        if (file.size > 0) {
            const filename = `${Date.now()}-${file.name.replaceAll(' ', '_')}`
            const { data, error: uploadError } = await supabase
                .storage
                .from('products')
                .upload(filename, file, {
                    cacheControl: '3600',
                    upsert: false
                })

            if (uploadError) {
                console.error('Upload Error:', uploadError)
                continue // Skip failed uploads or return error? Let's skip for now but log.
            }

            const { data: { publicUrl } } = supabase
                .storage
                .from('products')
                .getPublicUrl(filename)

            imageUrls.push(publicUrl)
        }
    }

    if (imageUrls.length === 0) {
        return { error: 'Failed to upload any images' }
    }

    const sellingPrice = Math.round(price * 0.8) // 20% off logic

    const { error } = await supabase.from('products').insert({
        name,
        category,
        price: sellingPrice,
        image_url: imageUrls[0], // Keep backward compatibility
        images: imageUrls,       // New array column
        description,
        brand
    })

    if (error) {
        console.error('Add Product Error:', error)
        return { error: 'Failed to add product: ' + error.message }
    }

    revalidatePath('/')
    revalidatePath('/admin/dashboard')
    revalidatePath('/admin/products')

    return { success: true }
}

export async function updateProduct(id: string, prevState: any, formData: FormData) {
    const name = formData.get('name') as string
    const brand = formData.get('brand') as string
    const category = formData.get('category') as string
    const price = parseFloat(formData.get('price') as string)
    const description = formData.get('description') as string

    // Existing images (passed as strings)
    const existingImages = formData.getAll('existing_images') as string[]
    // New images (passed as files)
    const newImageFiles = formData.getAll('new_images') as File[]

    if (!name || !price || !category) {
        return { error: 'Name, Price and Category are required' }
    }

    const supabase = createActionClient()
    const finalImageUrls: string[] = [...existingImages]

    // Upload new images
    for (const file of newImageFiles) {
        if (file.size > 0) {
            const filename = `${Date.now()}-${file.name.replaceAll(' ', '_')}`
            const { error: uploadError } = await supabase
                .storage
                .from('products')
                .upload(filename, file, {
                    cacheControl: '3600',
                    upsert: false
                })

            if (uploadError) {
                console.error('Upload Error:', uploadError)
                continue
            }

            const { data: { publicUrl } } = supabase
                .storage
                .from('products')
                .getPublicUrl(filename)

            finalImageUrls.push(publicUrl)
        }
    }

    const sellingPrice = Math.round(price * 0.8) // Re-calculate price? If user edits price, yes.

    const { error } = await supabase.from('products').update({
        name,
        category,
        price: sellingPrice,
        description,
        brand,
        images: finalImageUrls,
        image_url: finalImageUrls.length > 0 ? finalImageUrls[0] : null // Update primary image
    }).eq('id', id)

    if (error) {
        console.error('Update Product Error:', error)
        return { error: 'Failed to update product: ' + error.message }
    }

    revalidatePath('/')
    revalidatePath('/admin/products')
    revalidatePath(`/product/${id}`)
    revalidatePath('/admin/dashboard')

    return { success: true }
}

export async function deleteProduct(id: string) {
    const supabase = createActionClient()
    const { error } = await supabase.from('products').delete().eq('id', id)

    if (error) {
        console.error('Delete Product Error:', error)
        return { error: 'Failed to delete product: ' + error.message }
    }

    revalidatePath('/')
    revalidatePath('/admin/products')
    revalidatePath('/admin/dashboard')

    return { success: true }
}
