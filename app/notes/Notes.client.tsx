'use client';

import { useState } from 'react';
import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api';
import  { useDebounce } from 'use-debounce';
import css from './Notes.module.css';

import NoteList from '@/components/NoteList/NoteList';
import SearchBox from '@/components/SearchBox/SearchBar';
import Pagination from '@/components/Pagination/pagination';
import Modal from '@/components/Modal/Modal';
import NoteForm from '@/components/NoteForm/NoteForm';

export default function Notes() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [debouncedSearch] = useDebounce(searchQuery, 300);
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', page, debouncedSearch],
    queryFn: () => fetchNotes({ page, perPage: 12, search: debouncedSearch }),
    placeholderData: keepPreviousData,
  });

  const handleSearchChange = (value: string) => {
    setInputValue(value);
    setSearchQuery(value);
    setPage(1);
  };

  const handleNoteCreate = () => {
    setPage(1);
    setIsModalOpen(false);
  };

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={inputValue} onSearch={handleSearchChange} />
        {totalPages > 1 && (
          <Pagination totalPages={totalPages} page={page} setPage={setPage} />
        )}
        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      {isLoading && <p>Loading, please wait...</p>}

      {isError && (
        <>
          <p className={css.error}>Failed to load notes. Please try again.</p>
          <button onClick={() => queryClient.invalidateQueries({ queryKey: ['notes'] })}>
            Try again ...
          </button>
        </>
      )}

      {!isLoading && !isError && notes.length > 0 && <NoteList notes={notes} />}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onSuccess={handleNoteCreate} onCancel={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
}
