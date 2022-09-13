import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import Alerta from '../components/Alerta'


const ConfirmarCuenta = () => {
	const [alerta, Setalerta] = useState({})
	const [cuentaConfirmada, setCuentaConfirmada] = useState(false)

	const params = useParams(); //Leer los valores de la url
	const { id } = params //Extraer el id 

	useEffect(() =>{
		const ConfirmarCuenta = async () => { //Hace un llamado hacia la API
			try{
				const url = `http://localhost:4000/api/usuarios/confirmar/${id}`
				const { data } = await axios(url) //Tipo GET
				
				Setalerta({
					msg: data.msg,
					error: false
				})
				setCuentaConfirmada(true)

			}catch(error){
				Setalerta({
					msg:error.response.data.msg,
					error: true
				})
			}
		}
		ConfirmarCuenta();
	},[]) //Una sola vez se ejecuta por eso vacío

	const { msg } = alerta

	console.log(params)


	return (
		<>
			<h1 className="text-sky-600 font-black text-5xl capitalize">Confirma tu Cuenta y Comienza a Crear Tus {''}<span className="text-slate-600">proyectos</span></h1>
		
			<div className='mt-20 md:mt-10 shadow-lg px-5 py-10 rounded-xl bg-white'>
				{msg && <Alerta alerta={alerta}/>} 
				{cuentaConfirmada && (
					<Link
						className="block text-center my-5 text-slate-500 text-sm uppercase"
						to="/"
					>Inicia Sesión </Link>
				)}
			</div>

		</>
		
	)
}

export default ConfirmarCuenta