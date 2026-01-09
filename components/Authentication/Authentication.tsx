'use client';
import {FaEye, FaEyeSlash} from "react-icons/fa";
import { useState } from "react";


export default function Authentication({signUp}: {signUp: boolean}){

    const [isVisible, setIsVisible] = useState(false)

    if (signUp){
       return(

           <div className="flex h-[100dvh]">
  <img
    src="/Media/Images/Authentication/login-photo.jpg"
    alt="Home Page Fashion Image"
    className="w-1/2 h-full object-cover aspect-[4/5]"
  />

  <div className="w-1/2 p-12 flex flex-col text-center justify-center">
    <h1 className="font-edwardian text-8xl tracking-wide">
      Truce
    </h1>

    <h2 className="font-sans text-2xl tracking-wide mb-8">
      Join the club
    </h2>

    <form className="flex flex-col gap-6 w-full p-10">
      <input className="border-2 rounded p-3 w-full" placeholder="Name" />
      <input className="border-2 rounded p-3 w-full" placeholder="Email" />
      <input className="border-2 rounded p-3 w-full" placeholder="Repeat Email" />
     <div className="flex gap-2 w-[105%]"> 
        <input  type={isVisible? "text" : "password"} className="border-2 rounded p-3 w-full" placeholder="Password" /> 
        {isVisible? <FaEyeSlash className="text-3xl item-center pt-4" onClick={()=>setIsVisible(false)}/> : <FaEye  className="text-3xl item-center pt-4" onClick={()=>setIsVisible(true)}/>}

     </div> 
      <div className="flex gap-2 w-[105%]"> 
        <input  type={isVisible? "text" : "password"}  className="border-2 rounded p-3 w-full" placeholder="Password" /> 
        {isVisible? <FaEyeSlash className="text-3xl item-center pt-4" onClick={()=>setIsVisible(false)}/> : <FaEye  className="text-3xl item-center pt-4" onClick={()=>setIsVisible(true)}/>}

     </div> 


      <label className="text-left font-sans text-lg">Birthday:</label>
      <input className="border-2 rounded p-3 w-full" type="date" />

      <input
        className="rounded-full p-3 bg-black text-white w-full mt-4 hover:bg-pink-500"
        type="submit"
        value="Create Account"
      />
    </form>
  </div>
</div>

        )
    }
    else {
        return(
        
        <div className="flex h-[100dvh]">
  <img
    src="/Media/Images/Authentication/login-photo.jpg"
    alt="Home Page Fashion Image"
    className="w-1/2 h-full object-cover aspect-[4/5]"
  />

  <div className="w-1/2 p-12 flex flex-col text-center justify-center">
    <h1 className="font-edwardian text-8xl tracking-wide">
      Truce
    </h1>

    <h2 className="font-sans text-2xl tracking-wide mb-8">
     Welcome Back
    </h2>

    <form className="flex flex-col gap-6 w-full p-10 items-center">
      
      <input className="border-2 rounded p-3 w-full" placeholder="Email" />
     
     <div className="flex gap-2 w-full"> 
        <input  type={isVisible? "text" : "password"} className=" w-full border-2 rounded p-3 w-full" placeholder="Password" /> 
        {isVisible? <FaEyeSlash className="text-3xl item-center  pt-4" onClick={()=>setIsVisible(false)}/> : <FaEye  className="text-3xl item-center pt-4" onClick={()=>setIsVisible(true)}/>}

     </div> 
      


      

      <input
        className="rounded-full p-3 bg-black text-white w-1/2 mt-4 hover:bg-pink-500 "
        type="submit"
        value="Log In"
      />
    </form>
  </div>
</div>



        )
        
    }

}