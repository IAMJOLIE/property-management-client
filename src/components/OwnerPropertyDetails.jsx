import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";


const API_URL = import.meta.env.VITE_API_URL;

const OwnerPropertyDetails = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const [property, setProperty] = useState(null);
    const [showModal, setShowModal] = useState(false)
    const [selectedProperty, setSelectedProperty] = useState(null);
  
    useEffect(() => {
      const fetchPropertyDetails = async () => {
        try {
          const response = await fetch(`${API_URL}/api/properties/${id}`);
          const data = await response.json();
          setProperty(data);
        } catch (error) {
          console.error(" Error fetching property details:", error);
        }
      };
  
      fetchPropertyDetails();
    }, [id]);
  
    const handleDelete = async () => {

   
        try {
          

      const token = localStorage.getItem("token");
            const response = await fetch(`${API_URL}/api/owner-properties/${selectedProperty._id}`, {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
              },
            });
    
            if (!response.ok) {
                throw new Error("Misslyckades med att radera fastighet");
            }
    
            console.log(" Fastighet raderad:", propertyId);
            setShowModal(false);
            setProperty(null);
            setSelectedProperty(null);
            navigate("my-properties");
            
        } catch (error) {
            console.error(" Fel vid radering:", error.message);
        }
    };
  
    if (!property) return <p className="text-center mt-10">Loading property details...</p>;
  

  return (
    <div className="min-h-screen  p-8">
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-3xl font-semibold text-gray-800 mb-4">{property.name}</h2>
      <p className="text-gray-600 break-words  overflow-hidden">{property.description}</p>

      <div className="mt-6 grid grid-cols-2 gap-6">
        <div>
          <p><strong>Type:</strong> {property.type}</p>
          <p><strong>Size:</strong> {property.size} m²</p>
          <p><strong>Rooms:</strong> {property.rooms}</p>
          <p><strong>Bathrooms:</strong> {property.bathrooms}</p>
          <p>
            <strong>Rental Period:</strong> {new Date(property.rentalStartDate).toLocaleDateString("en-US")} - {new Date(property.rentalEndDate).toLocaleDateString("en-US")}
          </p>
        </div>
        <div>
          <p><strong>Country:</strong> {property.country}</p>
          <p><strong>City:</strong> {property.city}, {property.state}</p>
          <p><strong>Zip Code:</strong> {property.zipCode}</p>
          <p><strong>Address:</strong> {property.address}</p>
        </div>
      </div>


      {property.images && property.images.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold">Images</h3>
          <div className="flex gap-4 mt-2">
            {property.images.map((img, index) => (
              <img key={index} src={img.url} alt="Property" className="w-32 h-32 object-cover rounded-lg shadow" />
            ))}
          </div>
        </div>
      )}


      {property.owner && (
        <div className="mt-6 p-4 bg-gray-200 rounded-lg">
          <h3 className="text-xl font-semibold">Owner Information</h3>
          <p><strong>Name:</strong> {property.owner.firstName} {property.owner.lastName}</p>
          <p><strong>Email:</strong> {property.owner.email}</p>
        </div>
      )}


      <div className="mt-6 flex justify-between">
        <button onClick={() => navigate(-1)} className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition">
          ← Back
        </button>
        
        <div className="flex gap-3">
          <button 
            onClick={() => navigate(`/owner/add-property/${id}`)} 
            className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition"
          >
            ✏️ Edit
          </button>
          <button 
            onClick={() => {
                            setSelectedProperty(property);
                            setShowModal(true) 
                        }}
            className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition"
          >
            🗑 Delete
          </button>
        </div>
      </div>
      {showModal && (
                        <div className="fixed inset-0 flex items-center justify-center   backdrop-blur-sm transition-opacity">
                        <div className="bg-white p-6 rounded-lg shadow-lg transform scale-100 transition-transform duration-300">
                            <h3 className="text-lg font-bold mb-3 text-gray-800">Are you sure?</h3>
                            <p className="text-gray-600">Do you want to delete the property <span className="font-semibold">{selectedProperty?.name}</span>?</p>
            
                            <div className="flex gap-4 mt-4">
                                <button
                                    onClick={handleDelete}
                                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all"
                                >
                                    Yes, delet
                                </button>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-all"
                                >
                                    Cancel
                                </button>
              
                            </div>
           
                        </div>
                    </div>
                    )}
    </div>
  </div>
);
};

export default OwnerPropertyDetails;
