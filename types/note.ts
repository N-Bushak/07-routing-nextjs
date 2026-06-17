export interface Category {
  id: string;   
  name: string; 
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  categoryId: string;   
  category?: Category;  
}

export interface NewNote {
  title: string;
  content: string;
  categoryId: string;   
}
