import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api';
import NotesClient from './Notes.client';

export default async function NotesPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {

  const { slug } = await params;

  const queryClient = new QueryClient();

  const categoryId = slug?.[0] ?? 'all';

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
