import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import clienteAxios from '../config/clienteAxios'
import Alerta from '../components/Alerta'

const NuevoPassword = () => {

	const [password, setPassword] = useState('')
	const [tokenValido, setTokenValido] = useState(false)
	const [alerta, setAlerta] = useState({})
	const [passwordModificado, setPasswordModificado] = useState(false)

	const params = useParams()
	const { token } = params

	useEffect(() => {
		const comprobarToken = async () => {
			try {
				await clienteAxios(`/usuarios/olvide-password/${token}`) 
				setTokenValido(true)
			} catch (error) {
				setAlerta({
					msg: error.response.data.msg,
					error: true
				})
			}
		}
		comprobarToken()
	}, []) //Se ejecuta una sola vez

	const handleSubmit = async e => {
		e.preventDefault();

		if (password.length < 6) { //Validando la extensión del password
			setAlerta({
				msg: 'El Password debe contener al menos 6 caracteres',
				error: true
			})
			return
		}

		//Almacenando el Nuevo Password
		try {
			const url = `/usuarios/olvide-password/${token}`
			const { data } = await clienteAxios.post(url, { password })
			setAlerta({
				msg: data.msg,
				error: false
			})
			setPasswordModificado(true)
		} catch (error) {
			setAlerta({
				msg: error.response.data.msg,
				error: true
			})
		}
	}
	const { msg } = alerta

	return (
		<>
			<h1 className="text-sky-600 font-black text-5xl capitalize">Reestablece tu Password y no pierdas acceso a tus {''}<span className="text-slate-600">proyectos</span></h1>

			{msg && <Alerta alerta={alerta} />}

			{tokenValido && (
				<form
					className="my-10 bg-white shadow rounded-lg p-10"
					onSubmit={handleSubmit}
				>
					<div className="my-5">
						<label
							className="uppercase text-gray-600 block text-xl font-bold"
							htmlFor="email"
						>Nuevo Password</label>
						<input
							id="password"
							type="password"
							placeholder="Escribe tu Nuevo Password"
							className="w-full mb-5 p-3 border rounded-xl bg-gray-100"
							value={password}
							onChange={e => setPassword(e.target.value)}
						/>
					</div>
					<input
						type="submit"
						value="Guardar Nuevo Password"
						className="bg-sky-600 w-full py-3 mt-4 text-white uppercase font-bold rounded
					hover:cursor-pointer hover:bg-sky-700 transition-colors"
					/>
				</form>
			)}


			{passwordModificado && (
				<Link
					className="block text-center my-5 text-slate-500 text-sm uppercase"
					to="/"
				>Inicia Sesión </Link>
			)
			}

		</>
	)
}

export default NuevoPassword