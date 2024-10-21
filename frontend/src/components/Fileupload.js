import React, { useState, useRef, useEffect } from 'react';

const FileUpload = ({ obtenerArchivo, obtenerError, acceptedFileTypes = ['image/jpeg', 'image/png'], isEdit, nombre_archivo, archivo, onDelete }) => {
    const [fileName, setFileName] = useState('Selecciona un archivo');
    const [previewUrl, setPreviewUrl] = useState('');
    const [showActions, setShowActions] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];

        if (selectedFile) {
            if (!acceptedFileTypes.includes(selectedFile.type)) {
                obtenerError(`El archivo ${selectedFile.name} no es un archivo válido (${acceptedFileTypes.join(', ')})`);
                obtenerArchivo(null);
                setFileName('Selecciona un archivo');
                setPreviewUrl('');
                setShowActions(false);
                return;
            }

            if (selectedFile.size > 10485760) {
                obtenerError(`El archivo ${selectedFile.name} debe pesar menos de 10 MB.`);
                obtenerArchivo(null);
                setFileName('Selecciona un archivo');
                setPreviewUrl('');
                setShowActions(false);
                return;
            }

            obtenerArchivo(selectedFile);
            setFileName(selectedFile.name);
            obtenerError('');
            setShowActions(true);
            if(isEdit && onDelete){
                onDelete(false);
            }

            if (selectedFile.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    setPreviewUrl(event.target.result);
                };
                reader.readAsDataURL(selectedFile);
            } else {
                setPreviewUrl('');
            }
        }
    };

    const handleDeleteFile = () => {
        obtenerArchivo(null);
        setFileName('Selecciona un archivo');
        setPreviewUrl('');
        obtenerError('');
        setShowActions(false);
        if(isEdit && onDelete){
            onDelete(true);
        }

        if (fileInputRef.current) {
            fileInputRef.current.value = null;
        }
    };

    useEffect(() => {
        const verificarImagen = (url) => {
            const img = new Image();
            img.onload = () => setPreviewUrl(url);
            img.onerror = () => {
                setPreviewUrl('../../../images/not_found.jpg');
                setFileName('not_found.jpg');
                setShowActions(true);
            };
            img.src = url;
        };
    
        if (isEdit) {
            if (nombre_archivo && archivo) {
                const imagenUrl = `../../../uploads/${archivo}`;
                verificarImagen(imagenUrl);
                setFileName(nombre_archivo);
                setShowActions(true);
            } else {
                setPreviewUrl('../../../images/default-user.png');
                setFileName('default-user.png');
                setShowActions(false);
            }
        }
    }, [isEdit, nombre_archivo, archivo]);  

    return (
        <div className="grid grid-cols-1">
            <div className='flex items-center justify-center w-full'>
                <label className='flex flex-col border-4 border-dashed w-full hover:bg-gray-100 hover:border-black group'>
                    <div className='flex flex-col items-center justify-center pt-7'>
                        <div id="svg" className={previewUrl ? 'hidden' : ''}>
                            <svg className="w-10 h-10 text-gray-400 group-hover:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                        </div>
                        {previewUrl && <img src={previewUrl} className="w-20 h-20" alt="Preview" />}
                        <p className='lowercase text-center text-sm text-gray-400 group-hover:text-black pt-1 tracking-wider'>{fileName}</p>
                    </div>
                    <input 
                        type='file' 
                        name="foto" 
                        accept={acceptedFileTypes.join(',')}
                        className="hidden" 
                        onChange={handleFileChange} 
                        ref={fileInputRef}
                    />
                </label>
            </div>
            {showActions && (
                <div className="flex flex-col md:flex-row justify-center mt-5 mx-7 gap-3">
                    <button 
                        type="button" 
                        onClick={handleDeleteFile} 
                        className="text-white bg-[#24292F] hover:bg-[#24292F]/90 focus:ring-2 focus:outline-none focus:ring-[#24292F]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex flex-col md:flex-row items-center gap-3"
                    >
                        Eliminar
                    </button>
                </div>
            )}
        </div>
    );
};

export default FileUpload;
