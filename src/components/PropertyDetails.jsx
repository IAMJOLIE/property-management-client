


import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useRequests } from "../context/RequestContext"; 
import FavoriteButton from "./FavoriteButton";

const API_URL = import.meta.env.VITE_API_URL;

const PropertyDetails = () => {
    const { id } = useParams();
    const nav = useNavigate();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);
    const [message, setMessage] = useState("");
    const role = localStorage.getItem("role"); 

    const { requests, setRequests, cancelRequest } = useRequests(); 

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const response = await fetch(`${API_URL}/api/properties/${id}`);
                if (!response.ok) throw new Error("Property not found");

                const data = await response.json();
                setProperty(data);

                if (data.images && data.images.length > 0) {
                    setSelectedImage(data.images[0].url);
                }
            } catch (error) {
                console.error(" Error fetching property:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProperty();
    }, [id]);


    const existingRequest = requests.find(req => req.property._id === id);
    const hasRequested = Boolean(existingRequest);
    const requestStatus = existingRequest ? existingRequest.status : null;

    const handleRentRequest = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            console.error(" Ingen token hittades! Användaren är inte inloggad.");
            setMessage("You need to log in first.");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/rent/${id}/request`, { 
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || `Failed to send rent request: ${response.status}`);
            }

            console.log(" Hyresförfrågan skickad:", data);
            setMessage("Rent request sent successfully!");


            setRequests(prevRequests => [
                ...prevRequests, 
                { property: { _id: id, name: property.name, price: property.price, images: property.images }, status: "Pending" }
            ]);

        } catch (error) {
            console.error(" Error sending rent request:", error);
            setMessage(error.message);
        }
    };

    if (loading) return <p>Loading property details...</p>;

    const visibleThumbnails = property.images ? property.images.slice(0, 3) : [];
    const hasMoreImages = property.images && property.images.length > 3;

    const handleNextHiddenImage = () => {
        if (!property.images || property.images.length === 0) return;
        const currentIndex = property.images.findIndex(img => img.url === selectedImage);
        const nextIndex = currentIndex + 1;
        if (nextIndex < property.images.length) {
            setSelectedImage(property.images[nextIndex].url);
        } else {
            setSelectedImage(property.images[0].url);
        }
    };

    return (
        <div className="max-w-6xl mx-auto h-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 h-full">
               
                <div className="col-span-2">
                    <div className="w-full h-96 rounded-lg shadow-lg">
                        {selectedImage ? (
                            <img src={selectedImage} className="w-full h-full object-cover rounded-lg shadow-lg" alt="Property" />
                        ) : (
                            <p>No image available</p>
                        )}
                    </div>


                    <div className="flex flex-wrap gap-4 sm:justify-start mt-4">
                        {visibleThumbnails.map((img, i) => (
                            <img
                                key={i}
                                src={img.url}
                                alt={`Thumbnail ${i + 1}`}
                                className={`w-24 h-24 object-cover rounded-lg cursor-pointer border-2 ${
                                    selectedImage === img.url ? "border-blue-500" : "border-gray-300"
                                }`}
                                onClick={() => setSelectedImage(img.url)}
                            />
                        ))}
                        {hasMoreImages && (
                            <div
                                className="w-24 h-24 flex items-center justify-center bg-gray-300 rounded-lg cursor-pointer text-gray-800 text-lg font-bold"
                                onClick={handleNextHiddenImage}
                            >
                                +{property.images.length - 3} More
                            </div>
                        )}
                    </div>

               
                    <div className="mt-6 p-6 bg-gray-100 rounded-lg relative">
                        <h3 className="text-xl font-semibold">Property Details</h3>
                        {role === "tenant" && (
    <div className="absolute right-10 top-3 ">
        <FavoriteButton propertyId={id} />
    </div>
)}

                        <p className="text-gray-600 mt-2  break-words max-h-40 overflow-hidden">
{property.description}</p>
                        <ul className="space-y-2 mt-4">
                            <li><strong>Location:</strong> {property.address}, {property.city}, {property.state}, {property.country}</li>
                            <li><strong>Rooms:</strong> {property.rooms}</li>
                            <li><strong>Bathrooms:</strong> {property.bathrooms}</li>
                            <li><strong>Type:</strong> {property.type}</li>
                            {property.rentalStartDate && property.rentalEndDate && (
                                <li><strong>Rental Period:</strong> {property.rentalStartDate.split("T")[0]} - {property.rentalEndDate.split("T")[0]}</li>
                            )}
                        </ul>
                    </div>
                </div>


                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <button
                        onClick={() => nav(-1)}
                        className="px-2 py-2 mb-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
                    >
                        ← Go Back
                    </button>
                    <h3 className="text-3xl font-bold">{property.name}</h3>
                    <p className="text-xl text-gray-700 mt-3">Price: ${property.price}</p>
                    <p className="text-gray-700 mt-3">Size: {property.size} m²</p>

                    {property.owner && (
                        <div className="mt-9 p-2 bg-gray-100 rounded-lg">
                            <h3 className="text-lg font-semibold mt-1">Owner Details</h3>
                            <p className="mt-1 mb-2"><strong>Name:</strong> {property.owner.firstName} {property.owner.lastName}</p>
                            <p className="mt-1 mb-2">
            <strong>Email:</strong> 
            <a href={`mailto:${property.owner.email}`} className="text-blue-500 hover:underline">
                {property.owner.email}
            </a>
        </p>
                        </div>
                    )}


<div className="mt-6 flex items-center space-x-4">
{role === "tenant" && hasRequested ? (
    <>
        {requestStatus === "Pending" && (
            <button 
                onClick={() => cancelRequest(id)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
                Cancel Request
            </button>
        )}
        <p className="text-gray-700 ">
            Status: 
            <span className={`font-bold ${
                requestStatus === "Pending" ? "text-yellow-500" : 
                requestStatus === "Approved" ? "text-green-500" : 
                "text-red-500"
            }`}>
                {requestStatus}
            </span>
        </p>
    </>
) : role === "tenant" && (
    <button 
        onClick={handleRentRequest} 
        className="px-2 py-3 bg-green-500 text-white rounded-lg"
    >
        Request Rent
    </button>
)}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertyDetails;





