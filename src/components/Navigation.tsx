import { NavLink } from 'react-router-dom';
import { FaHeart, FaPizzaSlice } from 'react-icons/fa';

export const Navigation = () => {
  return (
    <nav className="container px-4 flex space-x-6 items-center justify-center gap-10">
      <NavLink to="/"
               className={({ isActive }) =>
                 `flex items-center gap-2 text-lg font-bold underline underline-offset-4 decoration-2 transition ${
                   isActive
                     ? 'text-orange-600 decoration-orange-600'
                     : 'text-gray-800 decoration-gray-400 hover:text-orange-500 hover:decoration-orange-500'
                 }`
               }>
        Все рецепты
        <FaPizzaSlice className="w-5 h-5" />
      </NavLink>

      <NavLink to="/favorites"
               className={({ isActive }) =>
                 `flex items-center gap-2 text-lg font-bold underline underline-offset-4 decoration-2 transition ${
                   isActive
                     ? 'text-orange-600 decoration-orange-600'
                     : 'text-gray-800 decoration-gray-400 hover:text-orange-500 hover:decoration-orange-500'
                 }`
               }>
        Избранные
        <FaHeart className="w-5 h-5" />
      </NavLink>
    </nav>
  );
};
