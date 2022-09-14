import { Link } from 'react-router-dom'

const Login = () => {
	return (
		<>
			<h1 className="text-sky-600 font-black text-5xl capitalize">Inicia sesión y administra tus <span className="text-slate-600">proyectos</span></h1>

			<form className="my-10 bg-white shadow rounded-lg p-10">
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
					/>
				</div>
				<input
					type="submit"
					value="Iniciar Sesión"
					className="bg-sky-600 w-full py-3 mt-4 text-white uppercase font-bold rounded
					hover:cursor-pointer hover:bg-sky-700 transition-colors"
				/>
			</form>

			<nav className="lg:flex lg:justify-between">
				<Link
					className="block text-center my-5 text-slate-500 text-sm uppercase"
					to="/registrar"
				>No tienes una cuenta? <span className="text-sky-500">Regístrate</span></Link>
				<Link
					className="block text-center my-5 text-slate-500 text-sm uppercase"
					to="/olvide-password"
				>Olvidé mi Password</Link>
			</nav>
		</>
	)
}

export default Login