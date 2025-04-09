import { motion } from "framer-motion";

type Props = {
  suggestions: string[];
  onSelect: (value: string) => void;
};

export const IngredientSuggestions = ({ suggestions, onSelect }: Props) => {


  if (suggestions.length === 0) return null;

  return (
    <motion.ul
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      transition={{ duration: 0.2 }}
      className="
        absolute top-full left-0 z-20 w-full mt-1
        bg-white border border-gray-200 rounded-xl
        shadow-lg overflow-hidden max-h-60 overflow-y-auto
      "
    >
      {suggestions.map((item) => (
        <li
          key={item}
          onClick={() => onSelect(item)}
          className="px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 cursor-pointer transition-colors"
        >
          {item}
        </li>
      ))}
    </motion.ul>
  );
};
