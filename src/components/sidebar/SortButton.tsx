import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';
import { SortOption } from '@/shared/types/recipe';
import { ReactNode } from 'react';

interface SortButtonProps {
  active: boolean;
  sortKey: string;
  currentSort: SortOption;
  onClick: () => void;
  children: ReactNode;
}

export const SortButton = ({
                             active,
                             sortKey,
                             currentSort,
                             onClick,
                             children,
                           }: SortButtonProps) => {
  const getSortIcon = () => {
    if (!active) return null;
    return currentSort === `${sortKey}-asc` ? (
      <ArrowUpIcon className="w-4 h-4" />
    ) : (
      <ArrowDownIcon className="w-4 h-4" />
    );
  };

  return (
    <button onClick={onClick}
            className={`w-full flex items-center justify-center px-5 py-3 rounded-full text-sm ${
              active ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-700'
            }`}>
      <span className="mr-2">{children}</span>
      {getSortIcon()}
    </button>
  );
};