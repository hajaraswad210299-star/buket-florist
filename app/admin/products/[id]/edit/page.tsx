import { notFound } from "next/navigation";
import { getAdminProduct } from "@/lib/admin-db";
import { isAdmin } from "@/lib/admin-session";
import AdminCreateProduct from "@/components/admin/AdminCreateProduct";
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
 if (!await isAdmin()) return null;
 const { id } = await params;
 const product = await getAdminProduct(id);
 if (!product) notFound();
 return <AdminCreateProduct product={product} />;
}
