export default function Footer() {
  return (
    <footer className="bg-black text-white px-6 py-12 mt-16">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">
        {/* LEFT */}
        <div>
          <p className="mb-4 cursor-pointer">Home</p>

          <h2 className="font-semibold mb-3">CONTACT US</h2>

          <p className="mb-2">📞 +2348154687701</p>
          <p>📍 Shomolu</p>

          <div className="mt-6">
            <span className="bg-gray-800 px-4 py-2 inline-block">
              POWERED BY BUMPA
            </span>
          </div>
        </div>

        {/* RIGHT */}
        <div>
          <h2 className="font-semibold mb-4">
            SIGN UP FOR DISCOUNTS & UPDATES
          </h2>

          <input
            placeholder="Enter your phone number or email address"
            className="w-full p-4 rounded bg-gray-800 mb-4 outline-none"
          />

          <button className="bg-green-600 px-6 py-3 rounded font-semibold">
            Subscribe
          </button>
        </div>
      </div>
    </footer>
  );
}