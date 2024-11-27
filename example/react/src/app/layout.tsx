'use client';

import { Inter } from 'next/font/google';
import '../styles/global.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <nav className="bg-gray-800 text-white p-4">
                    <div className="container mx-auto">
                        <h1 className="text-2xl font-bold mb-4">Performance Examples</h1>
                        <div className="flex space-x-4">
                            <a href="/" className="hover:text-gray-300">Home</a>
                            <a href="/heavy-list" className="hover:text-gray-300">Heavy List</a>
                            <a href="/performance-monitor" className="hover:text-gray-300">Performance Monitor</a>
                            <a href="/power-aware" className="hover:text-gray-300">Power Aware</a>
                        </div>
                    </div>
                </nav>

                <main className="container mx-auto p-6">
                    {children}
                </main>
            </body>
        </html>
    );
}