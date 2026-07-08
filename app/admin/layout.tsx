import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin — UpliftGrove Foundation",
  robots: { index: false, follow: false },
};

// Full-screen shell layered above the public site chrome (navbar/footer) so the
// admin area reads as its own app without restructuring the public routes.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-bg-warm-sand">
      {children}
    </div>
  );
}
