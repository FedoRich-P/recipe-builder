import  { ChangeEvent, useState } from 'react';
import { FaUpload } from 'react-icons/fa6';
import { FieldError, UseFormRegister } from 'react-hook-form';
import { RecipeFormData } from '@/entities/recipe/model/types/recipe';

type ImageUploadProps = {
  register: UseFormRegister<RecipeFormData>;
  error?: FieldError;
};

export const ImageUpload = ({ register, error }: ImageUploadProps) => {
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setFileName(file.name);
    } else {
      setFileName(null);
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">Загрузите фото</label>
      <div className="relative">
        <input type="file"
          {...register('image')}
          className="form-input w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer opacity-0 absolute inset-0"
          onChange={handleFileChange}/>

        <div className="flex justify-center items-center w-full h-12 border border-gray-300 rounded-lg bg-gray-50 cursor-pointer">
          <FaUpload className="text-gray-400 w-6 h-4 mr-2" />
          <span className="text-gray-500">
            {fileName || 'Выберите файл для загрузки'}
          </span>
        </div>
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
    </div>
  );
};
