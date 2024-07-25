import React, { useState } from 'react'
import Passwordinput from '../../components/Input/Passwordinput'
import { Link, useNavigate } from 'react-router-dom'
import { validateEmail } from '../../utils/helper'
import axios from 'axios'
import { toast } from 'react-toastify'


const Signup = () => {
  const [name,setName] = useState("")
  const [email,setEmail] = useState("")
  const [password,setPassword]=useState("")
  const [error,setError] = useState("")
  
  const navigate= useNavigate()
  const handleSignUp = async (e) =>{
    e.preventDefault()
    
   if(!name){
    setError("Please enter your name")
    return
   }

    if(!validateEmail(email)){
      setError("Please enter a valid email")
      return
    }

    if(!password){
      setError("Please enter password")
      return 
     }

     setError("")

     //signup api
     try {
        const res = await axios.post("http://localhost:3000/api/auth/signup",
          {username:name,email,password},{withCredentials:true})

          if(res.data.success === false){
              setError(res.data.message)
              toast.error(res.data.message)
              return 
          }
          
          toast.success(res.data.message)
          setError("")
          navigate("/login")
     } catch (error) {
        toast.error(error.message)
        console.log(error.message)
        setError(error.message)
     }

  }
  return (
    <>
    <div className='flex items-center justify-center mt-28'>
        <div className='w-96 border rounded bg-white px-7 py-10'>
            <form onSubmit={handleSignUp}>
                <h4 className='text-2xl mb-7'>Sign Up</h4>

                <input 
                 type="text" 
                 placeholder='Name' 
                 className='input-box'
                 value={name} 
                 onChange={(e)=>setName(e.target.value)} 
                />

                <input 
                 type="text" 
                 placeholder='Email' 
                 className='input-box'
                 value={email} 
                 onChange={(e)=>setEmail(e.target.value)} 
                />

                <Passwordinput value={password} onChange={e=>setPassword(e.target.value)} />

                 {error && <p className='text-red-500 text-sm pb-1'>{error}</p>}   

                <button type='submit' className='btn-primary'>Sign Up</button>    
                <p className='text-sm text-center mt-4'>Already have an account?{" "}
                <Link to={"/login"} className="font-medium text-primary underline"> Login </Link>
                </p>

            </form>
        </div>
    </div>
    </>
  )
}

export default Signup
