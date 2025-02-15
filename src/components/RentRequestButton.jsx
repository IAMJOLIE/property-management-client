import { useState, useEffect } from "react";


const API_URL = import.meta.env.VITE_API_URL;

const RentRequestButton = ({ propertyId }) => {
    const [message, setMessage] = useState(""); 
    const [hasRequested, setHasRequested] = useState(false);

    useEffect(() => {
        const checkRentRequestStatus = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;

            try {
                const response = await fetch(`${API_URL}/api/rent/${propertyId}/status`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const data = await response.json();
                if (data.hasRequested) {
                    setHasRequested(true);
                    setMessage("Request Sent");
                }
            } catch (error) {
                console.error(" Error checking rent request status:", error);
            }
        };

        checkRentRequestStatus();
    }, [propertyId]);

    const handleRentRequest = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            setMessage("You need to log in first.");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/rent/${propertyId}/request`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Something went wrong.");
            }

            console.log(" Hyresförfrågan skickad:", data);
            setMessage("Request Sent");
            setHasRequested(true);

        } catch (error) {
            console.error(" Error sending rent request:", error);
            setMessage(error.message);
        }
    };

    const handleCancelRequest = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            setMessage("You need to log in first.");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/rent/${propertyId}/cancel`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Something went wrong.");
            }

            console.log(" Hyresförfrågan borttagen:", data);
            setMessage("Request Canceled");
            setHasRequested(false);

        } catch (error) {
            console.error(" Error canceling rent request:", error);
            setMessage(error.message);
        }
    };

    return (
        <div>
        {!hasRequested ? (
            <button
                onClick={handleRentRequest}
                className="bg-green-500 text-white px-4 py-4 rounded-lg"
            >
                Rent Now
            </button>
        ) : (
            <div className="flex flex-col items-center">
                
                <button
                    onClick={handleCancelRequest}
                    className="bg-red-500 text-white px-4 py-4 rounded-lg"
                    disabled={!hasRequested} 
                >
                    Cancel Request
                </button>
            </div>
        )}
    </div>
    );
};

export default RentRequestButton;
