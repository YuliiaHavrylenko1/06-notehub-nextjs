// app/notes/[id]/page.tsx
import React from 'react';
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api';
import NoteDetailsClient from './NoteDetails.client';

export default async function NotePage({
  params,
}: {
  params: { id: string };
}) {
  const { id: noteId } = params;

  if (!noteId || Array.isArray(noteId)) {
    throw new Error('Invalid note ID');
  }

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['note', noteId],
    queryFn: () => fetchNoteById(noteId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient noteId={noteId} />
    </HydrationBoundary>
  );
}
