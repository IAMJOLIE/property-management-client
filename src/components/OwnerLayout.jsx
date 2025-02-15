import { Outlet } from "react-router-dom";
import OwnerDash from "./OwnerDash";

const OwnerLayout = () => {
    return (
        <div className="flex min-h-screen  bg-gray-50">
            <OwnerDash /> 
            <main className="flex-1 p-6">
                <Outlet /> 
            </main>
        </div>
    );
};

export default OwnerLayout;





