import { useNavigate } from 'react-router-dom';
import { customCN } from '@/shared/lib/customCN';

type NotFoundProps = {
  title?: string;
  description?: string;
  buttonText?: string;
  navigateTo?: string;
  className?: string;
  buttonClassName?: string;
};

export const NotFound = ({
                           title = 'Рецепт не найден',
                           description = 'Извините, но такой страницы или рецепта не существует',
                           buttonText = 'Вернуться на главную',
                           navigateTo = '/',
                           className = '',
                           buttonClassName = '',
                         }: NotFoundProps) => {
  const navigate = useNavigate();

  return (
    <div className={customCN(
      'min-h-[60vh] flex flex-col items-center justify-center p-6 text-center',
      'bg-[url("https://images.unsplash.com/photo-1551218808-94e220e084d2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80")]',
      'bg-cover bg-center bg-no-repeat bg-blend-overlay bg-black/20',
      className,
    )}>
      <div className="max-w-2xl backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 p-8 rounded-xl shadow-xl">
        <div className="text-9xl font-bold text-blue-600 mb-4">404</div>

        <h1 className={customCN(
          'text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4',
          'animate-pulse')}>
          {title}
        </h1>

        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          {description}
        </p>

        <button onClick={() => navigate(navigateTo)}
                className={customCN(
                  'px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white',
                  'rounded-lg font-medium transition-all duration-300',
                  'transform hover:scale-105 shadow-lg',
                  buttonClassName)}>
          {buttonText}
        </button>
      </div>
    </div>
  );
};