import css from './ErrorMessage.module.css';

interface ErrorProps {
  message?: string;
  onRetry?: () => void;
}

const ErrorMessage: React.FC<ErrorProps> = ({ 
  message = "Щось пішло не так...", 
  onRetry 
}) => {
  return (
    <div className={css.errorBox}>
      <p>{message}</p>
      {onRetry && <button onClick={onRetry}>Спробувати знову</button>}
    </div>
  );
};
export default ErrorMessage;