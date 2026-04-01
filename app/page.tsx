import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";
import CategoryBar from "../components/CategoryBar";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <br/>
      <CategoryBar/>
      <ProductGrid />
      <Footer />
      
    </main>
  );
}