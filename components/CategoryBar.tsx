"use client";

import Link from "next/link";
import { useState } from "react";

const mainCategories = [
  "All",
  "Stash",
  "Rolling machine",
  "Scents",
  "Others",
  "Shisha",
  "Detox",
  "Kits",
  "Apparels",
  "Storage",
];

const moreCategories = [
  "Cigars & wraps",
  "Bongs",
  "Pipes",
  "Ash trays",
  "Rolling trays",
  "Vapes",
  "Lighters",
  "Crushers",
  "Rolling papers",
];

export default function CategoryBar() {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full border-b bg-gray-100 relative">
      <div className="flex items-center gap-6 px-4 md:px-6 py-3 text-sm overflow-x-auto whitespace-nowrap">
        {/* MAIN */}
        {mainCategories.map((cat, index) => (
          <Link
            key={index}
            href={cat === "All" ? "/" : `/category/${cat.toLowerCase()}`}
            className="flex-shrink-0 hover:text-green-600 transition"
          >
            {cat}
          </Link>
        ))}

        {/* ✅ MORE BUTTON (RIGHT SIDE) */}
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="flex-shrink-0 ml-auto px-3 py-1.5 border rounded-md text-sm font-medium hover:bg-gray-200 transition"
        >
          More •••
        </button>
      </div>

      {/* ✅ DROPDOWN (LIST STYLE) */}
      <div
        className={`absolute right-6 top-full mt-2 w-56 bg-white border rounded-lg shadow-lg transition-all duration-200 z-50
        ${
          open
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <div className="py-2">
          {moreCategories.map((cat, index) => (
            <Link
              key={index}
              href={`/category/${cat.toLowerCase()}`}
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-sm hover:bg-gray-100 transition"
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}