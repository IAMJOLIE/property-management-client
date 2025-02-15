import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const FavoritPage = () => {
    const [favoriteProperties, setFavoriteProperties] = useState([]);
    const nav = useNavigate();
    const token = localStorage.getItem("token"); // Hämta token

    useEffect(() => {
        const fetchFavorites = async () => {
            
            console.log("🔍 API_URL:", import.meta.env.VITE_API_URL);
            try {
                console.log("🔹 Hämtar favoriter från backend...");
        
      
                const response = await fetch(`${API_URL}/api/favorites`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                

                if (!response.ok) {
                    throw new Error(`Server error: ${response.status}`);
                }
        
                const favoriteProperties = await response.json();
                console.log(" Favorit-objekt från backend:", favoriteProperties); 
        
                if (!Array.isArray(favoriteProperties) || favoriteProperties.length === 0) {
                    console.log(" Inga favoriter hittades.");
                    setFavoriteProperties([]);
                    return;
                }
        
                
                const favoriteIds = favoriteProperties.map(property => property._id);
        
                console.log(" Skickar följande propertyIds till backend:", favoriteIds);
        
                const propertiesResponse = await fetch(`${API_URL}/api/favorites/properties`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ propertyIds: favoriteIds }), 
                });
        
                if (!propertiesResponse.ok) {
                    throw new Error(`Server error: ${propertiesResponse.status}`);
                }
        
                const propertiesData = await propertiesResponse.json();
                console.log(" Favorit-properties:", propertiesData); 
        
                setFavoriteProperties(propertiesData);
            } catch (error) {
                console.error(" Fel vid hämtning av favoriter:", error);
            }
        };
        
        
       
        
        

        fetchFavorites();
    }, [token]);

    const handleNavigate = (id) => {
        const role = localStorage.getItem("role")
        const path = role === "owner" ? `/owner/property/${id}` : `/tenant/property/${id}`;
        nav(path);
    };

    return (
        <div className="">
            <h2 className="text-3xl font-bold mb-6">My Favorites</h2>
            {favoriteProperties.length === 0 ? (
                <p>Add properties you like</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {favoriteProperties.map((property) => (
                                  <div key={property._id} className="bg-white rounded-lg shadow-lg p-2 hover:shadow-lg transition p-4" onClick={() => handleNavigate(property._id)}>
                                  <img src={property.images[0]?.url || "https://via.placeholder.com/400"} alt={property.name} className="w-full h-48 rounded-lg object-cover" />
                                  <div className="">
                                      <h3 className="text-3xl font-bold text-gray-800 mt-2">{property.name}</h3>
                                      <div className="flex gap-6 text-gray-600 text-sm mt-1 ">
                  <p>{property.rooms} Rooms</p>
                  <p>{property.bathrooms} Bathrooms</p> 
              </div>
                                      <p className="text-gray-800 font-medium mt-2"> <span className="text-gray-600 line-clamp-3">${property.description}</span></p>
                                      
                          
                        
      
                                  </div>
                              </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FavoritPage;

