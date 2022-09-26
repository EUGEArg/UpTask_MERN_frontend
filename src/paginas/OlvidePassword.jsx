import { useState } from 'react'
import { Link } from 'react-router-dom'
import clienteAxios from '../config/clienteAxios'
import Alerta from '../components/Alerta'

const OlvidePassword = () => {
	const [email, setEmail] = useState('')
	const [alerta, setAlerta] = useState({})

	const handleSubmit = async e => {
		e.preventDefault();

		if(email === '' || email.length < 6) { //Validación del email
			setAlerta({
				msg: 'El Email es obligatorio',
				error: true
			})
			return
		}

		try{               									
			const { data } = await clienteAxios.post(`/usuarios/olvide-password`, {email})
		
			setAlerta({
				msg:data.msg,
				error: false
			})
		}catch(error){
			setAlerta({
				msg: error.response.data.msg,
				error: true
			})
		}
	}

	const { msg } = alerta

	return (
		<>
			<h1 className=" text-slate-500 font-black text-4xl text-center capitalize">Recupera tu {' '} 
				<span className="text-blue-500">acceso</span> y no pierdas tus {' '} 
				<span className="text-blue-500">Proyectos</span>
			</h1>

			{ msg && <Alerta alerta={alerta}/>}

			<form
				className="my-10 bg-white shadow rounded-lg p-10"
				onSubmit={handleSubmit}
			>
				<div className="my-5">
					<label
						className="uppercase text-slate-600 block text-xl font-bold"
						htmlFor="email"
					>Email</label>
					<input
						id="email"
						type="email"
						placeholder="Email de Registro"
						className="w-full mb-5 p-3 border rounded-xl bg-slate-100"
						value={email}
						onChange={e => setEmail(e.target.value)} //A medida que escribe el usuario se setea en el state
					/>
				</div>
				<input
					type="submit"
					value="Enviar Instrucciones"
					className="bg-blue-500 w-full py-3 mt-4 text-white uppercase font-bold rounded
				hover:cursor-pointer hover:bg-blue-600 transition-colors"
				/>
			</form>

			<nav className="lg:flex lg:justify-between">
				<Link
					className="block text-center my-5 text-slate-500 text-sm uppercase"
					to="/"
				>Ya tienes una Cuenta? <span className="text-blue-500">Inicia Sesión </span></Link>
				<Link
					className="block text-center my-5 text-slate-500 text-sm uppercase"
					to="/registrar"
				>No tienes una cuenta? <span className="text-blue-500">Regístrate</span></Link>
			</nav>
		</>
	)
}

export default OlvidePassword