import React from 'react';

export default function Login() {
    return (
        <>
            <div className="bg-gray-50 font-[sans-serif]">
                <div className="min-h-screen flex flex-col items-center justify-center py-6 px-4">
                    <div className="max-w-md w-full">
                        <a href="javascript:void(0)">
                            <img src="https://readymadeui.com/readymadeui.svg" alt="logo" className='w-40 mb-8 mx-auto block' />
                        </a>

                        <div className="p-8 rounded-2xl bg-white shadow">
                            <h2 className="text-gray-800 text-center text-2xl font-bold">Login</h2>
                            <form className="mt-8 space-y-4">
                                <div>
                                    <label className="text-gray-800 text-sm mb-2 block">Usuario</label>
                                    <input name="username" type="text" required className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-blue-600" placeholder="Ingresa tu usuario" />
                                </div>

                                <div>
                                    <label className="text-gray-800 text-sm mb-2 block">Contraseña</label>
                                    <input name="password" type="password" required className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-blue-600" placeholder="Ingresa tu contraseña" />
                                </div>

                                <div className="flex flex-wrap items-center justify-between gap-4">
                                    <div className="flex items-center">
                                        <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                                        <label htmlFor="remember-me" className="ml-3 block text-sm text-gray-800">Recuerdame</label>
                                    </div>
                                    <div className="text-sm">
                                        <a href="javascript:void(0);" className="text-blue-600 hover:underline">¿Olvidó su contraseña?</a>
                                    </div>
                                </div>

                                <div className="!mt-8">
                                    <button type="button" className="w-full py-3 px-4 text-sm rounded-lg text-white bg-blue-600 hover:bg-blue-700">Ingresar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                input:-webkit-autofill,
                textarea:-webkit-autofill,
                select:-webkit-autofill {
                    -webkit-box-shadow: 0 0 0px 1000px #ffffff inset !important;
                    -webkit-text-fill-color: #000000 !important;
                    background-color: #ffffff !important;
                }
            `}</style>
        </>
    );
}
