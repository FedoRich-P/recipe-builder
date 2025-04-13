import { UseFormRegister } from 'react-hook-form';
import { RecipeFormData } from '@/features/recipe/model/types/recipe';

export const FormInputGroup = ({ register }: { register: UseFormRegister<RecipeFormData> }) => (
  <div className="grid sm:grid-cols-2 gap-4 mb-4">
    <div>
      <label className="block text-sm">Время приготовления:</label>
      <input placeholder={'(мин):'}
             type="number"
             min={0}
             {...register('cookingTime', { valueAsNumber: true })}
             className="w-full border px-2 py-1 rounded" />
    </div>
    <div>
      <label className="block text-sm">Калорийность :</label>
      <input placeholder={'(ккал)'}
             type="number"
             min={0}
             {...register('calories', { valueAsNumber: true })}
             className="w-full border px-2 py-1 rounded" />
    </div>
  </div>
);


// import { UseFormRegister } from 'react-hook-form';
// import { RecipeFormData } from './RecipeForm';
//
// type FormInputGroupProps = {
//   register: UseFormRegister<RecipeFormData>;
// }
//
// export const FormInputGroup = ({ register }: FormInputGroupProps) => {
//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4 mb-4">
//
//       <label className="block text-sm font-medium text-gray-700">
//         Время приготовления:
//         <input
//           type={'number'}
//           {...register('cookingTime', {
//             required: 'Обязательное поле',
//           })}
//           placeholder="Например: 30 мин"
//           className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//       </label>
//       <label className="block text-sm font-medium text-gray-700">
//         Калорийность (ккал):
//         <input type="number"
//           step="1"
//           {...register('calories', {
//             required: 'Укажите калорийность',
//             valueAsNumber: true,
//             min: { value: 0, message: 'Калорийность не может быть отрицательной' }
//           })}
//           placeholder="Например: 250"
//           className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
//       </label>
//     </div>
//   );
// };