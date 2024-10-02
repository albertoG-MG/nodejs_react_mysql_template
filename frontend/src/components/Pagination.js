import React from "react";

export const Pagination = ({ tableLib, sizes }) => (
  <footer className="pagination">
    <div className="pagination-navigation">
        <button disabled={!tableLib.getCanPreviousPage()} onClick={() => tableLib.setPageIndex(0)} >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5" />
            </svg>
        </button>
        <button disabled={!tableLib.getCanPreviousPage()} onClick={tableLib.previousPage}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
        </button>
        <span>{`página ${ tableLib.getState().pagination.pageIndex + 1 } de ${tableLib.getPageCount()}`}</span>
        <button disabled={!tableLib.getCanNextPage()} onClick={tableLib.nextPage}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
        </button>
        <button disabled={!tableLib.getCanNextPage()} onClick={() => tableLib.setPageIndex(tableLib.getPageCount() - 1)}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" />
            </svg>
        </button>
    </div>
    <div className="pagination-size-selector">
        <span>Mostrar: </span>
        <select value={tableLib.getState().pageSize} onChange={(e) => tableLib.setPageSize(parseInt(e.target.value, 10))}>
        {sizes.map((size) => (
            <option key={size} value={size}>
            {size}
            </option>
        ))}
        </select>
        <span> elementos por página</span>
    </div>
  </footer>
);