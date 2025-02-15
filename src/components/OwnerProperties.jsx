import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa"

const API_URL = import.meta.env.VITE_API_URL;

const OwnerProperties = () => {
   const [showModal, setShowModal] = useState(false)
   const [selectedProperty, setSelectedProperty] = useState(null);

    const [properties, setProperties] = useState([]);
    const navigate = useNavigate();


    const ownerId = localStorage.getItem("userId");

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const response = await fetch(`${API_URL}/api/owner-properties/${ownerId}`);
                if (!response.ok) {
                    throw new Error("Misslyckades med att hämta fastigheter");
                }
                const data = await response.json();
                setProperties(data);
            } catch (error) {
                console.error(" Fel vid hämtning av fastigheter:", error.message);
            }
        };

        if (ownerId) {
            fetchProperties();
        }
    }, [ownerId]);

   


    const handleNavigate = (id) => {
        navigate(`/owner/ownerdetails/${id}`);
    };
    
  
    return (
        <div className="p-6" >
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">My Properties</h2>
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4">
                {properties.length > 0 ? (
                    properties.map((property) => (
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
                    ))
                ) : (
                    <p className="text-gray-600">No properties found.</p>
                )}
            </div>
                    
            
        </div>
    );
};

export default OwnerProperties;
