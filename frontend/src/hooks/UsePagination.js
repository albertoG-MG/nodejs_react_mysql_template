import { useState } from "react";

export function usePagination(initialSize = 5) {
  const [pagination, setPagination] = useState({
    pageSize: initialSize,
    pageIndex: 0,
  });
  const { pageSize, pageIndex } = pagination;

  return {
    onPaginationChange: setPagination,
    pagination,
    limit: pageSize,
    skip: pageSize * pageIndex,
  };
}