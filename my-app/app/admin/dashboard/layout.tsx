import { AdminSidebar } from "@/components/admin/sidebar";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <AdminSidebar />
      <main className="mr-64 min-h-screen">
        {children}
      </main>
    </div>
  );
}
