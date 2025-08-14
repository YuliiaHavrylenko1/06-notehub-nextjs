'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api';
import { useParams } from 'next/navigation';
import css from './NoteDetails.module.css';

export default function NoteDetailsClient() {
  const params = useParams();

  const noteId = Array.isArray(params.id) ? params.id[0] : params.id;

  
  const { data: note, isLoading, error } = useQuery({
    queryKey: ['note', noteId],
    queryFn: () => fetchNoteById(noteId!),
    enabled: !!noteId, 
  });


  if (!noteId) return <p>Invalid note ID</p>;
  if (isLoading) return <p>Loading, please wait...</p>;
  if (error || !note) return <p>Something went wrong.</p>;

  return (
    <div className={css.container}>
      <div className={css.item}>
        <div className={css.header}>
          <h2>{note.title}</h2>
        </div>
        <p className={css.content}>{note.content}</p>
        <p className={css.date}>Created: {new Date(note.createdAt).toLocaleString()}</p>
      </div>
    </div>
  );
}
