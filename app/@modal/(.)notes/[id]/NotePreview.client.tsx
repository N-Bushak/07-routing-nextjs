'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api';
import Modal from '@/components/Modal/Modal';
import css from './NotePreview.module.css';


interface NotePreviewClientProps {
  id: string;
}

export default function NotePreviewClient({ id }: NotePreviewClientProps) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError || !data) return <div>Error loading note</div>;

  return (
    <Modal onClose={() => history.back()}>
      <div className={css.card}>
        <h2 className={css.title}>{data.title}</h2>
        <p className={css.content}>{data.content}</p>
      </div>
    </Modal>
  );
}
