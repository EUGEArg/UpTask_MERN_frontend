import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import useProyectos from '../hooks/useProyectos'
import Alerta from './Alerta'

const FormularioProyecto = () => {
    const [id, setId] = useState(null) //registro nuevo=null
    const [nombre, setNombre] = useState('')
    const [description, setDescription] = useState('')
    const [fechaEntrega, setFechaEntrega] = useState('')
    const [cliente, setCliente] = useState('')

    const params = useParams(); //Detectar si form está en creación o edición
    const {mostrarAlerta, alerta, submitProyecto, proyecto} = useProyectos();
    
    //------Cargar el state con datos del proyecto a editar------
    useEffect(() => {
        if(params.id ){
            setId(proyecto._id) //true
            setNombre(proyecto.nombre)
            setDescription(proyecto.description)
            setFechaEntrega(proyecto.fechaEntrega?.split('T')[0])
            setCliente(proyecto.cliente)
        }else {
            console.log('Nuevo Proyecto')
        }
    },[params])

    

    const handleSubmit = async e => { 
        e.preventDefault();

        //Verificar campos completos del form
        if([nombre, description, fechaEntrega, cliente].includes('')){ 
            mostrarAlerta({
                msg:'Todos los campos son obligatorios',
                error: true
            })
            return
        }

        //Pasar Datos a Provider
        await submitProyecto({id, nombre, description, fechaEntrega, cliente}); //id para comprobar si estamos creando o editando
        setId(null)
        setNombre('')
        setDescription('')
        setFechaEntrega('')
        setCliente('')

    }

    const {msg} = alerta

    return (
        <form 
            className='bg-white py-10 px-5 md:w-1/2 rounded-lg shadow'
            onSubmit={handleSubmit}
        >
            
            {msg && <Alerta alerta={alerta}/>}

            <div className='mb-5'>
                <label
                    className='text-gray-700 uppercase font-bold text-sm'
                    htmlFor='nombre'
                >Nombre Proyecto
                </label>
                <input
                    id='nombre'
                    type='text'
                    className='border w-full p-2 mt-2 placeholder-gray-400 rounded-md'
                    placeholder='Nombre del Proyecto'
                    value={nombre}
                    onChange={e=> setNombre(e.target.value)}
                />
            </div>

            <div className='mb-5'>
                <label
                    className='text-gray-700 uppercase font-bold text-sm'
                    htmlFor='description'
                >Descripción
                </label>
                <textarea
                    id='description'
                    className='border w-full p-2 mt-2 placeholder-gray-400 rounded-md'
                    placeholder='Descripción del Proyecto'
                    value={description}
                    onChange={e=> setDescription(e.target.value)}
                />
            </div>

            <div className='mb-5'>
                <label
                    className='text-gray-700 uppercase font-bold text-sm'
                    htmlFor='fecha-entrega'
                >Fecha Entrega
                </label>
                <input
                    id='fecha-entrega'
                    type='date'
                    className='border w-full p-2 mt-2 placeholder-gray-400 rounded-md'
                    value={fechaEntrega}
                    onChange={e=> setFechaEntrega(e.target.value)}
                />
            </div>

            <div className='mb-5'>
                <label
                    className='text-gray-700 uppercase font-bold text-sm'
                    htmlFor='nombre-cliente'
                >Nombre Cliente
                </label>
                <input
                    id='nombre-cliente'
                    type='text'
                    className='border w-full p-2 mt-2 placeholder-gray-400 rounded-md'
                    placeholder='Nombre del Cliente'
                    value={cliente}
                    onChange={e=> setCliente(e.target.value)}
                />
            </div>
            <input
                type='submit'
                value={id ? 'Actualizar Proyecto' : 'Crear Proyecto'}
                className='bg-blue-400 w-full p-3 uppercase font-bold text-white text-center rounded cursor-pointer hover:bg-blue-600 transition-colors'
            />

        </form>
    )
}

export default FormularioProyecto