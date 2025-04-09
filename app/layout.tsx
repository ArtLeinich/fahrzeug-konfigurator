import { ReactNode } from 'react';
import ClientWrapper from './ClientWrapper';

import "@/app/globals.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="de">
      <body>
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}