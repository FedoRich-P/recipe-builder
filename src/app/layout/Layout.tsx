import { Header } from '@/widgets/header/Header';
import { Sidebar } from '@/widgets/sidebar/Sidebar';
import { Outlet } from 'react-router-dom';

export const Layout = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 flex flex-col max-w-[1440px] mx-auto">
        <div className="flex gap-1">
          <Sidebar />
          <main className="grid columns-4 w-full pb-5">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
};