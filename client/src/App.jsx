
import { Outlet } from 'react-router-dom'
import Footer from './component/Footer.jsx'

import { Toaster } from 'react-hot-toast'

import Header from './component/Header.jsx'

function App() {

  return (
    <>
    
    <main className='min-h-[90vh]'>
      <Outlet/>
    </main>
 <Toaster/>
    </>
  )
}
export default App