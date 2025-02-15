import {  useNavigate, useLocation } from "react-router-dom";
import { FaHome,  FaUsers, FaCog, FaSignOutAlt, FaUserCircle, FaClipboardList } from "react-icons/fa";
import { MdOutlineFavorite } from "react-icons/md";

import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

const TenDash = () => {
    const location = useLocation()
    const navigate = useNavigate();
    const [ownerName, setOwnerName] = useState("");
    const [unreadResponses, setUnreadResponses] = useState(0);
    const [tenantId, setTenantId] = useState(null);

    useEffect(() => {
        const storedName = localStorage.getItem("ownerName");
        console.log(" Hämtat namn från localStorage:", storedName);
    
        if (storedName) {
            setOwnerName(storedName);
        } else {
            setOwnerName("Unknown Owner"); 
        }
    }, []);

    useEffect(() => {
     
        const storedTenantId = localStorage.getItem("userId"); 
        if (storedTenantId) {
            setTenantId(storedTenantId);
        }
    }, []);

    useEffect(() => {
        if (!tenantId) return;

        const fetchUnreadResponses = async () => {
            try {
                console.log(` Hämtar olästa svar för tenantId: ${tenantId}`);

                const response = await fetch(`${API_URL}/api/rent/unread-responses/${tenantId}`);
                const data = await response.json();

                console.log("📩 Response från servern:", data);

                setUnreadResponses(data.unreadResponses);
            } catch (error) {
                console.error(" Error fetching unread responses:", error);
            }
        };

        fetchUnreadResponses();

       
       
    }, [tenantId]);


    useEffect(() => {
        if (location.pathname === "/tenant/my-request") {
            console.log(" Tenant öppnade 'My Requests', nollställer unreadResponses.");
            setUnreadResponses(0);
            localStorage.setItem("unreadResponses", "0"); 
            
        }
    }, [location.pathname]);



    return ( 
        <div className="flex  bg-gray-100">
           
        <aside className="w-55   bg-[#1F2937] text-white flex flex-col p-3 shadow-xl">
            
         
            <div className="flex items-center gap-4 border-b border-gray-700 pb-6 mb-6 py-3 px-5">
                <FaUserCircle className="text-4xl text-gray-300 " />
                <div  >
                    <h2 className="text-lg font-semibold ">{ownerName}</h2>
                    <p className="text-sm text-gray-400">Tenant</p>
                </div>
            </div>

            <nav className="space-y-6">
                <button 
                    onClick={() => navigate("properties")}
                    className="flex items-center gap-4 px-5 py-3 w-full text-left text-lg font-medium rounded-lg hover:bg-[#374151] transition-all duration-300"
                >
                    <FaHome /> Properties
                </button>
                
                <button 
                    onClick={() => navigate("favorites")}
                    className="flex items-center gap-4 px-5 py-3 w-full text-left text-lg font-medium rounded-lg hover:bg-[#374151] transition-all duration-300"
                >
                  <MdOutlineFavorite />  Favorites
                </button>

                <button 
                    onClick={() => navigate("my-request")}
                    className="menu-button relative flex items-center gap-4 px-5 py-3 w-full text-left text-lg font-medium rounded-lg hover:bg-[#374151] transition-all duration-300"
                >
                     <FaClipboardList /> My Requests
                     {unreadResponses > 0 && <span className="notification-badge">{unreadResponses}</span>}

                </button>

             

                <button 
                    onClick={() => navigate("account")}
                    className="flex items-center gap-4 px-5 py-3 w-full text-left text-lg font-medium rounded-lg hover:bg-[#374151] transition-all duration-300"
                >
                    <FaCog  /> Account
                </button>
            </nav>

         
            <button 
                onClick={() => navigate("/")}
                className="mt-auto mb-10 flex items-center gap-4 px-5 py-3 w-full text-left text-lg font-medium  rounded-lg hover:bg-[#374151] transition-all duration-300"
            >
                <FaSignOutAlt /> Logout
            </button>
        </aside>

   
        
    </div>
     );
}
 
export default TenDash;

