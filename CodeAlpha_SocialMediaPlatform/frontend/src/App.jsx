import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import SignUp from './pages/SignUp.jsx'
import Login from './pages/Login.jsx'
import Home from './pages/Home.jsx'
import getCurrentUser from './hooks/getCurrentUser.jsx'
import getSuggestedUsers from './hooks/getSuggestedUser.jsx'
import Profile from './pages/Profile.jsx'
import EditProfile from './pages/EditProfile.jsx'
import Upload from './pages/Upload.jsx'
import useGetAllPosts, { fetchPosts } from "./hooks/getAllPost";
import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from "react-redux";
import SearchUser from './components/SearchUser.jsx'
import EditPost from './pages/EditPost.jsx'
function App() {
  const dispatch = useDispatch();

  useGetAllPosts();

  // 1. Grab your location path strings
  const { pathname } = useLocation();
  const scrollRegistry = useRef({});

  useEffect(() => {
    // 2. Select the scrollable layout div container
    const scrollContainer = document.querySelector('.overflow-y-auto');
    if (!scrollContainer) return;

    // 3. RESTORE: If we have a saved height position, jump there; if not, go to the top
    if (scrollRegistry.current[pathname] !== undefined) {
      scrollContainer.scrollTo(0, scrollRegistry.current[pathname]);
    } else {
      scrollContainer.scrollTo(0, 0);
    }

    // 4. SAVE: Track manual scrolling actions in real-time to log active heights
    const handleScroll = () => {
      scrollRegistry.current[pathname] = scrollContainer.scrollTop;
    };

    scrollContainer.addEventListener("scroll", handleScroll);
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, [pathname]); // Fires cleanly every single time you navigate paths

  getCurrentUser();
  getSuggestedUsers();
  useGetAllPosts()

  const { userData } = useSelector(state => state.user)
  return (
    <Routes>
      <Route path='/register' element={!userData ? <SignUp /> : <Navigate to={'/'} />} />
      <Route path='/login' element={!userData ? <Login /> : <Navigate to={'/'} />} />
      <Route path='/' element={userData ? <Home /> : <Navigate to={'/login'} />} />
      <Route path='/profile/:userName' element={userData ? <Profile /> : <Navigate to={'/login'} />} />
      <Route path='/search-user' element={userData ? <SearchUser /> : <Navigate to={'/login'} />} />
      <Route path='/editprofile' element={userData ? <EditProfile /> : <Navigate to={'/login'} />} />
      <Route path='/upload' element={userData ? <Upload /> : <Navigate to={'/login'} />} />
      <Route path="/editpost/:postId" element={userData ? <EditPost /> : <Navigate to="/login" />} />
    </Routes>
  )
}

export default App
