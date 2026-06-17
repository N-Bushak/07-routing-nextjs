import axios, { AxiosResponse } from 'axios';
import { Note } from '@/types/note';

export interface NoteWithTag extends Note {
  tag: string;
}

export interface FetchNotesResponse {
  notes: NoteWithTag[];
  totalPages: number;
}

const api = axios.create({
  baseURL: 'https://notehub-public.goit.study/api',
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
  },
});

export const fetchNotes = async (
  page: number = 1,
  perPage: number = 12,
  search: string = '',
  tag?: string
): Promise<FetchNotesResponse> => {
  const params: Record<string, string | number> = { page, perPage };
  if (search) params.search = search;
  if (tag && tag !== 'all') params.tag = tag;

  const { data } = await api.get<FetchNotesResponse>('/notes', { params });
  return data;
};

export const fetchNoteById = async (id: string): Promise<NoteWithTag> => {
  const { data } = await api.get<NoteWithTag>(`/notes/${id}`);
  return data;
};

interface CreateNoteDto {
  title: string;
  content: string;
  tag: string;
}

export const createNote = async (data: CreateNoteDto): Promise<NoteWithTag> => {
  const response = await api.post<NoteWithTag, AxiosResponse<NoteWithTag>, CreateNoteDto>(
    '/notes',
    data
  );
  return response.data;
};

export const deleteNote = async (id: string): Promise<NoteWithTag> => {
  const { data } = await api.delete<NoteWithTag>(`/notes/${id}`);
  return data;
};
