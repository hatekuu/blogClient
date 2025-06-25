// app/layout.tsx
import ClientNav from '@/components/ClientNav';
import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'Blog App',
  description: 'Ứng dụng viết blog đơn giản với Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body
        className="bg-gray-50 text-gray-800 h-screen"
        suppressHydrationWarning // Suppress hydration warnings for browser extension attributes
      >
        <nav className="bg-white shadow px-6 py-4 mb-8">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <Link href="/" className="text-xl font-bold text-blue-600">
              BlogApp
            </Link>
        <ClientNav/>
          </div>
        </nav>
        <main className="h-full w-full">{children}</main>
      </body>
    </html>
  );
}