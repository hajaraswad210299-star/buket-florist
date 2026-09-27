export type Product = {
 id: string; slug: string; name: string; description: string; price: number;
 stock: number; product_group: string; category: string; image_url: string;
 gallery: string[]; delivery_cities: string[];
 is_active?: boolean; size_cm?: number | null; tags?: string[];
 content_sections?: { heading: string; body: string }[]; updated_at?: string;
};
export const formatPrice = (price: number) => `Rp ${price.toLocaleString("id-ID")}`;
export const productHref = (slug: string) => `/product/detail/${encodeURIComponent(slug)}`;
