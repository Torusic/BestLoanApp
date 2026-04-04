import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import { LuLoaderCircle } from 'react-icons/lu'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

const Login = () => {
    const navigate=useNavigate()
    const[loading,setLoading]=useState(false)
    const[showPassword,setShowPassword]=useState(false)
    const[data,setData]=useState({
        phone:"",
        password:""
    })

    const handleSubmit=async(e)=>{
        e.preventDefault(e)

        try {
            setLoading(true)

            const response=await Axios({
                ...SummaryApi.login,
                data:data
                
            })
            if(response.data.success){
                toast.success(response.data.message);
                setData({
                    phone:'',
                    password:''
                })
                const role = response.data.data?.role; // adjust path based on API
                console.log("Role from API:", role);
                localStorage.setItem('role', role);

                    // Role-based navigation
                    if (role === 'admin') {
                        navigate('/adminStats/adminDashboard');
                    } else if (role === 'client') {
                        navigate('/clientStats/clientDashboard');
                    } else if (role === 'agent') {
                        navigate('/agent/dashboard');
                    } else {
                        navigate('/'); // fallback route
                    }
                    

                    } else {
                        toast.error(response.data.message);
                    }
            

            
        } catch (error) {
            AxiosToastError(error)
        }
        finally{
            setLoading(false)
        }
    }
const handleChange = (e) => {
        const { name, value } = e.target
        setData(prev => 
            ({
                 ...prev, [name]: value 
                })
            )
    }

  return (
    <section className='  flex items-center justify-center px-7 py-40'>
        <div className='max-w-md w-full items-center  bg-white shadow-md p-3 rounded-xl'>
        <div className='grid items-center  gap-2 p-2'>
            <p className='text-sm font-semibold text-green-400'>Login</p>

            <form action="" onSubmit={handleSubmit}>
              <div className='grid items-center mt-4 gap-4 p-2'>
                <div className='grid lg:text-sm text-xs gap-2'>
                    <label htmlFor="">Phone:</label>
                    <input type="text"
                    id='phone'
                    name='phone'
                    onChange={handleChange}
                    value={data.phone}
                     placeholder='Enter name' 
                     className='bg-gray-100 p-2 outline-none rounded-lg hover:border hover:border-green-300' />

                </div>
                <div className='grid lg:text-sm text-xs gap-2'>
                    <label htmlFor="">Password:</label>

                    <div className='bg-gray-100 flex items-center px-2 outline-none rounded-lg hover:border hover:border-green-300'>
                    <input
                     type={showPassword ?"text":"password" }
                    id='password'
                    name='password'
                    value={data.password}
                    onChange={handleChange}
                     placeholder='Enter password' 
                     className=' p-2 outline-none rounded-lg w-full' />

                     <span onClick={() => setShowPassword(prev => !prev)} className="cursor-pointer text-gray-500">
                       {showPassword ? <FaEye /> : <FaEyeSlash />}
                      </span>

                    </div>
                </div>

              </div>
              
              <div className='w-fit ml-auto my-4 mx-2'>
                <p className='text-xs lg:text-sm text-gray-500 cursor-pointer'>forgot password ?</p>
              </div>

              <div className='bg-gradient-to-r from-green-400 flex items-center justify-center to-green-500 rounded-lg  p-2 my-3'>
                <button className='text-white font-semibold  '><Link className=' underline px-2 text-green-400' to={'/adminStats/adminDashboard'}>{loading ? <LuLoaderCircle size={20} className='animate-spin '/> : "Login"}</Link></button>
              </div>

              <div className='my-4 mx-2 flex'>
                <p className='text-xs lg:text-sm text-gray-500'>Don't have an account ?<Link className=' underline px-2 text-green-400' to={'/register'}>Register</Link></p>
              </div>

            </form>
        </div>
        </div>

    </section>
  )
}

export default Login