import { NavLink } from 'react-router-dom';
import { FaHeart, FaPizzaSlice } from 'react-icons/fa';
import { customCN } from '@/shared/lib/customCN';

type NavigationProps = {
  className?: string;
};

const baseLinkClasses = 'flex items-center gap-2 text-lg font-bold underline underline-offset-4 decoration-2 transition flex-shrink-0';
const inactiveClasses = 'text-gray-800 decoration-gray-400 hover:text-orange-500 hover:decoration-orange-500';
const activeClasses = 'text-orange-600 decoration-orange-600';

export const Navigation = ({ className }: NavigationProps) => {
  return (
    <nav className={customCN('px-4 flex space-x-6 items-center justify-center', className)}>
      <NavLink to="/"
               className={({ isActive }) => customCN(baseLinkClasses, isActive ? activeClasses : inactiveClasses)}>
        Все рецепты
        <FaPizzaSlice className="w-5 h-5" />
      </NavLink>

      <NavLink to="/favorites"
               className={({ isActive }) => customCN(baseLinkClasses, isActive ? activeClasses : inactiveClasses)}>
        Избранные
        <FaHeart className="w-5 h-5" />
      </NavLink>
    </nav>
  );
};