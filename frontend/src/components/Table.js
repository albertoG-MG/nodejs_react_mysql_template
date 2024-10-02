import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
  } from "@tanstack/react-table";
  import React, { useMemo } from "react";
  import { Pagination } from "../components/Pagination";
  import { Loader } from "../components/Loader.js";
  
  const columnHelper = createColumnHelper();
  
  export const Table = ({
    cols,
    data,
    loading,
    onPaginationChange,
    onSortingChange,
    rowCount,
    pagination,
    sorting,
  }) => {
    const columns = useMemo(
      () =>
        cols.map(({ id, header, enableSorting }) => ({
          ...columnHelper.accessor(id, {
            header,
          }),
          enableSorting,
        })),
      [cols],
    );
  
    const tableLib = useReactTable({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
      manualPagination: true,
      manualSorting: true,
      onPaginationChange,
      onSortingChange,
      state: { pagination, sorting },
      rowCount,
    });
    return (
      <section>
        <table className="table">
          <thead>
            {tableLib.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} {...(header.column.getCanSort() ? { onClick: header.column.getToggleSortingHandler() }: {})}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
  
                    {header.column.getIsSorted() === "asc" ? (
                      <span> 🔼</span>
                    ) : header.column.getIsSorted() === "desc" ? (
                      <span> 🔽</span>
                    ) : null}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colspan="100%">
                  <Loader />
                </td>
              </tr>
            ) : (
              tableLib.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
        <Pagination tableLib={tableLib} sizes={[5, 10, 20]} />
      </section>
    );
  };