import { useState, useEffect } from "react";


const API_URL = import.meta.env.VITE_API_URL;

const FavoriteButton = ({ propertyId, onFavoriteChange }) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const token = localStorage.getItem("token");

    useEffect(() => {
        const checkFavoriteStatus = async () => {
            try {
                const response = await fetch(`${API_URL}/api/favorites`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!response.ok) {
                    throw new Error(`Server error: ${response.status}`);
                }

                const data = await response.json();
                console.log("🔹 API response för favoriter:", data); 

              
                setIsFavorite(data.some((fav) => fav._id === propertyId));
            } catch (error) {
                console.error(" Error checking favorites:", error);
            }
        };

        checkFavoriteStatus();
    }, [propertyId, token]);

    const toggleFavorite = async () => {
        try {
            console.log("🔹 Skickar request till API: /api/properties/:propertyId/favorite med ID:", propertyId); 
    
            const response = await fetch(`${API_URL}/api/favorites/${propertyId}/favorite`, { // 🔥 Uppdaterad URL!
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
    
            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }
    
            const data = await response.json();
            console.log(" API response efter toggle:", data);
    
            setIsFavorite(!isFavorite);
        } catch (error) {
            console.error(" Error toggling favorite:", error);
        }
    };
    
    

    return (
        <button onClick={toggleFavorite} className="text-3xl absolute top-4 right-4 cursor-pointer">
            {isFavorite ? "❤️" : "🤍"}
        </button>
    );
};

export default FavoriteButton;

