import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';

export const BackButton = ({ className = '' }: { className?: string }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className={`flex items-center text-gray-600 hover:text-gray-900 ${className}`}
    >
      <ArrowLeftIcon className="w-5 h-5 mr-2" />
      Назад
    </button>
  );
};