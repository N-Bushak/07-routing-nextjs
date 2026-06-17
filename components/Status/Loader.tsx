import css from './Loader.module.css';

const Loader: React.FC = () => {
  return (
    <div className={css.backdrop}>
      <div className={css.spinner}></div>
      <p>Завантаження...</p>
    </div>
  );
};
export default Loader;