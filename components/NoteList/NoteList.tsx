import Link from 'next/link';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteNote } from '../../lib/api';
import Loader from '@/components/Status/Loader';
import ErrorMessage from '@/components/Status/ErrorMessage';
import EmptyState from '@/components/Status/EmptyState';
import type { Note } from '../../types/note';
import css from './NoteList.module.css';

interface NoteListProps {
  notes: Note[]; 
  isUpdating?: boolean;
  isLoading?: boolean;   
  isError?: boolean;
}

const NoteList: React.FC<NoteListProps> = ({ 
  notes, 
  isUpdating, 
  isLoading, 
  isError 
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  if (isError) return <ErrorMessage />;
  if (isLoading) return <Loader />;
  if (notes.length === 0 && !isUpdating) return <EmptyState />;

  return (
   <ul className={`${css.list} ${isUpdating ? css.updating : ''}`}>
      {notes.map((note: Note) => (
        <li key={note.id} className={css.listItem}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <Link href={`/notes/${note.id}`} className={css.link}>
    View details
  </Link>
            <button 
              className={css.button} 
              onClick={() => mutation.mutate(note.id)}
              disabled={mutation.isPending}
            >
              {mutation.isPending ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default NoteList;