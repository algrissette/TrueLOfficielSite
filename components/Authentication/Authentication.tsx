'use client';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";
import axios from "axios";

// Axios instance for localhost backend
const api = axios.create({
  baseURL: "http://localhost:4000", // your backend URL
  withCredentials: true, // send/receive cookies
});

const signIn = async (firstName: string, lastName: string, email: string, password: string, dob: Date, sud: Date ) =>{

  try{

    const data = { firstName, lastName, email, password, dob, sud}

    const response= await api.post("users/create", data)
    return response.data;

  }
  catch(error){
    console.log(error)
    throw error;

  }
  

}

export default function Authentication({ signUp }: { signUp: boolean }) {
  const [isVisible, setIsVisible] = useState(false);
  const [errorNotice, setErrorNotice] = useState("");

  // Eye toggle handler for passwords
  const toggleVisibility = () => setIsVisible(prev => !prev);

  // Common image class for both login/signup
  const imageClass = "w-1/2 h-full object-cover aspect-[4/5]";

 const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();

  const form = event.target as HTMLFormElement;
  const fullName = form.username.value; // e.g., "John Doe"
  const email = form.email.value;
  const email2 = form.email2.value;
  const password = form.password.value;
  const password2 = form.password2.value;
  const dob = form.dob.value;
const today = new Date();
const sud = today.toISOString().split("T")[0];
  // Basic validations
  const fullNameRegex = /^[A-Za-z]+ [A-Za-z]+$/;
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!fullNameRegex.test(fullName)) return setErrorNotice("Name must include first and last");
  if (!passwordRegex.test(password)) return setErrorNotice("Password must have 8 characters, 1 capital, and one number");
  if (!emailRegex.test(email)) return setErrorNotice("Email is invalid");
  if (email !== email2) return setErrorNotice("Emails do not match");
  if (password !== password2) return setErrorNotice("Passwords do not match");
  if (!isOver18(dob)) return setErrorNotice("You must be over 18");

  // Split first and last name
  const [firstName, lastName] = fullName.split(" ");

  try {
    const response = await axios.post("http://localhost:4000/users/create", {
      firstName,
      lastName,
      email,
      password,
      dob,
      sud,
    });

    console.log("User created:", response.data);
  } catch (error: any) {
    console.error("Error creating user:", error.response?.data || error.message);
    setErrorNotice("Failed to create account. Please try again.");
  }
};

function isOver18(dobString: string): boolean {
  const today = new Date();
  const dob = new Date(dobString); // from the date picker input
  const ageDiff = today.getFullYear() - dob.getFullYear();

  // Check if birthday has occurred this year
  const monthDiff = today.getMonth() - dob.getMonth();
  const dayDiff = today.getDate() - dob.getDate();

  if (ageDiff > 18) return true;
  if (ageDiff === 18) {
    // If month is after birthday month, or same month but day passed
    if (monthDiff > 0 || (monthDiff === 0 && dayDiff >= 0)) return true;
  }
  return false;
}



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

          <form onSubmit={handleSignUp} className="flex flex-col gap-6 w-full p-8">
            <input name= "username" className="border-2 rounded p-3 w-full focus:ring-2 focus:ring-pink-400 transition" placeholder="Name" />
            <input name= "email"  className="border-2 rounded p-3 w-full focus:ring-2 focus:ring-pink-400 transition" placeholder="Email" />
            <input name= "email2"  className="border-2 rounded p-3 w-full focus:ring-2 focus:ring-pink-400 transition" placeholder="Repeat Email" />

            {/* Password field with toggle */}
            <div className="flex gap-2 w-full relative items-center">
              <input name="password"
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

              <div className="flex gap-2 w-full relative items-center">
              <input  name= "password2"
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
            <input name="dob" className="border-2 rounded p-3 w-full focus:ring-2 focus:ring-pink-400 transition" type="date" />

            <input
              type="submit"
              value="Create Account"
              className="cursor-pointer rounded-full p-3 bg-black text-white w-full mt-4 hover:bg-pink-500 transition-colors duration-300"
            />
          </form>
          <p> {errorNotice}</p>
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
