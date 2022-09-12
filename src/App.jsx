import { BrowserRouter, Routes, Route} from 'react-router-dom'
import AuthLayout from './layouts/AuthLayout'
import Login from './paginas/Login'
import Registrar from './paginas/Registrar'
import OlvidePassword from './paginas/OlvidePassword'
import NuevoPassword from './paginas/NuevoPassword'
import ConfirmarCuenta from './paginas/ConfirmarCuenta'

function App() {


	return (
		<BrowserRouter>
			<Routes> {/* Parte Pública */}
				<Route path='/' element={<AuthLayout/>}> 
				<Route index element={<Login/>}/>
				<Route path='registrar' element={<Registrar/>}/>
				<Route path='olvide-password' element={<OlvidePassword/>}/>
				<Route path='olvide-password/:token' element={<NuevoPassword/>}/>
				<Route path='confirmar/:id' element={<ConfirmarCuenta/>}/>
				</Route>
			</Routes>
		</BrowserRouter>
	)
}

export default App
