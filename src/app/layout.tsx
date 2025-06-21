// app/layout.tsx

import './globals.css';
import Link from 'next/link';
import dynamic from 'next/dynamic';

export const metadata = {
  title: 'Blog App',
  description: 'Ứng dụng viết blog đơn giản với Next.js',
};
const ClientNav = dynamic(() => import('@/components/ClientNav'), {
  ssr: false,
  loading: () => <div>Loading nav...</div>,
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="bg-gray-50 text-gray-800 h-screen">
        <nav className="bg-white shadow px-6 py-4 mb-8">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <Link href="/" className="text-xl font-bold text-blue-600">BlogApp</Link>
              <ClientNav />
          </div>
        </nav>
        <main className=' h-full w-full '>{children}</main>
      </body>
    </html>
  );
}
