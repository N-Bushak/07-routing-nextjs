import type { ComponentType } from "react";
import ReactPaginateModule from "react-paginate";
import type { ReactPaginateProps } from "react-paginate";
import css from './Pagination.module.css';

const unknownModule = ReactPaginateModule as unknown;

const ReactPaginate = (
  typeof unknownModule === 'object' && unknownModule !== null && 'default' in unknownModule
    ? (unknownModule as { default: ComponentType<ReactPaginateProps> }).default
    : (ReactPaginateModule as ComponentType<ReactPaginateProps>)
);
interface PaginationProps {
  pageCount: number;
  currentPage: number;
  onPageChange: (selectedItem: { selected: number }) => void;
}

const Pagination: React.FC<PaginationProps> = ({ pageCount, currentPage, onPageChange }) => {
  return (
    <ReactPaginate
      className={css.pagination}
      pageCount={pageCount}
      forcePage={currentPage - 1}
      onPageChange={onPageChange}
      pageRangeDisplayed={3}
      marginPagesDisplayed={1}
      previousLabel="<"
      nextLabel=">"
      breakLabel="..."
      activeClassName={css.active}
    />
  );
};

export default Pagination;