import React from 'react'

const NuevoPassword = () => {
	return (
		<>
			<h1 className="text-sky-600 font-black text-5xl capitalize">Reestablece tu Password y no pierdas acceso a tus {''}<span className="text-slate-600">proyectos</span></h1>
			<form className="my-10 bg-white shadow rounded-lg p-10">
				<div className="my-5">
					<label
						className="uppercase text-gray-600 block text-xl font-bold"
						htmlFor="email"
					>NUevo Password</label>
					<input
						id="password"
						type="password"
						placeholder="Escribe tu Nuevo Password"
						className="w-full mb-5 p-3 border rounded-xl bg-gray-100"
					/>
				</div>
				<input
					type="submit"
					value="Guardar Nuevo Password"
					className="bg-sky-600 w-full py-3 mt-4 text-white uppercase font-bold rounded
					hover:cursor-pointer hover:bg-sky-700 transition-colors"
				/>
			</form>
		</>
	)
}

export default NuevoPassword