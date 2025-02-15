import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useRequests } from "../context/RequestContext";

const RentRequestsPage = () => {
    const { requests, cancelRequest, fetchRentRequests, loading } = useRequests(); 
    const nav = useNavigate();


    useEffect(() => {
        fetchRentRequests();
    }, []);

    if (loading) return <p>Loading your rent requests...</p>;

    return (
        <div className="p-6">
            <h2 className="text-3xl font-bold mb-6">My Rent Requests</h2>

            {requests.length === 0 ? (
                <p>No rent requests yet.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {requests.map(({ property, status }) => (
                        <div key={property._id} className="bg-white p-4 rounded-lg shadow-lg">
                            <img 
                                src={property.images?.[0]?.url || "https://via.placeholder.com/400"} 
                                alt={property.name || "Property Image"} 
                                className="w-full h-48 rounded-lg object-cover"
                            />
                            <h3 className="text-xl font-semibold mt-3">{property.name}</h3>
                            <p className="text-gray-700">Price: ${property.price}</p>
                            <p className="text-gray-700">
                                Status: 
                                <span className={`font-bold ${
                                    status === "Pending" ? "text-yellow-500" : 
                                    status === "Approved" ? "text-green-500" : 
                                    "text-red-500"
                                }`}>
                                    {status}
                                </span>
                            </p>

                            <div className="mt-4 flex gap-4">
                                <button
                                    onClick={() => nav(`/tenant/property/${property._id}`)}
                                    className="px-4 py-2 bg-[#1F2937] hover:bg-[#374151] text-white rounded-lg"
                                >
                                    View Property
                                </button>
                                <button
                                    onClick={() => cancelRequest(property._id)} 
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg"
                                >
                                    Cancel Request
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RentRequestsPage;


