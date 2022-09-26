import { formatearFecha } from "../helpers/formatearFecha"
import useProyectos from "../hooks/useProyectos"
import useAdmin from "../hooks/useAdmin"

const Tarea = ({ tarea }) => {

    const {handleModalEditarTarea, handleModalEliminarTarea, completarTarea} = useProyectos()
    const admin = useAdmin()

    const { nombre, description, fechaEntrega, prioridad, estado, _id } = tarea


    return (
        <div className="border-b p-5 flex justify-between items-center">
            <div className="flex flex-col items-start">
                <p className="mb-2 text-xl">{nombre}</p>
                <p className="mb-2 text-sm text-slate-500 uppercase">{description}</p>
                <p className="mb-2 text-sm">{formatearFecha(fechaEntrega)}</p>
                <p className="mb-2 text-slate-600">Prioridad: {prioridad}</p>
                { estado && <p className="p-1 bg-green-500 rounded-lg text-sm  text-white uppercase font-bold">Completada por: {tarea.completado.nombre}</p>}
            </div>
            <div className="flex flex-col lg:flex-row gap-2">

                {admin && (
                    <button
                        className="bg-indigo-400 p-2 rounded-lg uppercase text-white font-bold text-sm"
                        onClick={() => handleModalEditarTarea(tarea)}
                    >Editar</button>
                )}

                <button
                    className={ `${estado ? 'bg-green-500' : 'bg-slate-500'} p-2 rounded-lg uppercase text-white font-bold text-sm`}
                    onClick={() => completarTarea(_id)}
                >{estado ? 'Completa' : 'Incompleta'}</button>

                {admin && (
                    <button
                        type="button"
                        className="bg-rose-500 p-2 rounded-lg uppercase text-white font-bold text-sm"
                        onClick={() => handleModalEliminarTarea(tarea)}
                    >Eliminar</button>
                )}
            </div>

        </div>
    )
}

export default Tarea