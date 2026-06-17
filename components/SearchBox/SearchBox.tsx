import css from './SearchBox.module.css';

interface SearchBoxProps {
  onSearch: (value: string) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({ onSearch }) => (
  <input
    className={css.input}
    type="text"
    placeholder="Search notes"
    onChange={(e) => onSearch(e.target.value)}
  />
);
export default SearchBox;