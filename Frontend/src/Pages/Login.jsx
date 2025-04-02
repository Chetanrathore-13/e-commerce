import React, { useState } from "react";
import { FaGoogle, FaFacebookF, FaTwitter } from "react-icons/fa";

import Loggin2 from '../assets/Media/Login2img.jpg'

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="flex h-[100vh] p-20">
      {/* Left Image Section */}
      <div className="w-1/2 h-full  flex items-center justify-center ">
      <img className="  h-120 w-100 object-cover " src={Loggin2} alt="" />
      </div>
      
      {/* Right Form Section */}
      <div className="w-1/2 flex justify-center items-center p-10 relative">
        <div className="w-full max-w-md">
          <button className="absolute top-4 right-4 text-xl">✖</button>
          <h2 className="text-2xl font-semibold text-center mb-6">{isSignUp ? "Sign Up" : "Sign In"}</h2>
          <form className="space-y-4">
            <div>
              <input type="email" placeholder="E-mail address *" className="w-full p-3 border border-gray-300 rounded" required />
            </div>
            {isSignUp && (
              <>
                <div>
                  <input type="text" placeholder="First name *" className="w-full p-3 border border-gray-300 rounded" required />
                </div>
                <div>
                  <input type="text" placeholder="Last name *" className="w-full p-3 border border-gray-300 rounded" required />
                </div>
              </>
            )}
            <div className="relative">
              <input type="password" placeholder="Password *" className="w-full p-3 border border-gray-300 rounded" required />
            </div>
            {isSignUp && (
              <div className="relative">
                <input type="password" placeholder="Confirm password *" className="w-full p-3 border border-gray-300 rounded" required />
              </div>
            )}
            {!isSignUp && (
              <a href="#" className="text-sm text-gray-500 block text-right">Forgot Password?</a>
            )}
            {isSignUp && (
              <div className="flex items-center">
                <input type="checkbox" id="terms" className="mr-2" required />
                <label htmlFor="terms" className="text-sm">I accept <a href="#" className="text-blue-500">terms and conditions</a> *</label>
              </div>
            )}
            <button type="submit" className="w-full bg-[#b38b58] text-white p-3 rounded font-semibold">
              {isSignUp ? "SIGN UP" : "SIGN IN"}
            </button>
          </form>
          <p className="text-center mt-4 text-sm">
            {isSignUp ? "Already have an account? " : "Don't have an account? "}
            <button onClick={() => setIsSignUp(!isSignUp)} className="text-blue-500">
              {isSignUp ? "Sign in" : "Sign up"}
            </button>
          </p>
          {/* <div className="mt-6 space-y-2">
            <button className="w-full flex items-center justify-center border border-gray-300 p-3 rounded"><FaGoogle className="mr-2" /> Sign Up with Google</button>
            <button className="w-full flex items-center justify-center border border-gray-300 p-3 rounded"><FaFacebookF className="mr-2" /> Sign Up with Facebook</button>
            <button className="w-full flex items-center justify-center border border-gray-300 p-3 rounded"><FaTwitter className="mr-2" /> Sign Up with Twitter</button>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Login;
