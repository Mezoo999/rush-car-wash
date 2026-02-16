import { ProtectedAdminRoute } from "@/components/admin/protected-route";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedAdminRoute>
      {children}
    </ProtectedAdminRoute>
  );
}
