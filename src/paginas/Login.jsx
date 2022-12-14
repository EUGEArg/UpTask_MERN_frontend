import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Alerta from '../components/Alerta'
import clienteAxios from '../config/clienteAxios'
import useAuth from '../hooks/useAuth'

const Login = () => {

	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [alerta, setAlerta] = useState({})

	const { setAuth } = useAuth();

	const navigate = useNavigate()


	const handleSubmit = async e => {
		e.preventDefault();

		if ([email, password].includes('')) { //Comprobar campos completos 
			setAlerta({
				msg: 'Todos los campos son obligatorios',
				error: true
			});
			return
		}

		//------consulta API------
		try {
			const { data } = await clienteAxios.post('/usuarios/login', { email, password }) //data: res de la consulta
			setAlerta({})
			localStorage.setItem('token', data.token) //Almacenamiento del token
			setAuth(data)
			navigate('/proyectos')
		} catch (error) {
			console.log(error)
			setAlerta({
				msg: error.response.data.msg, //Para ver el msg de error
				error: true
			})
		}
	}

	const { msg } = alerta

	return (
		<>
			<h1 className="text-pink-600 font-black text-5xl mb-6 text-center capitalize">UpTask</h1>
			<h2 className='text-slate-500 font-black text-4xl capitalize text-center'>Gestiona los 
				<span className='text-blue-500'> proyectos</span> de tu 
				<span className='text-blue-500'> equipo</span> desde cualquier 
				<span className='text-blue-500'> lugar</span>
			</h2>

			{msg && <Alerta alerta={alerta} />}

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
						onChange={e => setEmail(e.target.value)}
					/>
				</div>
				<div className="my-5">
					<label
						className="uppercase text-slate-600 block text-xl font-bold"
						htmlFor="email"
					>Password</label>
					<input
						id="password"
						type="password"
						placeholder="Password de Registro"
						className="w-full mb-5 p-3 border rounded-xl bg-slate-100"
						value={password}
						onChange={e => setPassword(e.target.value)}
					/>
				</div>
				<input
					type="submit"
					value="Iniciar Sesi??n"
					className="bg-blue-500 w-full py-3 mt-4 text-white uppercase font-bold rounded
					hover:cursor-pointer hover:bg-blue-600 transition-colors"
				/>
			</form>

			<nav className="lg:flex lg:justify-between">
				<Link
					className="block text-center my-5 text-slate-500 text-sm uppercase"
					to="/registrar"
				>No tienes una cuenta? <span className="text-blue-500">Reg??strate</span></Link>
				<Link
					className="block text-center my-5 text-slate-500 text-sm uppercase"
					to="/olvide-password"
				>Olvid?? mi Password</Link>
			</nav>
		</>
	)
}

export default Login