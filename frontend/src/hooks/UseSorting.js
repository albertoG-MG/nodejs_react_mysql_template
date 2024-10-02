import { useState } from "react";

export function useSorting(initialField = "id", initialOrder = "ASC") {
  const [sorting, setSorting] = useState([
    { id: initialField, desc: initialOrder === "DESC" },
  ]);

  return {
    sorting,
    onSortingChange: setSorting,
    order: !sorting.length ? initialOrder : sorting[0].desc ? "DESC" : "ASC",
    field: sorting.length ? sorting[0].id : initialField,
  };
}