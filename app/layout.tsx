import "./globals.css";
import { CartProvider } from "@/components/CartContext";
import { AuthProvider } from "@/components/AuthContext";
import WhatsAppButton from "@/components/WhatsAppButton";
import BackButton from "@/components/BackButton";
import PageTransition from "@/components/PageTransition";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
      </head>

      <body className="bg-gray-50">

        <AuthProvider>
          <CartProvider>

            {/* 🔥 FLOATING BACK BUTTON */}
            <BackButton />

            {/* ✅ NO GLOBAL PADDING / NO pt-20 */}
            <PageTransition>
              {children}
            </PageTransition>

          </CartProvider>
        </AuthProvider>

        <WhatsAppButton />
      </body>
    </html>
  );
}