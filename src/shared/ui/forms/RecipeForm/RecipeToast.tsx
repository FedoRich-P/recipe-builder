import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type RecipeToastProps = {
  recipeName: string
  onClose: () => void
  duration?: number
}

export const RecipeToast = ({ recipeName, onClose, duration = 3000 }: RecipeToastProps) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 30 }}
                  className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white border border-green-200 shadow-lg rounded-2xl px-6 py-4 flex items-start gap-3 w-full max-w-sm">
        <CheckCircleIcon className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
        <div className="overflow-hidden">
          <p className="font-semibold text-gray-800 truncate">Рецепт добавлен Успешно!</p>
          <p className="text-gray-600 text-sm mt-0.5 truncate">
            Рецепт "{recipeName}" сохранён
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};