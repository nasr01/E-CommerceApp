import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return <>
    <section className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b text-center px-4">
      {/* Title */}
      <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-4">
        Welcome to <span className="text-black">ShopMart</span>
      </h1>

      {/* Subtitle */}
      <p className="text-lg md:text-xl text-gray-700 max-w-2xl mb-8">
        Discover the latest technology, fashion, and lifestyle products.
        Quality guaranteed with fast shipping and excellent customer service.
      </p>


      {/* Buttons */}
      <div className="grid md:grid-cols-2 space-x-4 space-y-2">
        <Link href={'/products'}><button className="md:col-span-1 cursor-pointer px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition">
          Shop Now
        </button>
        </Link>

        <Link href={'/categories'}><button className="md:col-span-1 cursor-pointer px-6 py-3 border border-black text-black font-semibold rounded-lg hover:bg-gray-100 transition">
          Browse Categories
        </button>
        </Link>
      </div>
    </section>

  </>
}
