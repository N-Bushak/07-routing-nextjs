'use client';

import { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { fetchNotes } from '../../../../lib/api';
import { useDebouncedCallback } from 'use-debounce';
import css from './NotesPage.module.css'; 
import SearchBox from '../../../../components/SearchBox/SearchBox';
import Pagination from '../../../../components/Pagination/Pagination';
import NoteForm from '../../../../components/NoteForm/NoteForm';
import Modal from '../../../../components/Modal/Modal';
import NoteList from '../../../../components/NoteList/NoteList';

interface NotesClientProps {
  tag: string;
}

export default function NotesClient({ tag }: NotesClientProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const perPage = 12;

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, 500);

  const { data, isLoading, isError, isPlaceholderData } = useQuery({
    queryKey: ['notes', page, search, tag],
    queryFn: () => fetchNotes(page, perPage, search, tag),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
  });

  const notes = data?.notes || [];
  const pageCount = data?.totalPages || 0;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onSearch={debouncedSearch} />
        {pageCount > 1 && (
          <Pagination
            pageCount={pageCount}
            currentPage={page}
            onPageChange={(selectedItem) => setPage(selectedItem.selected + 1)}
          />
        )}
        <button
          type="button"
          className={css.button}
          onClick={() => setIsModalOpen(true)}
        >
          Create note +
        </button>
      </header>

      <main>
        {notes.length > 0 ? (
          <NoteList
            notes={notes}
            isUpdating={isPlaceholderData}
            isLoading={isLoading}
            isError={isError}
          />
        ) : (
          !isLoading && !isError && (
            <p className={css.empty}>No notes found</p>
          )
        )}
      </main>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onClose={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
}
