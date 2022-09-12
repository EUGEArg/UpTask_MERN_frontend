import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import Alerta from '../components/Alerta'


const ConfirmarCuenta = () => {
	const params = useParams(); //Para leer los valores de la url
	const { id } = params //Extraer el id 

	useEffect(() =>{
		const ConfirmarCuenta = async () => { //Hace un llamado hacia la API
			try{
				const url = `http://localhost:4000/api/usuarios/confirmar/${id}`
				const { data } = await axios.get
			}catch(error){
				console.log(error)
			}
		}
		ConfirmarCuenta();
	},[]) //Una sola vez se ejecuta por eso vacío

	console.log(params)


	return (
		<>
			<h1 className="text-sky-600 font-black text-5xl capitalize">Confirma tu Cuenta y Comienza a Crear Tus {''}<span className="text-slate-600">proyectos</span></h1>
		</>
	)
}

export default ConfirmarCuenta