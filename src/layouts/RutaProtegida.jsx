import { Outlet, Navigate } from "react-router-dom"
import useAuth from "../hooks/useAuth"
import Header from "../components/Header"
import Sidebar from "../components/Sidebar"


const RutaProtegida = () => {
    const { auth, cargando } = useAuth()

    if(cargando) return 'Cargando...'

    return (
        <>       
        {auth._id ? (
            // Diseño de la app
            <div className="bg-gray-100">
                <Header/>
                <div className="md:flex md:min-h-screen">
                    <Sidebar/>
                    <main className="p-10 flex-1">
                        <Outlet/>
                    </main>

                </div>

            </div>
        ): <Navigate to='/'/>}  {/* Si no está autenticado lo redirige a iniciar sesión */}
        </>
    )
}

export default RutaProtegida