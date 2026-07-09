import React from 'react'
import { Route, Routes } from 'react-router-dom'
import SignUp from './pages/SignUp.jsx'
import Login from './pages/Login.jsx'


function App() {
  return (
    <Routes>
      <Route path='/register' element={<SignUp/>} />
      <Route path='/login' element={<Login />} />
    </Routes>
  )
}

export default App