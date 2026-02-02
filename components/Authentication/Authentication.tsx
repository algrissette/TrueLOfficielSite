'use client';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast, { Toaster } from 'react-hot-toast';

// Axios instance for localhost backend
const api = axios.create({
  baseURL: "http://localhost:4000", // your backend URL
  withCredentials: true, // send/receive cookies
});

export default function Authentication({ signUp }: { signUp: boolean }) {
  const [isVisible, setIsVisible] = useState(false);
  const [errorNotice, setErrorNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Eye toggle handler for passwords
  const toggleVisibility = () => setIsVisible(prev => !prev);

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setErrorNotice("");

    const form = event.target as HTMLFormElement;
    const email = form.email.value;
    const password = form.password.value;

    // Client-side validation
    if (!email || !password) {
      setErrorNotice("Please fill in all fields");
      toast.error("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/users/signIn", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error signing in user:", errorData);
        setErrorNotice(errorData.message || "Invalid email or password");
        toast.error("Login failed. Please check your credentials.");
        setLoading(false);
        return;
      }

      const data = await response.json();
      console.log("User signed In:", data);

      toast.success("Welcome back! Logging you in...");

      // Redirect after short delay
      setTimeout(() => {
        router.push("/Home");
      }, 1500);

    } catch (error: any) {
      console.error("Error signing in user:", error.message);
      setErrorNotice("Failed to sign in. Please try again.");
      toast.error("Connection error. Please try again.");
      setLoading(false);
    }
  };

  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setErrorNotice("");

    const form = event.target as HTMLFormElement;
    const fullName = form.username.value;
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

    if (!fullName || !email || !email2 || !password || !password2 || !dob) {
      setErrorNotice("Please fill in all fields");
      toast.error("Please fill in all fields");
      setLoading(false);
      return;
    }

    if (!fullNameRegex.test(fullName)) {
      setErrorNotice("Name must include both first and last name (e.g., John Doe)");
      toast.error("Please enter your full name");
      setLoading(false);
      return;
    }

    if (!emailRegex.test(email)) {
      setErrorNotice("Please enter a valid email address");
      toast.error("Invalid email format");
      setLoading(false);
      return;
    }

    if (email !== email2) {
      setErrorNotice("Email addresses do not match");
      toast.error("Emails don't match");
      setLoading(false);
      return;
    }

    if (!passwordRegex.test(password)) {
      setErrorNotice("Password must be at least 8 characters with 1 uppercase letter and 1 number");
      toast.error("Password requirements not met");
      setLoading(false);
      return;
    }

    if (password !== password2) {
      setErrorNotice("Passwords do not match");
      toast.error("Passwords don't match");
      setLoading(false);
      return;
    }

    if (!isOver18(dob)) {
      setErrorNotice("You must be at least 18 years old to create an account");
      toast.error("Must be 18 or older");
      setLoading(false);
      return;
    }

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
      toast.success("Account created successfully! Welcome to Trucé");

      // Redirect to login after short delay
      setTimeout(() => {
        router.push("/Authentication/Login");
      }, 2000);

    } catch (error: any) {
      console.error("Error creating user:", error.response?.data || error.message);
      const errorMsg = error.response?.data?.message || "Failed to create account. Please try again.";
      setErrorNotice(errorMsg);
      toast.error(errorMsg);
      setLoading(false);
    }
  };

  function isOver18(dobString: string): boolean {
    const today = new Date();
    const dob = new Date(dobString);
    const ageDiff = today.getFullYear() - dob.getFullYear();

    const monthDiff = today.getMonth() - dob.getMonth();
    const dayDiff = today.getDate() - dob.getDate();

    if (ageDiff > 18) return true;
    if (ageDiff === 18) {
      if (monthDiff > 0 || (monthDiff === 0 && dayDiff >= 0)) return true;
    }
    return false;
  }

  if (signUp) {
    return (
      <>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              style: {
                background: '#10b981',
              },
            },
            error: {
              style: {
                background: '#ef4444',
              },
            },
          }}
        />

        <div className="flex h-[100dvh] bg-gradient-to-br from-slate-50 to-gray-50">
          {/* Left side - Image with overlay */}
          <div className="w-1/2 h-full relative overflow-hidden hidden md:block">
            <img
              src="/Media/Images/Authentication/login-photo.jpg"
              alt="Fashion Auth Image"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent"></div>
            <div className="absolute bottom-12 left-12 text-white">
              <h2 className="text-4xl font-edwardian mb-2">Join the Movement</h2>
              <p className="text-lg opacity-90">Where style meets sophistication</p>
            </div>
          </div>

          {/* Right side - Form */}
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
            <div className="max-w-md mx-auto w-full">
              <h1 className="font-edwardian text-6xl md:text-7xl tracking-wide mb-2 text-center text-gray-900">
                Trucé
              </h1>
              <h2 className="font-sans text-xl md:text-2xl tracking-wide mb-8 text-center text-gray-600">
                Join the club
              </h2>

              {/* Error Notice */}
              {errorNotice && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm text-red-700 font-medium">{errorNotice}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSignUp} className="flex flex-col gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    name="username"
                    className="border-2 border-gray-200 rounded-lg p-3 w-full focus:ring-2 focus:ring-pink-400 focus:border-transparent transition outline-none"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    name="email"
                    type="email"
                    className="border-2 border-gray-200 rounded-lg p-3 w-full focus:ring-2 focus:ring-pink-400 focus:border-transparent transition outline-none"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Email</label>
                  <input
                    name="email2"
                    type="email"
                    className="border-2 border-gray-200 rounded-lg p-3 w-full focus:ring-2 focus:ring-pink-400 focus:border-transparent transition outline-none"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <div className="relative">
                    <input
                      name="password"
                      type={isVisible ? "text" : "password"}
                      className="border-2 border-gray-200 rounded-lg p-3 w-full pr-12 focus:ring-2 focus:ring-pink-400 focus:border-transparent transition outline-none"
                      placeholder="Min. 8 characters, 1 uppercase, 1 number"
                    />
                    <div
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-xl text-gray-400 hover:text-pink-500 transition"
                      onClick={toggleVisibility}
                    >
                      {isVisible ? <FaEyeSlash /> : <FaEye />}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                  <div className="relative">
                    <input
                      name="password2"
                      type={isVisible ? "text" : "password"}
                      className="border-2 border-gray-200 rounded-lg p-3 w-full pr-12 focus:ring-2 focus:ring-pink-400 focus:border-transparent transition outline-none"
                      placeholder="Re-enter your password"
                    />
                    <div
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-xl text-gray-400 hover:text-pink-500 transition"
                      onClick={toggleVisibility}
                    >
                      {isVisible ? <FaEyeSlash /> : <FaEye />}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                  <input
                    name="dob"
                    className="border-2 border-gray-200 rounded-lg p-3 w-full focus:ring-2 focus:ring-pink-400 focus:border-transparent transition outline-none"
                    type="date"
                  />
                  <p className="text-xs text-gray-500 mt-1">You must be 18 or older</p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="cursor-pointer rounded-lg p-4 bg-black text-white w-full mt-4 hover:bg-pink-600 transition-all duration-300 font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </button>
              </form>

              <p className="text-sm text-gray-600 mt-6 text-center">
                Already have an account?{" "}
                <a href="/Authentication/Login" className="text-pink-600 font-medium hover:text-pink-700 transition underline">
                  Sign In
                </a>
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Login form
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            style: {
              background: '#10b981',
            },
          },
          error: {
            style: {
              background: '#ef4444',
            },
          },
        }}
      />

      <div className="flex h-[100dvh] bg-gradient-to-br from-slate-50 to-gray-50">
        {/* Left side - Image with overlay */}
        <div className="w-1/2 h-full relative overflow-hidden hidden md:block">
          <img
            src="/Media/Images/Authentication/login-photo.jpg"
            alt="Fashion Auth Image"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent"></div>
          <div className="absolute bottom-12 left-12 text-white">
            <h2 className="text-4xl font-edwardian mb-2">Welcome Back</h2>
            <p className="text-lg opacity-90">Continue your style journey</p>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <h1 className="font-edwardian text-6xl md:text-7xl tracking-wide mb-2 text-center text-gray-900">
              Trucé
            </h1>
            <h2 className="font-sans text-xl md:text-2xl tracking-wide mb-8 text-center text-gray-600">
              Welcome Back
            </h2>

            {/* Error Notice */}
            {errorNotice && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-red-700 font-medium">{errorNotice}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSignIn} className="flex flex-col gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  name="email"
                  type="email"
                  className="border-2 border-gray-200 rounded-lg p-3 w-full focus:ring-2 focus:ring-pink-400 focus:border-transparent transition outline-none"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <input
                    name="password"
                    type={isVisible ? "text" : "password"}
                    className="border-2 border-gray-200 rounded-lg p-3 w-full pr-12 focus:ring-2 focus:ring-pink-400 focus:border-transparent transition outline-none"
                    placeholder="Enter your password"
                  />
                  <div
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-xl text-gray-400 hover:text-pink-500 transition"
                    onClick={toggleVisibility}
                  >
                    {isVisible ? <FaEyeSlash /> : <FaEye />}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="cursor-pointer rounded-lg p-4 bg-black text-white w-full mt-4 hover:bg-pink-600 transition-all duration-300 font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </form>

            <div className="mt-6 text-center space-y-2">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <a href="/Authentication/SignUp" className="text-pink-600 font-medium hover:text-pink-700 transition underline">
                  Sign Up
                </a>
              </p>
              <p className="text-sm text-gray-600">
                Forgot Password?{" "}
                <a href="/Authentication/ForgotPassword" className="text-pink-600 font-medium hover:text-pink-700 transition underline">
                  Reset It
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}