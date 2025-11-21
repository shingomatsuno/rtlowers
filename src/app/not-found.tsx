import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black px-6 text-center text-white">
      <h1 className="mb-4 text-9xl font-black tracking-tighter text-white/10 md:text-[12rem]">
        404
      </h1>
      <div className="absolute">
        <h2 className="mb-6 text-3xl font-bold tracking-widest md:text-4xl">
          PAGE NOT FOUND
        </h2>
        <p className="mb-8 text-gray-400">
          お探しのページは見つかりませんでした。
        </p>
        <Link
          href="/"
          className="inline-block rounded-full border border-white/20 bg-white/5 px-8 py-3 text-sm font-bold tracking-widest text-white transition-colors hover:bg-white hover:text-black"
        >
          RETURN HOME
        </Link>
      </div>
    </div>
  );
}
