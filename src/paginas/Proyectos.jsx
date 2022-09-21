import useProyectos from '../hooks/useProyectos'
import PreviewProyecto from '../components/PreviewProyecto'

const Proyectos = () => {

	const { proyectos } = useProyectos()
	console.log(proyectos)

	return (
		<>
		<h1 className='text-4xl font-black'>Proyectos</h1>

		<div className='bg-white shadow mt-10 rounded-lg'>
			{proyectos.length ? 
				proyectos.map(proyecto => (
					<PreviewProyecto
						key={proyecto._id}
						proyecto={proyecto}
					/>
				))
			: <p className='uppercase font-bold text-center text-gray-500 p-4'>No hay proyectos aún</p>}
		</div>
		</>
	)
}

export default Proyectos


