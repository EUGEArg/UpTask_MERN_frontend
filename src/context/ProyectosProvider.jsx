import { useState, useEffect, createContext } from 'react'
import clienteAxios from '../config/clienteAxios'
import { useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import io from 'socket.io-client'

let socket;

const ProyectosContext = createContext();

const ProyectosProvider = ({ children }) => {

    const [proyectos, setProyectos] = useState([]);
    const [alerta, setAlerta] = useState({});
    const [proyecto, setProyecto] = useState({});
    const [cargando, setCargando] = useState(false) //Para evitar el flash del proyecto anterior
    const [modalFormularioTarea, setModalFormularioTarea] = useState(false)
    const [tarea, setTarea] = useState({})
    const [modalEliminarTarea, setModalEliminarTarea] = useState(false)
    const [colaborador, setColaborador] = useState({})
    const [modalEliminarColaborador, setModalEliminarColaborador] = useState(false)
    const [buscador, setBuscador] = useState(false)

    const navigate = useNavigate();
    const { auth } = useAuth()

    useEffect(() => {
        const obtenerProyectos = async () => {
            try {
                const token = localStorage.getItem('token')
                if (!token) return

                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }
                const { data } = await clienteAxios('/proyectos', config)
                setProyectos(data) //State
            } catch (error) {
                console.log(error)
            }
        }
        obtenerProyectos()
    }, [auth])

    //Abrir conexión a Socket io
    useEffect(() => {
        socket = io(import.meta.env.VITE_BACKEND_URL)
    }, [])


    //Alerta de campos obligatorios
    const mostrarAlerta = alerta => { 
        setAlerta(alerta)
        setTimeout(() => { //A los 5 seg se resetea
            setAlerta({})
        }, 5000);
    }

    //Envía el req autenticado hacia la ruta para crear proyectos
    const submitProyecto = async proyecto => {
        //Comprobando si es edición o creación de proyecto
        if (proyecto.id) {
            await editarProyecto(proyecto)
        } else {
            await nuevoProyecto(proyecto)
        }
    }

//--------------------------------------------------Editar Proyecto--------------------------------------------------
    const editarProyecto = async proyecto => {
        try {
            const token = localStorage.getItem('token')
            if (!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.put(`/proyectos/${proyecto.id}`, proyecto, config)

            //Sincronizar el State
            const proyectosActualizados = proyectos.map(proyectoState => proyectoState._id === data._id ? data : proyectoState)
            setProyectos(proyectosActualizados)

            //Mostrar el Alerta
            setAlerta({
                msg: 'Proyecto Actualizado Correctamente',
                error: false
            })

            setTimeout(() => {
                setAlerta({}) //Vaciar el state de los datos ingresados de nuevo proyecto
                navigate('/proyectos') //Redireccionar a Proyectos
            }, 3000);
            //Redireccionar
        } catch (error) {
            console.log(error)
        }
    }

    //--------------------------------------------------Nuevo Proyecto--------------------------------------------------
    const nuevoProyecto = async proyecto => {
        try {
            const token = localStorage.getItem('token')
            if (!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.post('/proyectos', proyecto, config) // en post: url, datos, config 
            //Sincronisar el state sin consultar la BD ni recargar la pág al agregar proyectos
            setProyectos([...proyectos, data]) 

            setAlerta({
                msg: 'Proyecto Creado Correctamente',
                error: false
            })

            setTimeout(() => {
                setAlerta({}) //Vaciar el state de los datos ingresados de nuevo proyecto 
                navigate('/proyectos') //Redireccionar a Proyectos
            }, 3000);
        } catch (error) {
            console.log(error)
        }
    }

//---------------------------------------------Obtener Proyecto por id---------------------------------------------
    const obtenerProyecto = async id => {
        setCargando(true)
        try {
            const token = localStorage.getItem('token')
            if (!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios(`/proyectos/${id}`, config)
            setProyecto(data) //State
            setAlerta({})
        } catch (error) {
            navigate('/proyectos') //Si no hay permisos retorna al menú proyectos
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
            setTimeout(() => {
                setAlerta({})
            }, 3000);
        } finally {
            setCargando(false)
        }
    }

    //---------------------------------------------Eliminar proyecto---------------------------------------------
    const eliminarProyecto = async id => {
        try {
            const token = localStorage.getItem('token')
            if (!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.delete(`/proyectos/${id}`, config)

            //Sincronizar el state
            const proyectosActualizados = proyectos.filter(proyectoState => proyectoState._id !== id)
            setProyectos(proyectosActualizados) //Lo que coloco en el state ya actualizado

            setAlerta({
                msg: data.msg,
                error: false
            })
            setTimeout(() => {
                setAlerta({}) //Vaciar el state de los datos ingresados de nuevo proyecto
                navigate('/proyectos') //Redireccionar a Proyectos
            }, 3000);
        } catch (error) {
            console.log(error)
        }
    }

    //--------------------------------------------------Modal Tarea--------------------------------------------------

    const handleModalTarea = () => {
        setModalFormularioTarea(!modalFormularioTarea)
        //Reiniciar cuando se busque agregar una nueva tarea
        setTarea({}) 
    }

    //--------------------------------------------------Enviar Tarea--------------------------------------------------

    const submitTarea = async tarea => {
        if (tarea?.id) {
            await editarTarea(tarea)
        } else {
            await crearTarea(tarea)
        }
    }

    //--------------------------------------------------Crear Tarea--------------------------------------------------

    const crearTarea = async tarea => {
        try {
            const token = localStorage.getItem('token')
            if (!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.post('/tareas', tarea, config) //Rta API

            setAlerta({})
            setModalFormularioTarea(false)

            //SOCKET IO
            socket.emit('nueva tarea', data)
        } catch (error) {
            console.log(error)
        }
    }

    //--------------------------------------------------Editar Tarea--------------------------------------------------
    const editarTarea = async tarea => {
        try {
            const token = localStorage.getItem('token')
            if (!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.put(`/tareas/${tarea.id}`, tarea, config)
     
            setAlerta({})
            setModalFormularioTarea(false)

            //socket io
            socket.emit('actualizar tarea', data)
        } catch (error) {
            console.log(error)
        }
    }

    const handleModalEditarTarea = tarea => {
        setTarea(tarea)
        setModalFormularioTarea(true) //Mostrar el modal de tarea
    }

    //--------------------------------------------------Eliminar Tarea--------------------------------------------------

    const handleModalEliminarTarea = tarea => {
        setTarea(tarea)
        setModalEliminarTarea(!modalEliminarTarea)
    }

    //Conecto con la API
    const eliminarTarea = async () => {
        try {
            const token = localStorage.getItem('token')
            if (!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.delete(`/tareas/${tarea._id}`, config) //El id proviene de la BD, por eso _
            setAlerta({
                msg: data.msg,
                error: false
            })
     
            setModalEliminarTarea(false)

            //socket io
            socket.emit('eliminar tarea', tarea)

            setTarea({})
            setTimeout(() => {
                setAlerta({})
            }, 3000) 
        } catch (error) {
            console.log(error)
        }
    }

    //-----------------------------------------------Buscar Colaborador-----------------------------------------------
    const submitColaborador = async email => {

        setCargando(true) //Mostrar que está buscando
        try {
            const token = localStorage.getItem('token')
            if (!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.post('/proyectos/colaboradores', {email}, config)
            //Si encuentra el email
            setColaborador(data)
            setAlerta({})
        } catch (error) {
            //Mostrar Alerta de usuario no encontrado
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
        } finally {
            setCargando(false)
        }
    }

    //--------------------------------------------Agregar Colaborador--------------------------------------------
    const agregarColaborador = async email => {
        try {
            const token = localStorage.getItem('token')
            if (!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.post(`/proyectos/colaboradores/${proyecto._id}`, email, config)

            setAlerta({
                msg: data.msg,
                error: false
            })
            setColaborador({}) //Resetear Objeto
            setTimeout(() => {
                setAlerta({})
            }, 3000);
        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
        }
    }
    //------------------------------------------Eliminar Colaborador------------------------------------------
    const handleModalEliminarColaborador = (colaborador) => {
        setModalEliminarColaborador(!modalEliminarColaborador)
        setColaborador(colaborador)
    }

    const eliminarColaborador = async () => {
        try {
            const token = localStorage.getItem('token')
            if (!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.post(`/proyectos/eliminar-colaborador/${proyecto._id}`, { id: colaborador._id }, config)

            const proyectoActualizado = { ...proyecto } //Copia para actualizar el State

            proyectoActualizado.colaboradores = proyectoActualizado.colaboradores.filter(colaboradorState => colaboradorState._id !== colaborador._id)

            setProyecto(proyectoActualizado)
            setAlerta({
                msg: data.msg,
                error: false
            })
            setColaborador({})
            setModalEliminarColaborador(false)

            setTimeout(() => {
                setAlerta({})
            }, 3000);

        } catch (error) {
            console.log(error.response)
        }
    }

    //------------------------------------------Completar Tarea------------------------------------------   
    const completarTarea = async id => {
        try {
            const token = localStorage.getItem('token')
            if (!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.post(`/tareas/estado/${id}`,{}, config)
            setTarea({})
            setAlerta({})

            //Socket io
            socket.emit('cambiar estado', data)

        } catch (error) {
            console.log(error.response)
        }
    }

    //------------------------------------------Buscador de Proyecto------------------------------------------
    const handleBuscador = () => {
        setBuscador(!buscador)
    }

     //-----------------------------------------------Socket io-----------------------------------------------
    const submitTareaProyecto = (tarea) => {         //Agregar Tarea al State
            //Tomo copia del proyecto
            const proyectoActualizado = {...proyecto} 
            //Tomo copia de las tareas del proyecto y agrego la nueva tarea
            proyectoActualizado.tareas = [...proyectoActualizado.tareas, tarea] 
            setProyecto(proyectoActualizado)
    }

    const eliminarTareaProyecto = tarea => {
        //Actualizar el DOM con Tarea Eliminada
        const proyectoActualizado = {...proyecto}
        proyectoActualizado.tareas = proyectoActualizado.tareas.filter(tareaState => tareaState._id !== tarea._id)
        setProyecto(proyectoActualizado) //Para mostrar en el state  
    }

    const actualizarTareaProyecto = tarea => {
        //Actualizar el DOM
        const proyectoActualizado = {...proyecto}
        proyectoActualizado.tareas = proyectoActualizado.tareas.map(tareaState => tareaState._id === tarea._id ? tarea : tareaState)
        setProyecto(proyectoActualizado) //Para mostrar en el state             
    }

    const cambiarEstadoTarea = tarea => {
        //Actualizar el DOM
        const proyectoActualizado = {...proyecto}
        proyectoActualizado.tareas = proyectoActualizado.tareas.map(tareaState => tareaState._id === tarea._id ? tarea : tareaState)
        setProyecto(proyectoActualizado)
    }

     //--------------------------------------------Cerrar Sesión--------------------------------------------
    const cerrarSesionProyectos = () => {
        setProyectos([])
        setProyecto({})
        setAlerta({})
    }

    return (
        <ProyectosContext.Provider
            value={{
                proyectos,
                mostrarAlerta,
                alerta,
                submitProyecto,
                obtenerProyecto,
                proyecto,
                cargando,
                eliminarProyecto,
                modalFormularioTarea,
                handleModalTarea,
                submitTarea,
                handleModalEditarTarea,
                tarea,
                modalEliminarTarea,
                handleModalEliminarTarea,
                eliminarTarea,
                submitColaborador,
                colaborador,
                agregarColaborador,
                modalEliminarColaborador,
                handleModalEliminarColaborador,
                eliminarColaborador,
                completarTarea,
                buscador,
                handleBuscador,
                submitTareaProyecto,
                eliminarTareaProyecto,
                actualizarTareaProyecto,
                cambiarEstadoTarea,
                cerrarSesionProyectos
            }}
        >{children}
        </ProyectosContext.Provider>
    )
}
export {
    ProyectosProvider
}

export default ProyectosContext