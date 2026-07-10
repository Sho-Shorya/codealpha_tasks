import { Navigate, Route, Routes } from 'react-router-dom'
import SignUp from './pages/SignUp.jsx'
import Login from './pages/Login.jsx'
import Home from './pages/Home.jsx'
import { useSelector } from 'react-redux'
import useGetCurrentUser from './hooks/getCurrentUser.jsx'

function App() {
  useGetCurrentUser()
  const { userData } = useSelector(state => state.user)
  return (
    <Routes>
      <Route path='/register' element={!userData ? <SignUp /> : <Navigate to={'/'}/>} />
      <Route path='/login' element={!userData ? <Login /> :  <Navigate to={'/'}/>}/>
      <Route path='/' element={userData ? <Home /> : <Navigate to={'/login'}/>} />
    </Routes>
  )
}

export default App
