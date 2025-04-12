export const ErrorMessage = ({ message, details }: { message: string; details?: string }) => (
  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
    <strong className="font-bold">Ошибка!</strong>
    <span className="block sm:inline"> {message}</span>
    {details && <p className="mt-2 text-sm">{details}</p>}
  </div>
);