import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import AppLogo2 from "../app_logo/app_logo2";

function ClientDashboardNavbarWithoutToken() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState(""); // State to store search input

    const handleSearch = () => {
        if (searchTerm.trim() !== "") {
            navigate(`/search-freelancer?query=${encodeURIComponent(searchTerm)}`);
        }
    };

    return (
        <>
            <div className="bg-purple-50 flex w-full h-[90px] items-center justify-between pl-10 pr-10 fixed top-0 z-50">
                <button onClick={() => navigate("/")}><AppLogo2/></button>

                <div className="flex gap-5">
                    <div className="relative">
                        <input
                            type="text"
                            className="border border-grey-500 bg-purple-50 p-2 w-[260px] rounded-xl"
                            placeholder="Search freelancer/profession"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)} // Update state on input change
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()} // Search on Enter key
                        />
                        <button className="absolute w-[29px] h-[29px] right-2 top-1.5" onClick={handleSearch}>
                            <MagnifyingGlassIcon />
                        </button>
                    </div>

                    <button className="bg-purple-50 w-[90px] text-purple-700 font-caprasimo" onClick={() => navigate("/login")}>
                        Log In
                    </button>

                    <button className="bg-purple-700 w-[150px] rounded-xl text-purple-50 font-caprasimo" onClick={() => navigate("/join-client-freelancer")}>
                        Sign Up
                    </button>
                </div>
            </div>
        </>
    );
}

export default ClientDashboardNavbarWithoutToken;
