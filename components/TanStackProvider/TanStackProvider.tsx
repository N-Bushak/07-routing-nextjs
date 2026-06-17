'use client';

import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fetchCategories } from '@/lib/api';

type Props = {
  children: React.ReactNode;
};

const TanStackProvider = ({ children }: Props) => {
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
  fetchCategories()
    .then(cats => console.log('Fetched categories:', cats))
    .catch(err => console.error('Failed to fetch categories:', err));
}, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

export default TanStackProvider;
