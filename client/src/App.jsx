
import { Outlet } from 'react-router-dom'
import Footer from './component/Footer.jsx'

import { Toaster } from 'react-hot-toast'

import Header from './component/Header.jsx'

function App() {

  return (
    <>
    
    <main className='min-h-[100vh] bg-gray-900 '>
      <Outlet/>
    </main>
 <Toaster/>
    </>
  )
}
export default App