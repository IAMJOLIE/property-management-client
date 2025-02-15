import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";


const API_URL = import.meta.env.VITE_API_URL;

const Info = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const location = useLocation();

  console.log(" Mottagen location.state i Info:", location.state);
  

  const propertyData = location.state?.propertyData || {}; 
  console.log("Mottagen fastighetsdata i Info:", propertyData);

  const [details, setDetails] = useState({
    price: "",
    size: "",
    rooms: "",
    bathrooms: "",
    owner: "",
    rentalStartDate: "",
    rentalEndDate: "",
  });


  useEffect(() => {
    if (propertyData) {
      setDetails({
        price: propertyData.price || "",
        size: propertyData.size || "",
        rooms: propertyData.rooms || "",
        bathrooms: propertyData.bathrooms || "",
        owner: propertyData.owner || "",
        rentalStartDate: propertyData.rentalStartDate || "",
        rentalEndDate: propertyData.rentalEndDate || "",
      });
    }
  }, [propertyData]);


  const handleChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const ownerId = localStorage.getItem("userId"); 
    if (!ownerId) {
        console.error(" Ingen ägare inloggad. Kan inte skapa fastighet.");
        return;
    }

    const formattedDetails = {
        ...details,
        price: Number(details.price),
        size: Number(details.size),
        rooms: Number(details.rooms),
        bathrooms: Number(details.bathrooms),
        owner: ownerId, 
        images: propertyData.images?.map(img =>
          typeof img === "string" 
            ? { url: img, public_id: img.split('/').pop().split('.')[0] } 
            : { url: img.url, public_id: img.public_id || img.url.split('/').pop().split('.')[0] }
        ) || []
    };

    const completeProperty = { ...propertyData, ...formattedDetails };

    console.log(" Skickar fastighetsdata till servern:", JSON.stringify(completeProperty, null, 2));

    try {
        let requestUrl, methodType;

        if (id && id !== "undefined") {  

            requestUrl = `${API_URL}/api/properties/${id}`;
            methodType = "PUT";
        } else {
 
            requestUrl = `${API_URL}/api/properties`;
            methodType = "POST";
        }

        const response = await fetch(requestUrl, {
            method: methodType,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(completeProperty),
        });

        console.log(" Full serverrespons:", response);
        const responseText = await response.text();
        console.log(" Serverns svar:", responseText);

        if (!response.ok) {
            throw new Error(`Misslyckades med att spara fastighet: ${responseText}`);
        }

        console.log(" Fastighet sparad!");
        nav("/owner/my-properties");

    } catch (error) {
        console.error(" Fetch error:", error.message);
    }
};




  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-9">
      <div className="flex justify-center mb-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1F2937]  text-white font-bold">1</div>
          <span className="text-gray-600 font-medium">Property Details</span>
          <div className="h-1 w-10 bg-gray-300"></div>
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1F2937]  text-white font-bold">2</div>
          <span className="text-gray-600 font-medium">Additional Info</span>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-3xl">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          {id ? "Edit Property" : "Additional Property Information"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-gray-700 font-medium">Price ($)</label>
              <input
                type="number"
                name="price"
                value={details.price}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-400 focus:outline-none"
                placeholder="Enter Price"
              />
            </div>

            <div>
              <label className="text-gray-700 font-medium">Size (m²)</label>
              <input
                type="number"
                name="size"
                value={details.size}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-400 focus:outline-none"
                placeholder="Enter Size"
              />
            </div>

            <div>
              <label className="text-gray-700 font-medium">Rooms</label>
              <input
                type="number"
                name="rooms"
                value={details.rooms}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-400 focus:outline-none"
                placeholder="Number of rooms"
              />
            </div>

            <div>
              <label className="text-gray-700 font-medium">Bathrooms</label>
              <input
                type="number"
                name="bathrooms"
                value={details.bathrooms}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-400 focus:outline-none"
                placeholder="Number of bathrooms"
              />
            </div>
          </div>


          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-gray-700 font-medium">Rental Start Date</label>
              <input
                type="date"
                name="rentalStartDate"
                value={details.rentalStartDate}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-gray-700 font-medium">Rental End Date</label>
              <input
                type="date"
                name="rentalEndDate"
                value={details.rentalEndDate}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={() => nav(-1)}
              className="px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-200 transition"
            >
              ← Back
            </button>

            <button
              type="submit"
              className="px-6 py-3 bg-[#1F2937] hover:bg-[#374151] text-white rounded-lg transition"
            >
              {id ? "Update Property" : "Add Property"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Info;







