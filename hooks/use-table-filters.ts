import { useEffect, useState } from "react";

export interface TableFilterState {
  search: string;
  school: string; // should default to 'all'
  period: string; // should default to 'all'
  status?: string;
}

export function useTableFilters(initial: TableFilterState) {
  // Ensure default values for school and period are 'all' if not provided
  const normalizedInitial = {
    ...initial,
    school: initial.school || 'all',
    period: initial.period || 'all',
  };
  const [filters, setFilters] = useState<TableFilterState>(normalizedInitial);
  const [debouncedFilters, setDebouncedFilters] = useState<TableFilterState>(normalizedInitial);

  // Debounce filter changes for better UX (especially for search)
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedFilters(filters);
    }, 300);
    return () => clearTimeout(timeout);
  }, [filters]);

  // Log filter changes
  useEffect(() => {
    console.log('[useTableFilters] filters changed:', filters);
  }, [filters]);
  useEffect(() => {
    console.log('[useTableFilters] debouncedFilters changed:', debouncedFilters);
  }, [debouncedFilters]);

  // Helper setters
  const setSearch = (search: string) => setFilters(f => ({ ...f, search }));
  const setSchool = (school: string) => setFilters(f => ({ ...f, school }));
  const setPeriod = (period: string) => setFilters(f => ({ ...f, period }));
  const setStatus = (status: string) => setFilters(f => ({ ...f, status }));

  return {
    filters,
    setFilters,
    debouncedFilters,
    setSearch,
    setSchool,
    setPeriod,
    setStatus,
  };
}
