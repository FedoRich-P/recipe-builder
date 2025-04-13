import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';

interface SortButtonProps {
  active: boolean;
  sortKey: string;
  currentSort: string;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}

export const SortButton = (props: SortButtonProps) => {
  const {
    active,
    currentSort,
    onClick,
    children,
    className,
  } = props;
  const getSortIcon = () => {
    if (!active) return null;
    return currentSort.endsWith('asc') ? (
      <ArrowUpIcon className="w-4 h-4" />
    ) : (
      <ArrowDownIcon className="w-4 h-4" />
    );
  };

  return (
    <button onClick={onClick}
            className={`flex items-center justify-center px-4 py-2 rounded-full text-sm transition-colors ${
              active ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-700'
            } ${className}`}>
      <span className="mr-2 whitespace-nowrap text-base">{children}</span>
      {getSortIcon()}
    </button>
  );
};
