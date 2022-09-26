import { useState } from 'react'
import useProyectos from '../hooks/useProyectos'
import Alerta from '../components/Alerta'

const FormularioColaborador = () => {

    const [email, setEmail] = useState('')

    const { mostrarAlerta, alerta, submitColaborador } = useProyectos()

    const handleSubmit = e => {
        e.preventDefault();

        if(email === ''){
            mostrarAlerta({
                msg: 'El email es Obligatorio',
                error: true
            })
            return
        }
        submitColaborador(email)
    }

    const {msg} = alerta

    return (

        <form
            className='bg-white py-10 px-5 w-full md:w-1/2 rounded-lg shadow'
            onSubmit={handleSubmit}
        >
            {msg && <Alerta alerta={alerta}/>}
            <div className='mb-5'>
                <label
                    className='text-gray-700 uppercase font-bold text-sm'
                    htmlFor='email'
                >Email Colaborador
                </label>
                <input
                    type='email'
                    id='email'
                    placeholder='Email del Usuario'
                    className=' border-2 w-full p-2 mt-2 placeholder-gray-300 rounden-md'
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
            </div>
            <input
                type='submit'
                className='bg-blue-600 hover:bg-blue-700 w-full p-3 text-white text-sm uppercase font-bold cursor-pointer transition-colors rounded'
                value={'Buscar Colaborador'}
            />

        </form>
    )
}

export default FormularioColaborador