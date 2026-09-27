import AdminDashboard from "@/components/admin/AdminDashboard";
import { getAdminProducts } from "@/lib/admin-db";
import { isAdmin } from "@/lib/admin-session";
export default async function Page() {
 if (!await isAdmin()) return null;
 return <AdminDashboard products={await getAdminProducts()} />;
}
