import { Link } from 'react-router-dom'

const OlvidePassword = () => {
	return (
		<>
		<h1 className="text-sky-600 font-black text-5xl capitalize">Recupera tu acceso y no pierdas tus {' '} <span className="text-slate-600">proyectos</span></h1>

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
			<input
				type="submit"
				value="Enviar Instrucciones"
				className="bg-sky-600 w-full py-3 mt-4 text-white uppercase font-bold rounded
				hover:cursor-pointer hover:bg-sky-700 transition-colors"
			/>
		</form>

		<nav className="lg:flex lg:justify-between">
			<Link
				className="block text-center my-5 text-slate-500 text-sm uppercase"
				to="/"
			>Ya tienes una Cuenta? <spam className="text-sky-500">Inicia Sesión </spam></Link>
			<Link
				className="block text-center my-5 text-slate-500 text-sm uppercase"
				to="/registrar"
			>No tienes una cuenta? <spam className="text-sky-500">Regístrate</spam></Link>
		</nav>
	</>
	)
}

export default OlvidePassword