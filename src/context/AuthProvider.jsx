import { useState, useEffect, createContext } from 'react'
import { useNavigate } from 'react-router-dom'
import clienteAxios from '../config/clienteAxios';

//-----Context de Autenticación -----
const AuthContext = createContext(); //Crear Context

//AuthProvider rodea toda la app, de dónde provienen los datos
const AuthProvider = ({ children }) => {

    const [auth, setAuth] = useState({}) //Cuando el usuario es autenticado retornamos un objeto
    const [cargando, setCargando] = useState(true)

    const navigate = useNavigate()

    useEffect(() => {
        const autenticarUsuario = async () => { //Llamado a la API
            const token = localStorage.getItem('token')
            if(!token){ //Si hay un token se intenta autenticar al usuario
                setCargando(false)
                return
            }

            //----- Para tener el perfil: Bearer token y autorización--- Se pasan como config
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
      
            //Para traer la info del perfil
            try{ 
                const {data} = await clienteAxios('/usuarios/perfil', config)
                setAuth(data) //Rta
                // navigate('/proyectos')                
            }catch(error){
                setAuth({})
            }             
            setCargando(false)            
        }
        autenticarUsuario()
    },[]) //Se ejecuta una sola vez para comprobar si hay un token

//-----------------------------------------------Cerrar Sesión-----------------------------------------------
const cerrarSesionAuth = () => {
    setAuth({})
} 

    return (
        <AuthContext.Provider
            value={{ //Disponible para compartir en la app
                auth,
                setAuth,
                cargando,
                cerrarSesionAuth
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export{
    AuthProvider
}

export default AuthContext;