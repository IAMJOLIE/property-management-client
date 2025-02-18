
import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
const API_URL = import.meta.env.VITE_API_URL;


const PropertyList = () => {
    const [properties, setProperties] = useState([])
    const [loading, setLoading] = useState(true)
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
                
            } finally {
                setLoading(false);
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
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-1">
            {loading ? (
                // Skeleton Loader
                [...Array(6)].map((_, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-md p-2">
                        <Skeleton height={160} className="rounded-lg" />
                        <Skeleton height={25} width="80%" className="mt-3" />
                        <div className="flex gap-6 text-gray-600 text-sm mt-1">
                            <Skeleton height={15} width="30%" />
                            <Skeleton height={15} width="30%" />
                        </div>
                        <Skeleton height={50} className="mt-2" />
                    </div>
                ))
            ) : properties.length > 0 ? (
                properties.map((property) => (
                    <div key={property._id || property.id} className="bg-white rounded-lg shadow-md p-2 hover:shadow-lg transition" onClick={() => handleNavigate(property._id)}>
                        <img className="w-full h-40 rounded-lg object-cover" src={property.images.length > 0 ? property.images[0].url : "https://via.placeholder.com/300"} alt={property.name} />
                        <h3 className="text-3xl font-bold text-gray-800 mt-3">{property.name}</h3>
                        <div className="flex gap-6 text-gray-600 text-sm mt-1">
                            <p>{property.rooms} Rooms</p>
                            <p>{property.bathrooms} Bathrooms</p>
                        </div>
                        <p className="text-gray-600 mt-2 line-clamp-3">{property.description}</p>
                    </div>
                ))
            ) : (
                <p className="text-gray-600 text-lg">Add Properties for listing</p>
            )}
        </div>
    </div>
     );
}
 
export default PropertyList;


