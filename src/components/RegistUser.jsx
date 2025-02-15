import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AiFillCaretDown } from "react-icons/ai";

import { yupResolver } from "@hookform/resolvers/yup";


const API_URL = import.meta.env.VITE_API_URL;

const RegistUser = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const nav = useNavigate();

    const schema = yup.object().shape({
        firstName: yup.string().required("First name is required"),
        lastName: yup.string().required("Last name is required"),
        email: yup.string().email("Invalid email format").required("Email is required"),
        password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
        confirmPassword: yup
            .string()
            .oneOf([yup.ref("password"), null], "Passwords must match")
            .required("Confirm password is required"),
        role: yup
            .string()
            .oneOf(["owner", "tenant"], "Invalid role")
            .required("Role is required"),
    });

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: { role: "tenant" } 
    });

    const onSubmit = async (data) => {
        try {
            console.log(" Skickar registreringsdata:", data);
            const response = await axios.post(`${API_URL}/api/auth/register`, data);

            console.log(" Server svarade:", response.data);
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("role", response.data.role);

     
            if (response.data.role === "owner") {
                nav("/owner");
            } else {
                nav("/tenant");
            }
        } catch (error) {
            console.error(" Registrering misslyckades:", error.response?.data || error.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-9">
            <div className="bg-white shadow-lg rounded-lg px-20 py-9 w-150">
                <h2 className="text-l text-gray-600 font-medium text-center">Welcome To</h2>
                <h1 className="text-xl font-semibold text-center mt-3">Tenant Management System</h1>
                <h2 className="text-l text-gray-600 font-medium text-center mt-3">Enter your information below to continue</h2>

                <form onSubmit={handleSubmit(onSubmit)}>
            
                    <div className="mt-9 relative">
                        <label className="text-l font-medium text-gray-400">Role</label>
                        <select
                            {...register("role")}
                            className="w-full appearance-none bg-gray-100 border border-gray-100 rounded-lg focus:ring-0 focus:outline-none text-sm p-3 pr-10 mt-2"
                        >
                            <option value="owner">Own Property</option>
                            <option value="tenant">Rental</option>
                        </select>
                        <div className="absolute right-6 bottom-4 text-gray-500">
                            <AiFillCaretDown />
                        </div>
                        {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}
                    </div>

        
                    <div className="mt-5">
                        <label className="block text-l font-medium text-gray-400">Email</label>
                        <input
                            type="email"
                            {...register("email")}
                            placeholder="you@gmail.com"
                            className="bg-gray-100 p-3 w-full rounded-lg focus:outline-none focus:ring-gray-100 mt-2 border-gray-100"
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                    </div>

                
                    <div className="mt-5 flex gap-5">
                        <div className="w-1/2">
                            <label className="text-l font-medium text-gray-400">First Name</label>
                            <input
                                type="text"
                                {...register("firstName")}
                                className="w-full bg-gray-100 rounded-lg focus:outline-none focus:ring-gray-100 mt-2 border-gray-100 p-3"
                            />
                            {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
                        </div>
                        <div className="w-1/2">
                            <label className="text-l font-medium text-gray-400">Last Name</label>
                            <input
                                type="text"
                                {...register("lastName")}
                                className="w-full bg-gray-100 rounded-lg focus:outline-none focus:ring-gray-100 mt-2 border-gray-100 p-3"
                            />
                            {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
                        </div>
                    </div>


                    <div className="mt-5 flex gap-5">
                        <div className="relative">
                            <label className="text-l font-medium text-gray-400">Create Password</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                {...register("password")}
                                placeholder="*****"
                                className="w-full bg-gray-100 rounded-lg focus:outline-none focus:ring-gray-100 mt-2 border-gray-100 p-3"
                            />
                            <button
                                type="button"
                                className="absolute right-6 top-12 text-gray-500"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {!showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                        </div>
                        <div className="relative">
                            <label className="text-l font-medium text-gray-400">Confirm Password</label>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                {...register("confirmPassword")}
                                placeholder="*****"
                                className="w-full bg-gray-100 rounded-lg focus:outline-none focus:ring-gray-100 mt-2 border-gray-100 p-3"
                            />
                            <button
                                type="button"
                                className="absolute right-6 top-12 text-gray-500"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {!showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
                        </div>
                    </div>


                    <button type="submit" className="w-full bg-[#1F2937] hover:bg-[#374151] p-4 rounded-lg my-4 text-white mt-8">
                        Create Account
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RegistUser;
