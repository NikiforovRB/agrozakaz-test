import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "АгроЗаказ — каталог запчастей для сельхозтехники",
  description:
    "Каталог запчастей для тракторов, комбайнов, измельчителей ботвы и другой сельхозтехники.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className="min-h-screen bg-white text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
