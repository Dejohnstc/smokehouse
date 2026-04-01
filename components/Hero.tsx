export default function Hero() {
  return (
    <section className="relative h-[400px] w-full">
  {/* BACKGROUND IMAGE */}
  <img
    src="https://images.unsplash.com/photo-1603909223429-69bb7101f420?q=80&w=2070&auto=format&fit=crop"
    className="absolute inset-0 w-full h-full object-cover"
  />

  {/* OVERLAY */}
  <div className="absolute inset-0 bg-black/40" />

  {/* TEXT */}
  <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
    <h1 className="text-3xl md:text-5xl font-bold">
      Wholesale & Retail of Premium Tools
    </h1>

    <p className="mt-2 text-lg">
      Welcome to Nature Smokehouse
    </p>
  </div>
</section>
  );
}