type FormActionsProps = {
  onCancel: () => void;
  submitButtonText?: string;
  disabled?: boolean;
}

export const FormButtonGroup = ({ onCancel, submitButtonText = 'Сохранить', disabled = false }: FormActionsProps) => {
  return (
    <div className="flex justify-end gap-2 mt-4">
      <button type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300">
        Закрыть форму
      </button>
      <button type="submit"
              disabled={disabled}
              className="px-4 py-2 text-white bg-orange-500 rounded-lg hover:bg-orange-600 disabled:opacity-50">
        {submitButtonText}
      </button>
    </div>
  );
};