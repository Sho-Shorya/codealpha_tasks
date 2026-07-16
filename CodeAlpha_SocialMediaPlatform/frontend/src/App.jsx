import { Navigate, Route, Routes } from 'react-router-dom'
import SignUp from './pages/SignUp.jsx'
import Login from './pages/Login.jsx'
import Home from './pages/Home.jsx'
import { useSelector } from 'react-redux'
import getCurrentUser from './hooks/getCurrentUser.jsx'
import getSuggestedUsers from './hooks/getSuggestedUser.jsx'
import Profile from './pages/Profile.jsx'
import EditProfile from './pages/EditProfile.jsx'
import Upload from './pages/Upload.jsx'
import getAllPost from './hooks/getAllPost.jsx'

function App() {
  getCurrentUser();
  getSuggestedUsers();
  getAllPost()
  const { userData } = useSelector(state => state.user)
  return (
    <Routes>
      <Route path='/register' element={!userData ? <SignUp /> : <Navigate to={'/'}/>} />
      <Route path='/login' element={!userData ? <Login /> :  <Navigate to={'/'}/>}/>
      <Route path='/' element={userData ? <Home /> : <Navigate to={'/login'}/>} />
      <Route path='/profile/:userName' element={userData ? <Profile /> : <Navigate to={'/login'}/>} />
      <Route path='/editprofile' element={userData ? <EditProfile /> : <Navigate to={'/login'}/>} />
      <Route path='/upload' element={userData ? <Upload /> : <Navigate to={'/login'}/>} />
    </Routes>
  )
}

export default App
