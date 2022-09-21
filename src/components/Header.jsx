import React from 'react'
import { Link } from 'react-router-dom'

const Header = () => {
    return (

        <header className='px-4 py-5 bg-white border-b'>
            <div className='md:flex md:justify-between'>
                <h2 className='text-4xl text-blue-500 font-black text-center'>UpTask</h2>
                <input
                    type='search'
                    placeholder='Buscar Proyecto'
                    className='rounded-lg lg:w-96 block p-2 border'
                />
                <div className='flex items-center gap-4'>
                    <Link
                        to='/proyectos'
                        className='font-bold uppercase'
                    >
                        Proyectos
                    </Link>
                    <button
                        type='button'
                        className='text-white text.sm bg-blue-600 p-3 rounded-md uppercase fotn-bold'
                    >Cerrar Sesión
                    </button>
                </div>

            </div>

        </header>
    )
}

export default Header