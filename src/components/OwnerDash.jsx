import {  useNavigate } from "react-router-dom";
import { FaUserCircle, FaHome, FaPlus, FaUsers, FaCog, FaSignOutAlt, FaBuilding, FaClipboardList } from "react-icons/fa";
import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

const OwnerDash = () => {
    const navigate = useNavigate();
    const [ownerName, setOwnerName] = useState("");
    const [unreadRequests, setUnreadRequests] = useState(0);
    const [ownerId, setOwnerId] = useState(null);
    

    useEffect(() => {
       
        const storedOwnerId = localStorage.getItem("ownerId");
        if (storedOwnerId) {
            setOwnerId(storedOwnerId);
        }
    }, []);

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
        const storedUserId = localStorage.getItem("userId"); 
        if (storedUserId) {
            console.log(` userId hittades: ${storedUserId}`);
            setOwnerId(storedUserId); 
        } else {
            console.warn("⚠️ userId är null i localStorage! Kontrollera att det sparas vid inloggning.");
        }
    }, []);
    
    useEffect(() => {
        if (!ownerId) {
            console.warn("⚠️ ownerId är null, hämtar inga requests");
            return; 
        }
    
        const fetchUnreadRequests = async () => {
            try {
                console.log(`📢 Hämtar olästa requests för ownerId: ${ownerId}`);
    
                const response = await fetch(`${API_URL}/api/rent/unread-requests/${ownerId}`);;
                const data = await response.json();
                setUnreadRequests(data.unreadRequests);
    
               
    
                setUnreadRequests(data.unreadRequests);
            } catch (error) {
                console.error(" Error fetching unread requests:", error);
            }
        };
    
        fetchUnreadRequests();
    
        const interval = setInterval(fetchUnreadRequests, 9977);
        return () => clearInterval(interval);
    }, [ownerId, unreadRequests]); 
    
    
    

    return (
        <div className="flex   bg-gray-100">
           
            <aside className="w-55   bg-[#1F2937] text-white flex flex-col p-3 shadow-xl">
                
             
                <div className="flex items-center gap-4 border-b border-gray-700 pb-6 mb-6 py-3 px-5">
                    <FaUserCircle className="text-4xl text-gray-300 " />
                    <div  >
                        <h2 className="text-lg font-semibold ">{ownerName}</h2>
                        <p className="text-sm text-gray-400">Owner</p>
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
                        onClick={() => navigate("add-property")}
                        className="flex items-center gap-4 px-5 py-3 w-full text-left text-lg font-medium rounded-lg hover:bg-[#374151] transition-all duration-300"
                    >
                        <FaPlus  /> Add Property
                    </button>

                    <button 
                        onClick={() => navigate("my-properties")}
                        className="flex items-center gap-4 px-5 py-3 w-full text-left text-lg font-medium rounded-lg hover:bg-[#374151] transition-all duration-300"
                    >
                        <FaBuilding /> My Properties
                    </button>

                    <button onClick={() => navigate("requests-page")} className="menu-button relative flex items-center gap-4 px-5 py-3 w-full text-left text-lg font-medium rounded-lg hover:bg-[#374151] transition-all duration-300">
                    <FaClipboardList /> Requests
    {unreadRequests > 0 && (
        <span className="notification-badge">{unreadRequests}</span>
    )}
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
};

export default OwnerDash;

