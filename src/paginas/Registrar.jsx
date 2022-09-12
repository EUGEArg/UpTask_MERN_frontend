import { useState } from 'react'
import { Link } from 'react-router-dom'
import Alerta from '../components/Alerta'
import axios from 'axios'


const Registrar = () => {
	const [ nombre, setNombre] = useState('')
	const [ email, setEmail] = useState('')
	const [ password, setPassword] = useState('')
	const [ repetirPassword, setRepetirPassword] = useState('')
	const [ alerta, setAlerta] = useState({})
	
	const handleSubmit = async e =>{
		e.preventDefault();

		if([nombre, email, password, repetirPassword].includes('')) { //Si los campos están incompletos, mostrar alerta
			setAlerta({
				msg: 'Todos los campos son obligatorios',
				error: true
			})
			return //No se sigue ejecutando
		}

		if(password !== repetirPassword) {
			setAlerta({
				msg: 'Los password no son iguales',
				error: true
			})
			return
		}

		if(password.length < 6) {
			setAlerta({
				msg: 'El password debe tener mínimo 6 caracteres',
				error: true
			})
			return
		}

		setAlerta({}) //Si todo está correcto, vuelve a ser un objeto vacío y no muestra el alerta

		//Crear Usuario en la API
		try {
			const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/usuarios`, {nombre, email, password}) //url donde envío la petición--- datos de la petición
			
			setAlerta({
				msg: data.msg,
				error: false
			})
			setNombre('')
			setEmail('')
			setPassword('')
			setRepetirPassword('')

		}catch(error){
			setAlerta({
				msg: error.response.data.msg,
				error: true
			})
		}
	}

	const { msg } = alerta //Extraigo el mje del Alerta

	return (
		<>
			<h1 className="text-sky-600 font-black text-5xl capitalize">Crea tu cuenta y administra tus <span className="text-slate-600">proyectos</span></h1>
			{msg && <Alerta alerta={alerta}/>}
			<form 
				className="my-10 bg-white shadow rounded-lg p-10"
				onSubmit={handleSubmit}>
				<div className="my-5">
					<label
						className="uppercase text-gray-600 block text-xl font-bold"
						htmlFor="nombre"
					>Nombre</label>
					<input
						id="nombre"
						type="text"
						placeholder="Tu nombre"
						className="w-full mb-5 p-3 border rounded-xl bg-gray-100"
						value={nombre}
						onChange={e=> setNombre(e.target.value)}
					/>
				</div>
				<div className="my-5">
					<label
						className="uppercase text-gray-600 block text-xl font-bold"
						htmlFor="email"
					>Email</label>
					<input
						id="email"
						type="email"
						placeholder="Email de Registro"
						className="w-full mb-5 p-3 border rounded-xl bg-gray-100"
						value={email}
						onChange={e=> setEmail(e.target.value)}
					/>
				</div>
				<div className="my-5">
					<label
						className="uppercase text-gray-600 block text-xl font-bold"
						htmlFor="email"
					>Password</label>
					<input
						id="password"
						type="password"
						placeholder="Password de Registro"
						className="w-full mb-5 p-3 border rounded-xl bg-gray-100"
						value={password}
						onChange={e=> setPassword(e.target.value)}
					/>
				</div>
				<div className="my-5">
					<label
						className="uppercase text-gray-600 block text-xl font-bold"
						htmlFor="password2"
					>Repetir Password</label>
					<input
						id="password2"
						type="password"
						placeholder="Repetir tu Password"
						className="w-full mb-5 p-3 border rounded-xl bg-gray-100"
						value={repetirPassword}
						onChange={e=> setRepetirPassword(e.target.value)}
					/>
				</div>
				<input
					type="submit"
					value="Crear Cuenta"
					className="bg-sky-600 w-full py-3 mt-4 text-white uppercase font-bold rounded
					hover:cursor-pointer hover:bg-sky-700 transition-colors"
				/>
			</form>
			<nav className="lg:flex lg:justify-between">
				<Link
					className="block text-center my-5 text-slate-500 text-sm uppercase"
					to="/"
				>Ya tienes una Cuenta? <span className="text-sky-500">Inicia Sesión </span></Link>
				<Link
					className="block text-center my-5 text-slate-500 text-sm uppercase"
					to="/olvide-password"
				>Olvidé mi Password</Link>
			</nav>
		</>
	)
}

export default Registrar