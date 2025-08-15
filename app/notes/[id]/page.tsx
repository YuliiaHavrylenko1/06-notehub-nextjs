
import React from 'react';
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api';
import NoteDetailsClient from './NoteDetails.client';

type Props = {
  params: Promise<{ noteId: string }>
}

const NoteDetails = async ({ params }: Props) => {
  const { noteId } = await params

  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['note', noteId],
    queryFn: () => fetchNoteById(noteId),
  })
  

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient noteId={noteId} />
    </HydrationBoundary>
  )
}

export default NoteDetails