import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'sonner'
import { Provider } from 'react-redux'
import { store } from './redux/store.js'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    {/* <SmartScrollRestorer /> */}
    <Provider store={store}>
      <div className='h-full overflow-y-auto hide-scrollbar'>
        <App />
      </div>
      <Toaster richColors position='top-right' />
    </Provider>
  </BrowserRouter>,
)
