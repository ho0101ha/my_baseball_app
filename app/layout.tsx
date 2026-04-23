import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { auth } from "@/lib/auth";
import MobileMenu from "@/components/MobileMenu";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "basebollpark-app",
  description: "enjoy your baseball",
};

export default  async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
 
}>) {
  const session = await auth();
  const isLoggedIn = !!session?.user;
  return (
    <html lang="ja">
      <body className="bg-slate-50 text-slate-900 min-h-screen flex flex-col relative -z-1">
        <nav className="bg-slate-900 px-6 py-4 sticky top-0 z-40 shadow-lg">
          <header className="max-w-6xl mx-auto flex justify-between items-center">
            {/* ロゴ */}
            <Link href="/" className="text-white font-black text-2xl italic tracking-tighter">
              ⚾️ BASELOG
            </Link>

            {/* PC・タブレット版メニュー (md以上で表示) */}
            <div className="hidden md:flex items-center space-x-8 text-s font-black uppercase tracking-widest text-slate-50">
              <Link href="/" className="hover:underline transition-all">ダッシュボード</Link>
              <Link href="/map" className="hover:underline transition-all">マップ</Link>
              
              {isLoggedIn && (
                <Link 
                  href="/account" 
                  className="bg-blue-600 text-white px-4 py-2 rounded-l hover:bg-blue-500 transition-all italic text-s"
                >
                  設定ページ
                </Link>
              )}
            </div>

            {/* モバイル版メニュー (md未満で表示) */}
            <MobileMenu isLoggedIn={isLoggedIn} />
          </header>
        </nav>

        <main className="grow">
          {children}
        </main>
      </body>
    </html>
  );
}