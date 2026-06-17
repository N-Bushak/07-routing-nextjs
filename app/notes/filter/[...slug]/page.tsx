import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api';
import NotesClient from './Notes.client';

export default async function NotesPage({ params }: { params: { slug?: string[] } }) {
  const queryClient = new QueryClient();

  const slugArray = params.slug || [];
  const categoryId = slugArray.length > 0 ? slugArray[0] : 'all';

  await queryClient.prefetchQuery({
    queryKey: ['notes', categoryId],
    queryFn: () => fetchNotes(1, 12, '', categoryId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient categoryId={categoryId} />
    </HydrationBoundary>
  );
}
