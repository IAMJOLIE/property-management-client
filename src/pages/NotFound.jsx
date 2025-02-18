import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-6xl font-bold text-gray-800">404</h1>
      <p className="text-gray-600 mt-2">Oops! The page you are looking for doesn’t exist.</p>
      <Link
        to="/"
        className="mt-4 px-6 py-3 text-white bg-gray-700 rounded-lg shadow hover:bg-gray-600 transition"
      >
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;
