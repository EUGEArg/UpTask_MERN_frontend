import { useContext } from 'react'
import AuthContext from '../context/AuthProvider'

//------Hook de Autenticación-----
const useAuth = () => { 
    return useContext(AuthContext) //Extraer valores de AuthContext
}

export default useAuth;