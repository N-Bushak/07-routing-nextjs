import axios, { AxiosResponse } from 'axios';
import { Note } from '@/types/note';

interface CreateNoteDto {
  title: string;
  content: string;
  categoryId: string; 
}

const api = axios.create({
  baseURL: 'https://next-v1-notes-api.goit.study/',
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
  },
});

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export const fetchNotes = async (
  page: number = 1,
  perPage: number = 12,
  search: string = '',
  categoryId?: string
): Promise<FetchNotesResponse> => {
  const params: Record<string, string | number> = {
    page,
    perPage,
  };

  if (search) {
    params.search = search;
  }

  if (categoryId && categoryId !== 'all') {
    params.categoryId = categoryId;
  }

  const { data } = await api.get<FetchNotesResponse>('/notes', { params });
  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
};

export const createNote = async (data: CreateNoteDto): Promise<Note> => {
  const response = await api.post<Note, AxiosResponse<Note>, CreateNoteDto>('/notes', data);
  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const { data } = await api.delete<Note>(`/notes/${id}`);
  return data;
};

export interface Category {
  id: string;
  name: string;
}

export const fetchCategories = async (): Promise<Category[]> => {
  const { data } = await api.get<Category[]>('/categories');
  return data;
};
