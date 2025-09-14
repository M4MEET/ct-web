import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'], 
  display: 'swap',
  variable: '--font-inter' 
});

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'], 
  display: 'swap',
  variable: '--font-jetbrains-mono' 
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} bg-codex-terminal-body`}>
      <body className="font-sans min-h-screen bg-codex-terminal-body antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}