import { HeartIcon, TrashIcon } from '@heroicons/react/24/outline';

type FavoriteDeleteButtonsProps = {
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onDelete: () => void;
  className?: string;
};

export const FavoriteDeleteButtons = ({ isFavorite, onToggleFavorite, onDelete, className }: FavoriteDeleteButtonsProps) => (
  <div className={`flex items-center gap-2 ${className}`}>
    <button onClick={onToggleFavorite}
      className={`p-2 rounded-full ${isFavorite ? 'bg-red-100 text-red-500' : 'bg-white text-gray-400'} shadow-sm hover:scale-110 transition-transform`}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}>
      <HeartIcon className={`w-10 h-6 ${isFavorite ? 'fill-current' : ''}`} />
    </button>
    <button onClick={onDelete}
      className="p-2 rounded-full bg-red-100 text-red-500 shadow-sm hover:scale-110 transition-transform"
      aria-label="Delete recipe">
      <TrashIcon className="w-10 h-6" />
    </button>
  </div>
);
