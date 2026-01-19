export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            categories: {
                Row: {
                    id: string
                    name: string
                }
                Insert: {
                    id?: string
                    name: string
                }
                Update: {
                    id?: string
                    name?: string
                }
                Relationships: []
            }
            products: {
                Row: {
                    id: string
                    name: string
                    category: string
                    price: number
                    image_url: string
                    images: string[] | null
                    description: string | null
                    created_at: string
                    brand: string | null
                }
                Insert: {
                    id?: string
                    name: string
                    category: string
                    price: number
                    image_url: string
                    images?: string[] | null
                    description?: string | null
                    created_at?: string
                    brand?: string | null
                }
                Update: {
                    id?: string
                    name?: string
                    category?: string
                    price?: number
                    image_url?: string
                    images?: string[] | null
                    description?: string | null
                    created_at?: string
                    brand?: string | null
                }
                Relationships: []
            }
            orders: {
                Row: {
                    id: string
                    customer_name: string
                    phone: string
                    address: string
                    product_name: string
                    quantity: number
                    created_at: string
                    user_id: string | null
                    total_price: number | null
                }
                Insert: {
                    id?: string
                    customer_name: string
                    phone: string
                    address: string
                    product_name: string
                    quantity: number
                    created_at?: string
                    user_id?: string | null
                    total_price?: number | null
                }
                Update: {
                    id?: string
                    customer_name?: string
                    phone?: string
                    address?: string
                    product_name?: string
                    quantity?: number
                    created_at?: string
                    user_id?: string | null
                    total_price?: number | null
                }
                Relationships: []
            }
            wishlist: {
                Row: {
                    id: string
                    user_id: string
                    product_id: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    product_id: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    product_id?: string
                    created_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "wishlist_product_id_fkey"
                        columns: ["product_id"]
                        referencedRelation: "products"
                        referencedColumns: ["id"]
                    }
                ]
            }
            profiles: {
                Row: {
                    id: string
                    email: string
                    full_name: string | null
                    avatar_url: string | null
                    role: string | null
                    created_at: string
                }
                Insert: {
                    id: string
                    email: string
                    full_name?: string | null
                    avatar_url?: string | null
                    role?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    email?: string
                    full_name?: string | null
                    avatar_url?: string | null
                    role?: string | null
                    created_at?: string
                }
                Relationships: []
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}
