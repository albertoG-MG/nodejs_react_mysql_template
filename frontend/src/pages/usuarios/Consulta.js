import React, {useState, useEffect, useRef} from "react";
import { Table } from "../../components/Table";
import Search from "../../components/Search";
import { usePagination } from "../../hooks/UsePagination";
import { useSorting } from "../../hooks/UseSorting";
import useAPI  from "../../services/usuarios/ApiConsultaUsuarios";
import { useNavigate, useLocation  } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function Consulta(){
	const [search, setSearch] = useState('');
	const [accionsubmenu, setAccionsubmenu] = useState({});
	const submenuTableRef = useRef(null);
	const navigate = useNavigate();
	const location = useLocation();
	const { success, message } = location.state || {};

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
			<div ref={submenuTableRef} class="relative px-4">
			   <button onClick={(e) => {e.stopPropagation(); abrirTablaSubmenu(row.original.id);}} onKeyDown={tablaEnter(row.original.id)} aria-haspopup="true" aria-expanded={accionsubmenu} tabIndex="0" aria-label="Opciones para la tabla"  className="inline-block text-center active:enabled:translate-y-px focus:outline-none focus-visible:ring-[1.8px] focus-visible:ring-offset-2 ring-offset-background transition-colors duration-200 p-0.5 w-7 h-7 rounded bg-transparent border border-muted focus-visible:ring-muted hover:text-indigo-600 hover:border-indigo-600 focus-visible:ring-2 focus-visible:ring-cyan-400">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="w-6 h-6">
					<circle cx="12" cy="12" r="1" />
					<circle cx="12" cy="6" r="1" />
					<circle cx="12" cy="18" r="1" />
					</svg>
				</button>
				<div role="menu" className={`z-[1] absolute shadow-md rounded-md bg-white border border-muted ${accionsubmenu[row.original.id] ? "block" : "hidden"} transition ease-in-out delay-150`}>
					<ul>
						<li className="px-2 py-2 hover:bg-slate-100 cursor-pointer" role="menuitem" aria-label="Editar usuario" tabIndex="0" onClick={(e) => e.stopPropagation()}><a href={`/usuarios/editar/${row.original.id}`} className="flex items-center gap-3"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-4 w-4 text-indigo-600"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"></path></svg><p>Editar</p></a></li>
						<li className="px-2 py-2 hover:bg-slate-100 cursor-pointer" role="menuitem" aria-label="Eliminar usuario" tabIndex="0" onClick={(e) => { e.stopPropagation(); handleEliminarUsuario(row.original.id); }}><div className="flex items-center gap-3"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-4 w-4 text-indigo-600"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"></path></svg><p>Eliminar</p></div></li>
					</ul>
				</div>
			</div>
		  ),
		},
	];

	const handleEliminarUsuario = (id) => {
		Swal.fire({
			title: '¿Estás seguro de que deseas eliminar este usuario?',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Sí, eliminar',
			cancelButtonText: 'No, cancelar'
		}).then((result) => {
			if (result.isConfirmed) {
				navigate(`/usuarios/eliminar/${id}`); // Redirige al componente de eliminación
			}
		});
	};

	useEffect(() => {
		if (success !== undefined) {
			Swal.fire({
				icon: success ? 'success' : 'error',
				title: success ? 'Éxito' : 'Error',
				text: message,
				confirmButtonText: 'Aceptar'
			});
		}
	}, [success, message]);

	const abrirTablaSubmenu = (id) => {
		setAccionsubmenu(prev => ({ ...prev, [id]: !prev[id] }));
	}

	const tablaEnter = (event, id) => {
		if (event.key === 'Enter') {
			if(accionsubmenu[id]){
				setAccionsubmenu(prev => ({ ...prev, [id]: !prev[id] }));
			}else{
				setAccionsubmenu({});
			}
		}
	};

	useEffect(() => {
		const handleClickOutside = (event) => {
		  if (submenuTableRef.current && !submenuTableRef.current.contains(event.target)) {
			setAccionsubmenu({});
		  }
		};
	
		document.addEventListener('click', handleClickOutside);
	
		return () => {
		  document.removeEventListener('click', handleClickOutside);
		};
	}, []);
	  
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