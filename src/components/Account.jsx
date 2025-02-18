import { useState, useEffect } from "react";
import { CgProfile } from "react-icons/cg";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const API_URL = import.meta.env.VITE_API_URL;

const Account = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${API_URL}/api/auth/account`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch user data");

        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false)
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-10">
      <h2 className="text-3xl font-semibold text-gray-800 text-center">
       Account
      </h2>

      
      <div className="flex justify-center mt-4">
        <div className="w-24 h-24 rounded-full border-2 border-gray-300 shadow-md flex justify-center items-center">
          {loading ? <Skeleton circle height={96} width={96} /> : <CgProfile size={100} />}
        </div>
      </div>

      
      <div className="mt-6 space-y-4">
        <div className="flex justify-between border-b pb-2">
          <span className="text-gray-600 font-medium">Name:</span>
          <span className="text-gray-800">
            {loading ? <Skeleton width={120} /> : `${user.firstName} ${user.lastName}`}
          </span>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span className="text-gray-600 font-medium">Email:</span>
          <span className="text-gray-800">
            {loading ? <Skeleton width={150} /> : user.email}
          </span>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span className="text-gray-600 font-medium">Role:</span>
          <span className={`text-gray-800 capitalize ${user?.role === "owner" ? "text-blue-500" : "text-green-500"}`}>
            {loading ? <Skeleton width={80} /> : user.role}
          </span>
        </div>
      </div>


      {loading ? (
        <Skeleton height={60} className="mt-6" />
      ) : user.role === "owner" ? (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <p className="text-gray-700">As an <strong>Owner</strong>, you can manage your properties and tenants.</p>
        </div>
      ) : (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <p className="text-gray-700">As a <strong>Tenant</strong>, you can view available properties and contact owners.</p>
        </div>
      )}


      <div className="text-center mt-6">
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/";
          }}
          className="text-red-500 hover:underline"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Account;

