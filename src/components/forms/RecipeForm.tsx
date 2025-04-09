import { useForm, useFieldArray } from 'react-hook-form';
import { RecipeNameInput } from './RecipeNameInput';
import { PreparationStepsTextarea } from './PreparationStepsTextarea';
import { SubmitButton } from './SubmitButton';
import { IngredientsInput } from '@components/forms/IngredientsInput';

export type RecipeFormData = {
  name: string;
  ingredients: { value: string }[];
  steps: string;
};

type RecipeFormProps = {
  initialValues?: RecipeFormData;
  onSubmit: (data: RecipeFormData) => void;
  title?: string;
  buttonText?: string;
};

export const RecipeForm = (props: RecipeFormProps) => {
  const { initialValues, onSubmit, title = 'Добавить рецепт', buttonText = 'Сохранить' } = props;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<RecipeFormData>({
    defaultValues: initialValues || {
      name: '',
      ingredients: [{ value: '' }],
      steps: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'ingredients',
  });

  const handleFormSubmit = (data: RecipeFormData) => {
    onSubmit(data);
    reset({
      name: '',
      ingredients: [{ value: '' }],
      steps: '',
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}
          className="bg-gray-50 p-4 rounded-lg">
      <h3 className="font-medium text-gray-700 mb-3">{title}</h3>
      <RecipeNameInput register={register} error={errors.name} />
      <div className={'relative'}>
        <IngredientsInput register={register}
                         control={control}
                         errors={errors}
                         fields={fields}
                         append={append}
                         remove={remove} />
      </div>
      <PreparationStepsTextarea register={register} error={errors.steps} />
      <SubmitButton text={buttonText} />
    </form>
  );
};


// import {useForm} from "react-hook-form";
// import {RecipeNameInput} from "@/components/forms/RecipeNameInput";
// import {IngredientsInputList} from "@/components/forms/IngredientsInputList";
// import {PreparationStepsTextarea} from "@/components/forms/PreparationStepsTextarea";
// import {SubmitButton} from "@/components/forms/SubmitButton";
//
// export type FormData = {
//     name: string;
//     ingredients: { value: string }[];
//     steps: string;
// };
//
// export const RecipeForm = () => {
//     const {
//         register,
//         handleSubmit,
//         control,
//         formState: {errors},
//         reset
//     } = useForm<FormData>({
//         defaultValues: {
//             ingredients: [{value: ""}]
//         }
//     });
//
//     const onSubmit = (data: FormData) => {
//         console.log(data);
//         reset();
//     };
//
//     return (
//         <form onSubmit={handleSubmit(onSubmit)} className="bg-gray-50 p-4 rounded-lg">
//             <h3 className="font-medium text-gray-700 mb-3">Добавить рецепт</h3>
//             <RecipeNameInput register={register} error={errors.name}/>
//             <IngredientsInputList register={register} control={control} errors={errors}/>
//             <PreparationStepsTextarea register={register} error={errors.steps}/>
//             <SubmitButton/>
//         </form>
//     );
// };
