import { Bars3Icon } from '@heroicons/react/24/solid';

interface MobileMenuButtonProps {
  onClick: () => void;
  className?: string;
}

export const MobileMenuButton = ({ onClick, className }: MobileMenuButtonProps) => {
  return (
    <button onClick={onClick}
            className={`fixed top-4 right-4 z-50 p-3 bg-black/20 hover:bg-black/30  backdrop-blur-sm shadow-lg rounded-full lg:hidden flex items-center justify-center border border-white/20 transition-all group ${className}`}>
      <Bars3Icon className="w-9 h-9 text-gray/90 group-hover:text-white" />
    </button>
  );
};