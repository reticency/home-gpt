import type { Metadata } from 'next';
import { ProjectProvider } from '@/context/ProjectContext';
import './globals.css';

export const metadata: Metadata = {
  title: 'HomeGPT - 装修后悔预防与家庭生活设计助手',
  description: '基于AI Agent的家庭空间设计助手，帮助您设计未来十年的生活',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="bg-background text-foreground font-sans">
        <ProjectProvider>{children}</ProjectProvider>
      </body>
    </html>
  );
}