import { Outlet } from "react-router-dom";

import TenDash from "./TenDash";

const TenantLayout = () => {
    return (
        <div className="flex min-h-screen  bg-gray-50">
            <TenDash /> 
            <main className="flex-1 p-6">
                <Outlet /> 
            </main>
        </div>
    );
};

export default TenantLayout;