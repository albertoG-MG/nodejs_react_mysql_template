import React, {useState, useEffect} from "react";
import { Table } from "../../components/Table";
import Search from "../../components/Search";
import { usePagination } from "../../hooks/UsePagination";
import { useSorting } from "../../hooks/UseSorting";
import useAPI  from "../../services/usuarios/ApiConsultaUsuarios";

export default function Consulta(){
	const [search, setSearch] = useState('');

	const cols = [
		{ id: "id", header: "ID", enableSorting: true, cell: ({ row }) => row.original.id },
		{ id: "nombre", header: "NOMBRE", enableSorting: true, cell: ({ row }) => row.original.nombre },
		{ id: "correo", header: "CORREO", enableSorting: true, cell: ({ row }) => row.original.correo },
		{ id: "depanom", header: "DEPARTAMENTO", enableSorting: true, cell: ({ row }) => row.original.depanom },
		{ id: "rolnom", header: "ROL", enableSorting: true, cell: ({ row }) => row.original.rolnom },
		{
		  id: "acciones",
		  header: "ACCIONES",
		  enableSorting: false,
		  cell: ({ row }) => (
			<div>
			  <button onClick={() => handleEdit(row.original)}>Editar</button>
			  <button onClick={() => handleDelete(row.original.id)}>Eliminar</button>
			</div>
		  ),
		},
	];
	  
	const handleEdit = (user) => {
		console.log('Editar usuario:', user);
	};
	  
	const handleDelete = (id) => {
		console.log('Eliminar usuario con ID:', id);
	};
	  
	function handleSearch(searchValue) {
        setSearch(searchValue);
    }

	const { limit, onPaginationChange, skip, pagination } = usePagination();
    const { sorting, onSortingChange, field, order } = useSorting();

	const token = localStorage.getItem('token');
	const { data, count, loading, error } = useAPI(token, {
		query: search,
		pagination: { skip, limit },
		sort: { field, order },
	});
	
	return (
		<>
		  <h1 className="text-3xl font-semibold sm:text-5xl lg:text-6xl mb-5">Usuarios</h1>
		  <Search searchQuery={ handleSearch } />
		  <Table
			cols={cols}
			data={data}
			loading={loading}
			onPaginationChange={onPaginationChange}
			onSortingChange={onSortingChange}
			rowCount={count}
			pagination={pagination}
			sorting={sorting}
		  />
		</>
	);
}