import React from 'react'
import logo from '../assets/loan.png'
import { Link } from 'react-router-dom'

function Header() {
  return (
    <section className='top-0 z-50 lg:z-40 bg-white  sticky shadow-xs h-15'>
        <div className='px-5 py-1 flex items-center justify-between'>
          <img src={logo} width={50} height={50} alt="" />

          <ul className='flex items-center justify-between    lg:text-sm text-xs gap-5'>
            <li className='cursor-pointer'> <Link to={'/'}>Home</Link></li>
            
            <li className='font-semibold border border-green-400 px-3 py-1 cursor-pointer'><Link to={'/'}>Learn more</Link></li>
          </ul>

        </div>

    </section>
  )
}

export default Header