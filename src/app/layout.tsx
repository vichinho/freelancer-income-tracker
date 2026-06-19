import type { ReactNode } from 'react';
import './globals.css';

export const metadata = {
  title: 'Freelancer Income Tracker',
  description: 'Mini SaaS para seguimiento de clientes y proyectos',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}