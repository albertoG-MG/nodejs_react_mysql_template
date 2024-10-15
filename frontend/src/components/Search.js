import React, { useState, useEffect } from 'react';

export default function Search({ searchQuery }){

    function getSearchValue(event){
        const value = event.target.value;
        searchQuery(value);
    }

    return(
    <>
        <div className="mt-5">
            <div className="relative w-full max-w-md">
                <input
                    type="text"
                    placeholder="Buscar..."
                    className="border rounded-md p-2 pl-10 pr-4 mb-2 w-full focus:ring-2 focus:ring-cyan-400"
                    onChange={ getSearchValue }
                />
                <svg
                    className="absolute left-3 top-[44%] transform -translate-y-1/2 w-5 h-5 text-gray-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 16a6 6 0 100-12 6 6 0 000 12zm6 0l4 4"
                    />
                </svg>
            </div>
        </div>
    </>
    );
}