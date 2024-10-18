import React, { useState, useRef } from 'react';

const FileUpload = () => {
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('Selecciona un archivo');
    const [fileError, setFileError] = useState('');
    const [previewUrl, setPreviewUrl] = useState('');
    const [showActions, setShowActions] = useState(false);
    const fileInputRef = useRef(null); // Usamos useRef para manejar el input

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];

        if (selectedFile) {
            const validTypes = ['image/jpeg', 'image/png'];
            if (!validTypes.includes(selectedFile.type)) {
                setFileError(`El archivo ${selectedFile.name} no es una imagen válida (jpg o png)`);
                setShowActions(true);
                return;
            }

            if (selectedFile.size > 10485760) { // 10 MB
                setFileError(`El archivo ${selectedFile.name} debe pesar menos de 10 MB.`);
                setShowActions(true);
                return;
            }

            setFile(selectedFile);
            setFileName(selectedFile.name);
            setFileError('');
            setShowActions(true);

            const reader = new FileReader();
            reader.onload = (event) => {
                setPreviewUrl(event.target.result);
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleDeleteFile = () => {
        // Restablecer todo al estado inicial
        setFile(null);
        setFileName('Selecciona un archivo');
        setPreviewUrl('');
        setFileError('');
        setShowActions(false);

        // Limpiar el valor del input de archivo
        if (fileInputRef.current) {
            fileInputRef.current.value = null; // Restablecemos el valor del input
        }
    };

    return (
        <div className="grid grid-cols-1 mt-5 mx-7">
            <label className="text-[#64748b] font-semibold mb-2">Subir foto</label>
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
                        accept="image/jpeg,image/png" 
                        className="hidden" 
                        onChange={handleFileChange} 
                        ref={fileInputRef} // Referencia al input de archivo
                    />
                </label>
            </div>
            {fileError && <div className="text-red-500 mt-2">{fileError}</div>}
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
