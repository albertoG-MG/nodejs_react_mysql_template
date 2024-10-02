import React from "react";
import { Table } from "../../components/Table";
import { usePagination } from "../../hooks/UsePagination";
import { useSorting } from "../../hooks/UseSorting";
import useAPI  from "../../services/ApiConsultaUsuarios";


const cols = [
  { id: "id", header: "ID", enableSorting: true},
  { id: "nombre", header: "NOMBRE", enableSorting: true },
  { id: "correo", header: "CORREO", enableSorting: true },
  { id: "depanom", header: "DEPARTAMENTO", enableSorting: true },
  { id: "rolnom", header: "ROL", enableSorting: true },
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
  // Lógica para eliminar al usuario
  console.log('Eliminar usuario con ID:', id);
};


export default function Consulta(){
	const { limit, onPaginationChange, skip, pagination } = usePagination();
    const { sorting, onSortingChange, field, order } = useSorting();

	const token = localStorage.getItem('token');
	const { data, count, loading, error } = useAPI(token, {
		pagination: { skip, limit },
		sort: { field, order },
	});
	
	return (
		<>
		  <h1 className="text-3xl font-semibold sm:text-5xl lg:text-6xl mb-5">Usuarios</h1>
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