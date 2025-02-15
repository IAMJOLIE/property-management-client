import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate, useParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;
const AddProperty = () => {
  const { id } = useParams();
  const { propertyId } = useParams();
  const nav = useNavigate();
  const [property, setProperty] = useState({
    type: "",
    name: "",
    description: "",
    country: "",
    state: "",
    city: "",
    zipCode: "",
    address: "",
    images: [], 
 
  });

  useEffect(() => {
  

    const fetchProperty = async () => {

      if (!id) return;

      console.log("redigera: ", id)

      if(location.state?.propertyData) {
        console.log(" Befintlig fastighetsdata mottagen:", location.state.propertyData);

        setProperty(location.state.propertyData);
      } else {
        try{
          const response = await fetch (`${API_URL}/api/properties/${id}`)
          if (!response.ok) throw new Error("Misslyckades med att hämta fastighet");
  
          const data = await response.json();
          setProperty(data); 
      } catch (error) {
          console.error(" Fel vid hämtning:", error);
      }
      }

 
};

fetchProperty();
}, [id, location.state]);




  const handleTextInput = (e) => {
    setProperty({ ...property, [e.target.name]: e.target.value });
  };

  const handleNext = (e) => {
    e.preventDefault();
    console.log(" Skickar användaren till info-sidan med data:", property);

    if (property._id) {
       
        nav(`/owner/info/${property._id}`, { state: { propertyData: property } });
    } else {
       
        nav("/owner/info", { state: { propertyData: property } });
    }
};



 
    const handleUpload = async (files) => {
      
      const uploadedImageUrls = [];
    
      for (let file of files) {
        const formData = new FormData();
        formData.append("image", file); 
    
        try {
          console.log("Laddar upp bild:", file.name);
    
          const response = await fetch(`${API_URL}/api/properties/upload`, {
            method: "POST",
            body: formData,
          });
    
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to upload image: ${errorText}`);
          }
    
          const data = await response.json();
          uploadedImageUrls.push(data.imageUrl);
          console.log(" Bild uppladdad:", data.imageUrl);
    
        } catch (error) {
          console.error("Fel vid uppladdning:", error.message);
        }
      }
    
      setProperty((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedImageUrls], 
      }));
    };
    
  

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    multiple: true,
    onDrop: handleUpload, 
  });



  return (
    <div className="">
      <form className="grid grid-cols-2 gap-6 auto-rows-auto" >
        <div className="p-5 flex flex-wrap gap-2 bg-white shadow-lg rounded-lg">
          <label className="text-gray-700">Type</label>
          <select
            name="type"
            value={property.type}
            onChange={handleTextInput}
            className="w-full appearance-none border border-gray-300 rounded-lg focus:ring-0 focus:outline-none text-sm p-3 pr-10"
          >
            <option value="">Select Type</option>
            <option value="Own Property">Own Property</option>
            <option value="Rental">Rental</option>
          </select>

          <label className="text-gray-700">Name Of Property</label>
          <input
            type="text"
            name="name"
            value={property.name}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-0 focus:outline-none text-sm"
            placeholder="Enter Property Name"
            onChange={handleTextInput}
          />

          <label className="text-gray-700">Description</label>
          <textarea
            name="description"
            className="w-full h-32 py-2 px-4 border border-gray-300 rounded-lg focus:ring-0 focus:outline-none text-sm placeholder-gray-400 resize-none"
            placeholder="Write about the property"
            maxLength="300"
            onChange={handleTextInput}
            value={property.description}
          ></textarea>

          <label className="text-gray-700">Upload Property Image</label>
          <div
            {...getRootProps()}
            className="h-50 w-full border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-100 hover:bg-gray-200 cursor-pointer text-center grid place-items-center"
          >
            <input {...getInputProps()} />
            <p className="text-gray-500">Drop your files here or click to upload</p>
          </div>

          {property.images.length > 0 && (
            <div className="mt-4 flex flex-col">
              <p className="text-gray-600 text-sm mb-2">You can add up to 10 images</p>
              <div className="flex flex-wrap gap-4">
                {property.images.map((img, index) => (
                  <div key={index} className="relative w-24 h-24">
                    <img src={typeof img === "string" ? img : img.url} alt={`Preview ${index}`}
 className="w-full h-full object-cover rounded-lg" />
                    <button
                      onClick={() => {
                        setProperty((prev) => ({
                          ...prev,
                          images: prev.images.filter((_, i) => i !== index),
                        }));
                      }}
                      className="absolute top-1 right-1 bg-blue-300 text-white rounded-full px-2 py-1 text-xs"
                    >
                      ✖
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <div className="p-5 flex flex-wrap gap-2 bg-white shadow-lg rounded-lg self-start">
            <label className="text-gray-700">Country</label>
            <input
              value={property.country}
              name="country"
              onChange={handleTextInput}
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-0 focus:outline-none text-sm"
              placeholder="Enter Property Country"
            />

            <label className="text-gray-700">State</label>
            <input
              value={property.state}
              name="state"
              onChange={handleTextInput}
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-0 focus:outline-none text-sm"
              placeholder="Enter Property State"
            />

            <label className="text-gray-700">City</label>
            <input
              value={property.city}
              name="city"
              onChange={handleTextInput}
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-0 focus:outline-none text-sm"
              placeholder="Enter Property city"
            />

            <label className="text-gray-700">Zip Code</label>
            <input
              name="zipCode"
              value={property.zipCode}
              onChange={handleTextInput}
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-0 focus:outline-none text-sm"
              placeholder="Enter Property Zip Code"
            />

            <label className="text-gray-700">Address</label>
            <textarea
              name="address"
              value={property.address}
              onChange={handleTextInput}
              className="w-full h-15 p-3 border border-gray-300 rounded-lg focus:ring-0 focus:outline-none text-sm placeholder-gray-400 resize-none"
              placeholder="Enter Property Address"
            ></textarea>
          </div>
          <div className="max-w-sm mx-auto flex justify-end mt-6">
            <button onClick={handleNext} className="w-100 bg-[#1F2937] hover:bg-[#374151]  text-white p-3 rounded-lg  mt-6 transition">
             Next
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddProperty;

