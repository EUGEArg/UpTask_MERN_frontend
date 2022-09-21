import { formatearFecha } from "../helpers/formatearFecha"
import useProyectos from "../hooks/useProyectos"

const Tarea = ({ tarea }) => {

    const {handleModalEditarTarea, handleModalEliminarTarea} = useProyectos()

    const { nombre, description, fechaEntrega, prioridad, estado, _id } = tarea


    return (
        <div className="border-b p-5 flex justify-between items-center">
            <div>
                <p className="mb-2 text-xl">{nombre}</p>
                <p className="mb-2 text-sm text-gray-500 uppercase">{description}</p>
                <p className="mb-2 text-sm">{formatearFecha(fechaEntrega)}</p>
                <p className="mb-2 text-gray-600">Prioridad: {prioridad}</p>
            </div>
            <div className="flex gap-2">
                <button
                    className="bg-indigo-400 p-2 rounded-lg uppercase text-white font-bold text-sm"
                    onClick={() => handleModalEditarTarea(tarea)}
                >Editar</button>

                {estado ? (
                    <button
                        className="bg-lime-500 p-2 rounded-lg uppercase text-white font-bold text-sm"
                    >Completa</button>
                ) : (
                    <button
                        className="bg-slate-400 p-2 rounded-lg uppercase text-white font-bold text-sm"
                    >Incompleta</button>
                )}
                <button
                    className="bg-rose-500 p-2 rounded-lg uppercase text-white font-bold text-sm"
                    onClick={() => handleModalEliminarTarea(tarea)}
                >Eliminar</button>
            </div>

        </div>
    )
}

export default Tarea