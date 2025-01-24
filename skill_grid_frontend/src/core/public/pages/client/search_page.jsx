import { StarIcon } from "@heroicons/react/24/solid";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ClientDashboardNavbarWithToken from "../../../../components/navigation_bar/client_dashboard_navbar_with_token";
import ClientDashboardNavbarWithoutToken from "../../../../components/navigation_bar/client_dashboard_navbar_without_token";
import SearchFilter from "../../../../components/search_page/search_filter";
import SearchResult from "../../../../components/search_page/search_result";
import noResultImage from "../../../../assets/no_result_found.png"

function SearchPage() {
    const authData = JSON.parse(localStorage.getItem("authData")) || {};
    const token = authData?.token;

    const { searchQuery } = useParams(); // Get searchQuery from URL

    const [results, setResults] = useState([]);
    const [error, setError] = useState(null);

    let isTokenValid = false;

    if (token) {
        try {
            const decodedToken = jwtDecode(token);
            const currentTime = Date.now() / 1000;

            if (decodedToken.exp > currentTime) {
                isTokenValid = true;
            } else {
                localStorage.removeItem("authData");
            }
        } catch (error) {
            console.error("Error decoding token:", error);
            localStorage.removeItem("authData");
        }
    }

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!searchQuery) return;

            try {
                const response = await fetch(`http://localhost:3000/api/freelancer/search/${encodeURIComponent(searchQuery)}`);
                if (!response.ok) throw new Error("Failed to fetch search results");

                const data = await response.json();
                setResults(data);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchSearchResults();
    }, [searchQuery]);

    return (
        <>
            <div className="h-screen overflow-auto flex flex-col bg-purple-50">
                {isTokenValid ? <ClientDashboardNavbarWithToken /> : <ClientDashboardNavbarWithoutToken />}

                <div className="flex flex-col mt-[90px] pt-8">
                    <p className="text-2xl font-inter font-extrabold text-purple-700 pl-20">Search results for '{searchQuery}'</p>
                    <div className="w-full h-0.5 bg-grey-500 mt-9"></div>

                    <div className="flex">
                        <div className="w-[426px] h-screen flex flex-col pl-20 pr-20 pt-10 gap-8">
                            <select className="border border-grey-600 border-2 text-grey-500 h-[50px] bg-purple-50 p-2 rounded-xl focus:outline-none focus:ring-2">
                                <option value="">Location</option>
                                <option value="Kathmandu">Kathmandu</option>
                                <option value="Lalitpur">Lalitpur</option>
                                <option value="Bhaktapur">Bhaktapur</option>
                                <option value="Pokhara">Pokhara</option>
                                <option value="Chitwan">Chitwan</option>
                                <option value="Lumbini">Lumbini</option>
                                <option value="Janakpur">Janakpur</option>
                                <option value="Biratnagar">Biratnagar</option>
                                <option value="Dharan">Dharan</option>
                                <option value="Butwal">Butwal</option>
                            </select>

                            <div className="flex flex-col gap-4">
                                <p className="text-xl font-medium">Hourly rates</p>

                                <div className="flex flex-col gap-2">
                                    <SearchFilter searchFilter={"Below Rs. 1000"} />
                                    <SearchFilter searchFilter={"Rs. 1000 - Rs. 2000"} />
                                    <SearchFilter searchFilter={"Rs. 2000 - Rs. 3000"} />
                                    <SearchFilter searchFilter={"Rs. 3000 - Rs. 4000"} />
                                    <SearchFilter searchFilter={"Rs. 4000 - Rs. 5000"} />
                                    <SearchFilter searchFilter={"Above Rs. 5000"} />
                                </div>
                            </div>

                            <div className="flex flex-col gap-4">
                                <p className="text-xl font-medium">Ratings</p>

                                <div className="flex flex-col gap-2">
                                    <SearchFilter searchFilter={
                                        <>
                                            <StarIcon className="w-6 h-6 text-black" />
                                            <StarIcon className="w-6 h-6 text-black" />
                                            <StarIcon className="w-6 h-6 text-black" />
                                            <StarIcon className="w-6 h-6 text-black" />
                                            <StarIcon className="w-6 h-6 text-black" />
                                        </>
                                    } />
                                    <SearchFilter searchFilter={
                                        <>
                                            <StarIcon className="w-6 h-6 text-black" />
                                            <StarIcon className="w-6 h-6 text-black" />
                                            <StarIcon className="w-6 h-6 text-black" />
                                            <StarIcon className="w-6 h-6 text-black" />
                                        </>
                                    } />
                                    <SearchFilter searchFilter={
                                        <>
                                            <StarIcon className="w-6 h-6 text-black" />
                                            <StarIcon className="w-6 h-6 text-black" />
                                            <StarIcon className="w-6 h-6 text-black" />
                                        </>
                                    } />
                                    <SearchFilter searchFilter={
                                        <>
                                            <StarIcon className="w-6 h-6 text-black" />
                                            <StarIcon className="w-6 h-6 text-black" />
                                        </>
                                    } />
                                    <SearchFilter searchFilter={
                                        <>
                                            <StarIcon className="w-6 h-6 text-black" />
                                        </>
                                    } />
                                </div>
                            </div>
                        </div>

                        <div className="w-0.5 h-full bg-grey-500"></div>

                        <div className="flex flex-col pb-20">
                            {results.length > 0 ? (
                                results.map((freelancer, index) => (
                                    <SearchResult key={index} freelancer={freelancer} />
                                ))
                            ) : (
                                <div className="flex flex-col items-center pt-10 pl-80">
                                    <img className="w-[300px]" src={noResultImage}/>
                                    <div className="w-[450px]">
                                        <p className="text-2xl font-inter font-extrabold text-purple-700 text-center">Looks like there are no results for that. Keep searching!</p>
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}

export default SearchPage;