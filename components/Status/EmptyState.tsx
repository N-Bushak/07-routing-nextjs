import css from './EmptyState.module.css';

interface EmptyProps {
  message?: string;
}

const EmptyState: React.FC<EmptyProps> = ({ 
  message = "Нотаток поки що немає." 
}) => {
  return (
    <div className={css.container}>
      <h3 className={css.title}>Порожньо</h3>
      <p className={css.text}>{message}</p>
    </div>
  );
};

export default EmptyState;