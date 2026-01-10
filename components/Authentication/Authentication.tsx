'use client';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";

export default function Authentication({ signUp }: { signUp: boolean }) {
  const [isVisible, setIsVisible] = useState(false);

  // Eye toggle handler for passwords
  const toggleVisibility = () => setIsVisible(prev => !prev);

  // Common image class for both login/signup
  const imageClass = "w-1/2 h-full object-cover aspect-[4/5]";

  if (signUp) {
    return (
      <div className="flex h-[100dvh]">
        <img
          src="/Media/Images/Authentication/login-photo.jpg"
          alt="Fashion Auth Image"
          className={imageClass}
        />

        <div className="w-1/2 p-12 flex flex-col justify-center text-center">
          <h1 className="font-edwardian text-8xl tracking-wide mb-4">
            Truce
          </h1>
          <h2 className="font-sans text-2xl tracking-wide mb-8">
            Join the club
          </h2>

          <form className="flex flex-col gap-6 w-full p-8">
            <input className="border-2 rounded p-3 w-full focus:ring-2 focus:ring-pink-400 transition" placeholder="Name" />
            <input className="border-2 rounded p-3 w-full focus:ring-2 focus:ring-pink-400 transition" placeholder="Email" />
            <input className="border-2 rounded p-3 w-full focus:ring-2 focus:ring-pink-400 transition" placeholder="Repeat Email" />

            {/* Password field with toggle */}
            <div className="flex gap-2 w-full relative items-center">
              <input
                type={isVisible ? "text" : "password"}
                className="border-2 rounded p-3 w-full focus:ring-2 focus:ring-pink-400 transition"
                placeholder="Password"
              />
              <div
                className="absolute right-3 cursor-pointer text-2xl text-gray-600 hover:text-pink-500 transition"
                onClick={toggleVisibility}
              >
                {isVisible ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>

            <label className="text-left font-sans text-lg mt-2">Date of Birth:</label>
            <input className="border-2 rounded p-3 w-full focus:ring-2 focus:ring-pink-400 transition" type="date" />

            <input
              type="submit"
              value="Create Account"
              className="cursor-pointer rounded-full p-3 bg-black text-white w-full mt-4 hover:bg-pink-500 transition-colors duration-300"
            />
          </form>
           <p className="text-sm text-gray-500 mt-4">
            Have an account? <a href="/Authentication/Login" className="underline hover:text-pink-500 transition">Skip the line</a>
          </p>
        </div>
      </div>
    );
  }

  // Login form
  return (
    <div className="flex-col">
      

      <div className="flex h-[100dvh]">
        <img
          src="/Media/Images/Authentication/login-photo.jpg"
          alt="Fashion Auth Image"
          className={imageClass}
        />

        <div className="w-1/2 p-12 flex flex-col justify-center text-center">
          <h1 className="font-edwardian text-8xl tracking-wide mb-4">
            Truce
          </h1>
          <h2 className="font-sans text-2xl tracking-wide mb-8">
            Welcome Back
          </h2>

          <form className="flex flex-col gap-6 w-full p-8">
            <input className="border-2 rounded p-3 w-full focus:ring-2 focus:ring-pink-400 transition" placeholder="Email" />

            {/* Password field with toggle */}
            <div className="flex gap-2 w-full relative items-center">
              <input
                type={isVisible ? "text" : "password"}
                className="border-2 rounded p-3 w-full focus:ring-2 focus:ring-pink-400 transition"
                placeholder="Password"
              />
              <div
                className="absolute right-3 cursor-pointer text-2xl text-gray-600 hover:text-pink-500 transition"
                onClick={toggleVisibility}
              >
                {isVisible ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>

            <input
              type="submit"
              value="Log In"
              className=" cursor-pointer rounded-full p-3 bg-black text-white w-full mt-4 hover:bg-pink-500 transition-colors duration-300"
            />
          </form>

          <p className="text-sm text-gray-500 mt-4">
            Don't have an account? <a href="/Authentication/SignUp" className="underline hover:text-pink-500 transition">Sign Up</a>
          </p>
          <p className="text-sm text-gray-500">
            Forgot Password? <a href="/Authentication/SignUp" className="underline hover:text-pink-500 transition">Let's Find It</a>
          </p>
        </div>
        
      </div>
    
    
      </div>
  );
}
