import { useEffect, useState } from "react";

import { FaEye, FaEyeSlash, FaHome } from "react-icons/fa";
import axios from "axios";

import { NavLink, useNavigate } from "react-router-dom"



const API_URL = import.meta.env.VITE_API_URL;


const LogIn = () => {
    const [email, setEmail] = useState("");
   
const [showPassword, setShowPassword] = useState(false)
const [formData, setFormData] = useState({ email: "", password: "", role: ""});
const [error, setError] = useState("")
const nav = useNavigate()


    const [rememberMe, setRememberMe] = useState(false); 

    useEffect(() => {
        const savedRememberMe = localStorage.getItem("rememberMe");
        if (savedRememberMe === "true") {
            const savedEmail = localStorage.getItem("savedEmail");
            if (savedEmail) {
                setEmail(savedEmail);
                setRememberMe(true);
            }
        }
    }, []);

const handleChange = (e) => {
    setFormData({... formData, [e.target.name]: e.target.value});
}

const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(" Skickar login-data:", formData);

    try {
        const response = await axios.post(`${API_URL}/api/auth/login`, formData);

        if(response.status !== 200) {
            throw new Error("servern returnerade en statuskod som inte är 200");
        }
        
        console.log(" Inloggning lyckades!", response.data);
        console.log(" Token:", response.data.token);
        console.log(" Användarroll:", response.data.role); 
        console.log(" Auserid:", response.data.userId);
        console.log(" Backend-svar vid inloggning:", response.data);

        if (rememberMe) {
            localStorage.setItem("rememberMe", "true");
            localStorage.setItem("savedEmail", email);
        } else {
            localStorage.removeItem("rememberMe");
            localStorage.removeItem("savedEmail");
        }

        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", response.data.role);
        localStorage.setItem("userId", response.data.userId);
        
        localStorage.setItem("ownerName", response.data.firstName || "Unknown Owner"); 
        
        console.log(" Sparat namn i localStorage:", localStorage.getItem("ownerName"));


        console.log(" Sparad roll i localStorage:", localStorage.getItem("role")); 
       console.log("sparat userId i localstorage", localStorage.getItem("userId"));
       console.log(" Sparat namn:", localStorage.getItem("ownerName"));
        
            if (response.data.role === "owner") {
                console.log(" Skickar till /owner-dashboard");
                nav("/owner/properties"); 
            } else {
                console.log(" Skickar till /tenant-dashboard");
                nav("/tenant/properties");
            }
    
      

    } catch (error) {
        console.log(" Inloggning misslyckades:", error.response?.data?.message || error.message);
        setError(error.response?.data?.message || "något fick fel. försök igen");
    }
};






    return ( 
        <div className="flex items-center justify-center  min-h-screen p-9">
            <div className="bg-white shadow-lg rounded-lg  px-20 py-9 w-150">
                <div className="text-l text-gray-900 font-medium  text-center flex justify-center "><FaHome size={50} /></div>
            
                <h2 className="text-l text-gray-600 font-medium  text-center ">Welcome To</h2>
                <h1 className="text-xl font-semibold text-center mt-3">Tenant Management System</h1>
                <h2 className="text-l text-gray-600 font-medium  text-center mt-3 ">Please login to your account</h2>

              
                <form onSubmit={handleSubmit} autoComplete="on">
                <div className="mt-9">
                    
                <label className="block text-l font-medium text-gray-400">Email</label>
                <input
                 type="email"
                 name="email"
                 value={formData.email}
                 onChange={handleChange}
                 placeholder="you@gamil.com"
                 
                 
    autoComplete="username" 
                className="bg-gray-100 p-3 w-full  rounded-lg focus:outline-none focus:ring-gray-100 mt-2 border-gray-100 focus:border-blue-300    "
                />
                </div>

                <div className="mt-5 relative">
                <label className="block text-l font-medium text-gray-400">Password</label>
                <input
                 type={showPassword ? "text" : "password"}
                 placeholder="*******"
                 name="password"
                 value={formData.password}
                 onChange={handleChange}
                 autoComplete="current-password"
                className="bg-gray-100 p-3 w-full  rounded-lg focus:outline-none focus:ring-gray-100 mt-2 border-gray-100 focus:border-blue-300    "
                />
                  {error && <p className="text-red-500 md-4">{error}</p>}
                <button type="button"
                className="absolute right-6 top-12 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
                >
                    { !showPassword ?  <FaEyeSlash /> : <FaEye/> }
                    
                </button>
                </div>

                <div className="mb-2 flex justify-between items-center text-sm mt-2">
                <label htmlFor="rememberMe" className=" flex justify-center item-center">
                <input
                 type="checkbox"
                 id="rememberMe"
                 checked={rememberMe}
                 onChange={() => setRememberMe (!rememberMe)}
                className=" mt-1 mr-2"
                />
                Remember me
                </label>
                <a href="#" className="text-blue-300  text-sm font-medium hover:text-blue-400 "> Forget Password</a>
                </div>

                <button type="submit" className="w-full  p-3 rounded-lg my-4 text-white bg-[#1F2937] hover:bg-[#374151] ">Log In</button>

      

                <div className=" flex gap-2 items-center justify-center mt-4 ">
                    <p>New member here? </p>
                   
                   
                    <NavLink className="text-blue-300 font-bold hover:text-blue-400" to={"/regist-user"}>
                    Register Now
                    </NavLink>
                  
                  
                   

                    
                </div>
                </form>
              
            </div>
        </div>
     );
}
 
export default LogIn;



