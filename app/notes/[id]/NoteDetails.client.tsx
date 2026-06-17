"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchNoteById, fetchCategories, type Category } from "@/lib/api";
import css from "./NoteDetails.module.css";

interface NoteDetailsProps {
  id: string;
}

export default function NoteDetails({ id }: NoteDetailsProps) {
  const { data: note, isLoading, isError } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError || !note) return <p>Error loading note</p>;

  const category = categories.find((c: Category) => c.id === note.categoryId);

  return (
    <div className={css.noteDetails}>
      <h2>{note.title}</h2>
      <p>{note.content}</p>
      <p className={css.category}>
        Category: {category ? category.name : "Unknown"}
      </p>
    </div>
  );
}
