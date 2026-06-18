import axios, { isAxiosError } from "axios";
import type { NewNote, Note } from "../types/note";

const PER_PAGE = 12;

const api = axios.create({
  baseURL: 'https://notehub-public.goit.study/api',
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
  },
});

interface NoteSearch {
  notes: Note[];
  totalPages: number;
}

const formatTag = (tag: string): string => {
  const trimmed = tag.trim();
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
};

export async function fetchNotes(searchQuery: string, pageNumber: number, tag?: string): Promise<NoteSearch> {
  const params: Record<string, string | number> = {
    page: pageNumber,
    perPage: PER_PAGE,
  };

  if (searchQuery) params.search = searchQuery;
  if (tag && tag !== 'all') params.tag = tag;

  const { data } = await api.get<NoteSearch>('/notes', { params });
  return data;
}

export async function createNote(newNoteContent: NewNote): Promise<Note> {
  const payload = {
    title: newNoteContent.title.trim(),
    content: newNoteContent.content.trim(),
    tag: formatTag(newNoteContent.tag), 
  };

  try {
    const { data } = await api.post<Note>('/notes', payload);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error) && error.response?.data) {
      throw new Error(error.response.data.message || "Validation failed");
    }
    throw error;
  }
}

export async function deleteNote(noteToDeleteId: Note['id']): Promise<Note> {
  const { data } = await api.delete<Note>(`/notes/${noteToDeleteId}`);
  return data;
}

export async function fetchNoteById(id: Note['id']): Promise<Note> {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
}