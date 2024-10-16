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
        cols.map(({ id, header, enableSorting, cell }) => {
          return columnHelper.accessor(id, {
            header,
            cell: cell ? cell : ({ row }) => row.original[id],
            enableSorting,
          });
        }),
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
                    <div className="flex gap-3">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
  
                      {header.column.getIsSorted() === "asc" ? (
                        <span>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                          </svg>
                        </span>
                      ) : header.column.getIsSorted() === "desc" ? (
                        <span>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                          </svg>
                        </span>
                      ) : null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="100%">
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