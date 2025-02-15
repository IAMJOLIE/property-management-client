import { useState, useEffect } from "react";
import { FaCheckCircle, FaTimesCircle, FaEyeSlash } from "react-icons/fa";


const API_URL = import.meta.env.VITE_API_URL;

const OwnerRequestsPage = () => {
    const token = localStorage.getItem("token");
    const [requests, setRequests] = useState([]);


    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const token = localStorage.getItem("token");
                console.log("🔹 Token skickas:", token);
        
                const response = await fetch(`${API_URL}/api/rent/owner-requests`, {
    headers: { Authorization: `Bearer ${token}` },
});

        
                if (!response.ok) {
                    throw new Error(`Failed to fetch tenant requests: ${response.status}`);
                }

                const data = await response.json();
                setRequests(data);
            } catch (error) {
                console.error(" Error fetching tenant requests:", error);
            }
        };
        

        fetchRequests();
    }, [token]);

    const handleAction = async (propertyId, tenantId, action) => {
        try {
            const response = await fetch(`${API_URL}/api/rent/${propertyId}/${tenantId}/${action}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`, 
                },
            });
    
            if (!response.ok) {
                throw new Error("Failed to update request status");
            }
    
            console.log(" Request updated successfully!");
         
            setRequests((prevRequests) =>
                prevRequests.map((req) =>
                    req.property._id === propertyId && req.tenant._id === tenantId
                        ? { ...req, status: action === "approve" ? "Approved" : "Rejected" }
                        : req
                )
            );
        } catch (error) {
            console.error(" Error updating request status:", error);
        }
    };
    


    
    
    
    
    

    

    return (
        <div className="p-6 ">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Tenant Requests</h2>

            {requests.length === 0 ? (
                <p className="text-gray-600">No tenant requests available.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {requests.map(({ property, tenant, status }) => (
                        <div
                            key={`${property._id}-${tenant._id}`}
                            className={`bg-white p-5 rounded-lg shadow-lg shadow-5xl transition transform hover:scale-105 hover:shadow-xl relative ${
                                status.trim() === "Hidden" ? "hidden" : ""
                            }`}
                        >
                          

                         
                            <img
                                src={property.images?.[0]?.url || "https://via.placeholder.com/400"}
                                alt={property.name}
                                className="w-full h-40 object-cover rounded-md"
                            />

                          
                            <div className="mt-4">
                                <h3 className="text-lg font-semibold text-gray-800">{property.name}</h3>
                                <p className="text-gray-600">Price: <span className="font-bold">${property.price}</span></p>
                            </div>

                         
                            <div className="mt-3 p-3 bg-gray-100 rounded-lg">
                                <p className="text-gray-700"><strong>Tenant:</strong> {tenant.firstName} {tenant.lastName}</p>
                           
                                <p className="mt-1 mb-2 text-gray-700 ">
            <strong >Email:</strong> 
            <a href={`mailto:${tenant.email}`} className="text-blue-500 hover:underline">
                {tenant.email}
            </a>
        </p>
                                <p className="mt-1 text-sm">
                                    <strong>Status:</strong>{" "}
                                    <span className={`font-bold ${
                                        status.trim() === "Pending" ? "text-yellow-500" 
                                            : status.trim() === "Approved" ? "text-green-500" 
                                            : "text-red-500"
                                    }`}>
                                        {status}
                                    </span>
                                </p>
                            </div>

                   
                            <div className="mt-4 flex gap-4">
    {status?.trim().toLowerCase() === "pending" ? ( 
        <>
            <button
                onClick={() => handleAction(property._id, tenant._id, "approve")}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition flex items-center gap-2"
            >
                <FaCheckCircle /> Approve
            </button>
            <button
                onClick={() => handleAction(property._id, tenant._id, "reject")}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition flex items-center gap-2"
            >
                <FaTimesCircle /> Reject
            </button>
        </>
    ) : (
        <p className="text-gray-500 italic">Request {status?.toLowerCase()}</p>
    )}
</div>

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OwnerRequestsPage;





