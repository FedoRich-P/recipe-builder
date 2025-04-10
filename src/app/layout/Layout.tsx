import { Header } from '@/widgets/header/Header';
import { Sidebar } from '@/widgets/sidebar/Sidebar';
import { Outlet } from 'react-router-dom';

export const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-[1440px] mx-auto">
      <Header />
      <div className="flex gap-1">
        <Sidebar />
        <main className="grid columns-4 w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};