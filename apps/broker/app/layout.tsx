import { FC, ReactNode } from 'react';
import './global.css';

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout: FC<RootLayoutProps> = ({ children }) => (
  <html lang="en">
  <body>{children}</body>
  </html>
);

export default RootLayout;
