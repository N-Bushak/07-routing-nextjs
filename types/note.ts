export type NoteTag = 'Work' | 'Personal' | 'Todo' | 'Shopping' | 'Meeting';

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tag: NoteTag; 
}

export interface NewNote {
  title: string;
  content: string;
  tag: NoteTag;
}