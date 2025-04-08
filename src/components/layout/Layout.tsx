import { Header } from '@components/Header';
import { Sidebar } from '@components/sidebar/Sidebar';
import { Outlet } from 'react-router-dom';

export const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col mx-w-['1400px']">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="grid columns-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};