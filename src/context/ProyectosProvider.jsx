import { useState, useEffect, createContext } from 'react'
import clienteAxios from '../config/clienteAxios'
import { useNavigate } from 'react-router-dom'

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
    const [modalEliminarColaborador, setmodalEliminarColaborador] = useState(false)
    const [buscador, setBuscador] = useState(false)

    const navigate = useNavigate();

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
    }, [])

    const mostrarAlerta = alerta => { //Alerta de campos obligatorios
        setAlerta(alerta)

        setTimeout(() => { //A los 5 seg se resetea
            setAlerta({})
        }, 5000)
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
            }, 3000)

            //Redireccionar
        } catch (error) {
            console.log(error)
        }
    }

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
            setProyectos([...proyectos, data]) //Sincronisar el state sin consultar la BD ni recargar la pág al agregar proyectos

            setAlerta({
                msg: 'Proyecto Creado Correctamente',
                error: false
            })

            setTimeout(() => {
                setAlerta({}) //Vaciar el state de los datos ingresados de nuevo proyecto
                navigate('/proyectos') //Redireccionar a Proyectos
            }, 3000)
        } catch (error) {
            console.log(error)
        }
    }

    //------Obtener Proyecto por id-----
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
            }, 3000)
        } catch (error) {
            console.log(error)
        }
    }

    //--------------------------------------------------Modal--------------------------------------------------

    const handleModalTarea = () => {
        setModalFormularioTarea(!modalFormularioTarea)
        setTarea({}) //Para reiniciar cuando se busque agregar una nueva tarea
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

            //Agregar Tarea al State
            const proyectoActualizado = { ...proyecto } //Tomo copia del proyecto
            proyectoActualizado.tareas = [...proyecto.tareas, data] //Tomo copia de las tareas del proyecto y agrego la nueva tarea
            setProyecto(proyectoActualizado)
            setAlerta({})
            setModalFormularioTarea(false)
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

            //Actualizar el DOM
            const proyectoActualizado = { ...proyecto }
            proyectoActualizado.tareas = proyectoActualizado.tareas.map(tareaState => tareaState._id === data._id ? data : tareaState)
            setProyecto(proyectoActualizado) //Para mostrar en el state        
            setAlerta({})
            setModalFormularioTarea(false)
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

            //Actualizar el DOM con Tarea Eliminada
            const proyectoActualizado = { ...proyecto }
            proyectoActualizado.tareas = proyectoActualizado.tareas.filter(tareaState => tareaState._id !== tarea._id)
            setProyecto(proyectoActualizado) //Para mostrar en el state        
            setModalEliminarTarea(false)
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

            const { data } = await clienteAxios.post('/proyectos/colaboradores', { email }, config)
            //Si encuentra el email
            setColaborador(data)

            setTimeout(() => {
                setAlerta({})
            }, 3000)
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
            // setAlerta({})
        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
        }
    }
    //------------------------------------------Eliminar Colaborador------------------------------------------
    const handleModalEliminarColaborador = (colaborador) => {
        setmodalEliminarColaborador(!modalEliminarColaborador)
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
            setmodalEliminarColaborador(false)
            setTimeout(() => {
                setAlerta({})
            }, 3000)

        } catch (error) {
            console.
                log(error.response)
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
            const { data } = await clienteAxios.post(`/tareas/estado/${id}`, {}, config)

            const proyectoActualizado = { ...proyecto }
            proyectoActualizado.tareas = proyectoActualizado.tareas.map(tareaState => tareaState._id === data._id ? data : tareaState)

            setProyecto(proyectoActualizado)
            setTarea({})
            setAlerta({})

        } catch (error) {
            console.log(error.response)
        }
    }

    //------------------------------------------Buscador de Proyecto------------------------------------------
    const handleBuscador = () => {
        setBuscador(!buscador)
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
                handleBuscador
            }}
        >{children}
        </ProyectosContext.Provider>
    )
}

export {
    ProyectosProvider
}

export default ProyectosContext