"use client";

import Link from 'next/link';
import css from './SidebarNotes.module.css';
import { useQuery } from '@tanstack/react-query';
import { fetchCategories, type Category } from '@/lib/api';

export default function SidebarNotes() {
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  return (
    <ul className={css.menuList}>
      <li className={css.menuItem}>
        <Link href="/notes/filter/all" className={css.menuLink}>
          All notes
        </Link>
      </li>
      {categories.map((cat: Category) => (
        <li key={cat.id} className={css.menuItem}>
          <Link href={`/notes/filter/${cat.id}`} className={css.menuLink}>
            {cat.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}
