'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchNoteById, type NoteWithTag } from '@/lib/api';
import css from './NoteDetails.module.css';

interface NoteDetailsProps {
  id: string;
}

export default function NoteDetailsClient({ id }: NoteDetailsProps) {
  const { data: note, isLoading, isError } = useQuery<NoteWithTag>({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError || !note) return <p>Error loading note</p>;

  return (
    <div className={css.noteDetails}>
      <h2>{note.title}</h2>
      <p>{note.content}</p>
      <p className={css.tag}>Tag: {note.tag}</p>
      <p className={css.date}>Created: {note.createdAt}</p>
    </div>
  );
}

