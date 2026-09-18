import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';

export const metadata = {
  title: 'Football OS',
  description:
    'Infrastructure professionnelle de recrutement et de gestion dans le football.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0f1216',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-surface-base font-sans text-content-primary antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}