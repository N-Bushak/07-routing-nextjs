import axios, { AxiosResponse } from 'axios';
import { Note, Category } from '@/types/note';

export interface NoteWithTag extends Note {
  tag?: string;
}

export interface FetchNotesResponse {
  notes: NoteWithTag[];
  totalPages: number;
}

const api = axios.create({
  baseURL: 'https://next-v1-notes-api.goit.study/',
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
  },
});

let categoriesCache: Category[] = [];

export const fetchCategories = async (): Promise<Category[]> => {
  const { data } = await api.get<Category[]>('/categories');
  categoriesCache = data;
  return data;
};

export const fetchNotes = async (
  page: number = 1,
  perPage: number = 12,
  search: string = '',
  tag?: string
): Promise<FetchNotesResponse> => {
  console.log('fetchNotes called with tag:', tag);

  const params: Record<string, string | number> = { page, perPage };
  if (search) params.search = search;

  if (tag && tag !== 'all') {
    console.log('Categories cache:', categoriesCache);
    const category = categoriesCache.find(c => c.name.toLowerCase() === tag.toLowerCase());
    console.log('Matched category:', category);
    if (category) params.categoryId = category.id;
  }

  const { data } = await api.get<FetchNotesResponse>('/notes', { params });
  console.log('API response:', data);

  const notesWithTag = data.notes.map(note => ({
    ...note,
    tag: note.category?.name,
  }));

  return { ...data, notes: notesWithTag };
};


export const fetchNoteById = async (id: string): Promise<NoteWithTag> => {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return { ...data, tag: data.category?.name };
};

interface CreateNoteDto {
  title: string;
  content: string;
  tag: string;
}

export const createNote = async (data: CreateNoteDto): Promise<NoteWithTag> => {
  const category = categoriesCache.find(c => c.name === data.tag);
  if (!category) throw new Error(`Unknown tag: ${data.tag}`);

  const payload = {
    title: data.title,
    content: data.content,
    categoryId: category.id,
  };

  const response = await api.post<Note, AxiosResponse<Note>, typeof payload>('/notes', payload);
  return { ...response.data, tag: data.tag };
};

export const deleteNote = async (id: string): Promise<NoteWithTag> => {
  const { data } = await api.delete<Note>(`/notes/${id}`);
  return { ...data, tag: data.category?.name };
};
