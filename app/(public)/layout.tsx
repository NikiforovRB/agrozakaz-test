import { Header } from "@/components/catalog/Header";
import { NavBar } from "@/components/catalog/NavBar";
import { Footer } from "@/components/catalog/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <NavBar />
      <main className="flex-1 bg-muted/30">{children}</main>
      <Footer />
    </div>
  );
}
