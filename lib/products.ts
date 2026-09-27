export type Product = {
 id: string; slug: string; name: string; description: string; price: number;
 stock: number; product_group: string; category: string; image_url: string;
 gallery: string[]; delivery_cities: string[];
};
export const formatPrice = (price: number) => `Rp ${price.toLocaleString("id-ID")}`;
export const productHref = (slug: string) => `/product/detail/${encodeURIComponent(slug)}`;
