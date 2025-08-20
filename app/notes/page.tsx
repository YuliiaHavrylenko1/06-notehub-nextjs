import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";

export default async function NotesPage() {
  
  const { notes, totalPages } = await fetchNotes({ page: 1, perPage: 12 });

  
  return <NotesClient notes={notes} totalPages={totalPages} />;
}
