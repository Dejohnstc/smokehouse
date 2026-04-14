import "./globals.css";
import { CartProvider } from "@/components/CartContext";
import { AuthProvider } from "@/components/AuthContext";
import WhatsAppButton from "@/components/WhatsAppButton";

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
      <body>
        <AuthProvider>
          <CartProvider>{children}</CartProvider>
        </AuthProvider>

        <WhatsAppButton />
      </body>
    </html>
  );
}