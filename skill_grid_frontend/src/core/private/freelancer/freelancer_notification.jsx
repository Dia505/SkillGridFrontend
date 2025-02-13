import FreelancerSideBar from "../../../components/navigation_bar/freelancer_side_bar";

function FreelancerNotification() {
    return (
        <>
            <div className="flex bg-purple-50">
                <FreelancerSideBar />

                <div className="h-screen flex bg-purple-50 py-10 pl-14">
                    <div className="flex flex-col gap-8">
                        <p className="text-2xl font-inter">Notifications</p>

                        <div className="flex flex-col gap-3 pl-14">
                            <div className="flex gap-20">
                                <div className="flex gap-6">
                                    <img
                                        className="h-20 w-20 rounded-full"
                                        src="client_id.profile_picture"
                                        alt="client_profile_picture"
                                    />

                                    <div className="flex flex-col">
                                        <p className="text-lg font-semibold">notification.message</p>
                                        <p className="text-grey-400">Click here to know the details</p>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <p className="text-sm">notification_date</p>
                                    <div className="bg-blue-500 rounded-full h-2 w-2 mt-2"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default FreelancerNotification;