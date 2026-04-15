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

      <body className="bg-gray-50"> {/* 💎 subtle background */}

        <AuthProvider>
          <CartProvider>

            {/* 🔥 GLOBAL BACK BUTTON */}
            <BackButton />

            {/* 🔥 FIX OVERLAP HERE */}
            <main className="pt-20 px-4 md:px-6">
              <PageTransition>
                {children}
              </PageTransition>
            </main>

          </CartProvider>
        </AuthProvider>

        <WhatsAppButton />
      </body>
    </html>
  );
}