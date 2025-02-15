import { createContext, useContext, useState, useEffect } from "react";


const API_URL = import.meta.env.VITE_API_URL;
const RequestContext = createContext();

export const RequestProvider = ({ children }) => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);


    const fetchRentRequests = async () => {
        try {
            const response = await fetch(`${API_URL}/api/rent/my-requests`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch rent requests: ${response.status}`);
            }

            const data = await response.json();
            console.log(" Rent Requests Data:", data);
            setRequests(data);
        } catch (error) {
            console.error(" Error fetching rent requests:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRentRequests();
    }, []);

  
    const updateRequests = (propertyId, newStatus) => {
        setRequests(prevRequests =>
            prevRequests.map(request =>
                request.property._id === propertyId
                    ? { ...request, status: newStatus }
                    : request
            )
        );
    };


    const cancelRequest = async (propertyId) => {
        try {
            const response = await fetch(`${API_URL}/api/rent/${propertyId}/cancel`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to cancel rent request");
            }

            setRequests(prevRequests => prevRequests.filter(req => req.property._id !== propertyId));
        } catch (error) {
            console.error(" Error canceling request:", error);
        }
    };

    return (
        <RequestContext.Provider value={{ 
            requests, 
            setRequests, 
            fetchRentRequests,  
            updateRequests,  
            loading 
        }}>
            {children}
        </RequestContext.Provider>
    );
};

export const useRequests = () => useContext(RequestContext);
export default RequestContext;





