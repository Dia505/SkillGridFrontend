import { PlusIcon } from '@heroicons/react/20/solid';
import React, { useState } from "react";
import AddServiceForm from "./add_service_form";

function ServiceDetails({ data, updateData }) {
    const [showAddServiceForm, setShowAddServiceForm] = useState(false); // State to show/hide the form
    const [serviceData, setServiceData] = useState(data?.service_details || []); // Store the list of services

    const updateServiceDetails = (newService) => {
        // Update the service details in the parent
        setServiceData((prevData) => [...prevData, newService]);
        updateData({ service_details: serviceData }); // Send the updated data back to the parent component
    };

    return (
        <div className="ml-24 mr-40 mt-4">
            <h2 className="text-2xl font-caprasimo text-purple-700">Highlight your services</h2>
            <p className="text-purple-700 text-lg mt-2">Specify the services you specialize in to attract the right clients.</p>

            <div className="flex flex-col gap-4 justify-center items-center w-[349px] h-[265px] border border-dashed border-grey-400 rounded-2xl mt-4">
                <p className="text-xl text-grey-700">Add a service</p>
                <button
                    onClick={() => setShowAddServiceForm(!showAddServiceForm)} // Toggle the form visibility
                    className="bg-purple-700 rounded-full w-[35px] h-[35px]">
                    <PlusIcon className="w-9 h-6 text-purple-50" />
                </button>

                {/* Conditionally render AddServiceForm */}
                {showAddServiceForm && (
                    <>
                        <div className="fixed inset-0 bg-grey-500 bg-opacity-50 z-10"></div> {/* Grey overlay */}
                        <div className="fixed inset-0 flex justify-center items-center z-20">
                            <AddServiceForm 
                                closeForm={() => setShowAddServiceForm(false)} 
                                updateServiceDetails={updateServiceDetails}  // Pass the function to child
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default ServiceDetails;
