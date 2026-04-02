import React, { useState } from 'react'
import { IoClose } from 'react-icons/io5'
import AxiosToastError from '../../../utils/AxiosToastError'
import Axios from '../../../utils/Axios'
import SummaryApi from '../../../common/SummaryApi'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

function AddAgent({close,fetchDashboard}) {
    const navigate = useNavigate()
    const[agent,setAgent]=useState({
        name:"",
        email:"",
        phone:"",
        nationalId:""
        
    })

    const handleAddAgent=async(e)=>{
        e.preventDefault()

        try {
            const response=await Axios({
                ...SummaryApi.addAgent, 
                 data: agent     
            })
            if(response.data.success){
                toast.success(response.data.message)
                setAgent({
                    name:"",
                    email:"",
                    phone:"",
                    nationalId:""

                })
                fetchDashboard()
                close()
                navigate("/adminStats/adminDashboard")
            }
            else{
                toast.error(response.data.error)
            }
            
        } catch (error) {
            AxiosToastError(error)
            
        }
    }

     const handleChange = (e) => {
        const { name, value } = e.target
        setAgent(prev => 
            ({
                 ...prev, [name]: value 
                })
            )
    }

return (
 
    
    <section className='bg-gray-950/50   fixed top-0 flex  items-center justify-center bottom-0 right-0 left-0 '>
         <div className='bg-white py-6 px-5 max-w-sm w-full md:max-w-md md:w-full lg:max-w-lg lg:w-full rounded mx-2 '>
            <div className='flex justify-between items-center'>
                <p className='text-xs font-semibold lg:text-sm my-2 text-gray-700'>Add Agent</p>
                <IoClose onClick={close} className='cursor-pointer'/>
            </div>
            <form action="" onSubmit={handleAddAgent}>
            <div className=' grid'>
            <div className='grid grid-cols-2 lg:grid-cols-3 items-center justify-between gap-2 text-xs'>
                <div className='grid items-center justify-between gap-2 my-2'>
                    <label htmlFor="" className='text-gray-600'>Name</label>
                    <input type="text" name='name' id='name' value={agent.name}  onChange={handleChange} className='outline-none bg-gray-100 p-2 w-full rounded-lg' placeholder='Enter  name'/>
                </div>
                <div className='grid items-center justify-between gap-2 my-2'>
                    <label htmlFor="" className='text-gray-600'>Email</label>
                    <input type="text" name='email' id='email' value={agent.email}  onChange={handleChange} className='outline-none   bg-gray-100 p-2 w-full rounded-lg' placeholder='Enter  phone'/>
                </div>
                
                <div className='grid items-center justify-between gap-2 my-2'>
                    <label htmlFor="" className='text-gray-600'>Phone</label>
                    <input type="text" name='phone' id='phone' value={agent.phone}  onChange={handleChange} className='outline-none   bg-gray-100 p-2 w-full rounded-lg' placeholder='Enter  phone'/>
                </div>
                <div className='grid items-center justify-between gap-2 my-2'>
                    <label htmlFor="" className='text-gray-600'>ID Number</label>
                    <input type="Number" name='nationalId' id='nationalId' value={agent.nationalId}  onChange={handleChange}  className='outline-none bg-gray-100 p-2 w-full rounded-lg' placeholder='Enter national id'/>
                </div>
            </div>
                <div className='flex items-center justify-center my-3 mt-6'>
                    <button   className=' w-full cursor-pointer text-white  font-semibold  bg-gray-900 p-3 rounded-lg '>
                        Add Agent
                    </button>

                </div>

          </div>
            </form>
          

          
        </div>

    </section>
  )
}

export default AddAgent