
import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";


const API_URL = import.meta.env.VITE_API_URL;


const PropertyList = () => {
    const [properties, setProperties] = useState([])
    const nav = useNavigate();
   
    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const response = await fetch(`${API_URL}/api/properties`);
                if (!response.ok) {
                    throw new Error("Failed to fetch properties");
                }
                const data = await response.json();
                console.log(" Hämtade fastigheter:", data);
                setProperties(data);
            } catch (error) {
                console.error(" Error fetching properties:", error.message);
            }
        };

        fetchProperties();
    }, []);

    


    const handleNavigate = (id) => {
        const role = localStorage.getItem("role")
        const path = role === "owner" ? `/owner/property/${id}` : `/tenant/property/${id}`;
        nav(path);
    };
    return ( 
        <div>
            
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-6 p-1 ">
                {properties.length > 0 ? (

properties.map((property)=> (
    <div key={property._id || property.id} className="bg-white rounded-lg shadow-md p-2 hover:shadow-lg transition" onClick={() => handleNavigate(property._id)}>
        <img className="w-full h-40 rounded-lg object-cover" src={property.images.length > 0 ? property.images[0].url : "https://via.placeholder.com/300"} alt={property.name}/>
        <h3 className="text-3xl font-bold text-gray-800 mt-3">{property.name}</h3>
        <div className="flex gap-6 text-gray-600 text-sm mt-1 ">
        <p>{property.rooms} Rooms</p>
            <p>{property.bathrooms} Bathrooms </p>
            
        </div>
        <p className="text-gray-600 mt-2 line-clamp-3">{property.description}</p>
 
      </div>  
    
))


                ): (
                    <p>Add Properties for lansing</p>
                )}
               
            </div>
        </div>
     );
}
 
export default PropertyList;


