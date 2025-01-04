const JoinClientFreelancerContainer = ({ containerImg, containerText, isActive, onClick }) => {
    return (
        <div
            onClick={onClick} // Trigger onClick passed from parent
            className={`border-2 ${isActive ? 'border-purple-50' : 'border-grey-200'} flex w-[426px] h-[185px] rounded-[13px] pl-4 gap-4 cursor-pointer`}
        >
            <div className="flex items-center">
                <img className="w-[145px] h-[167px]" src={containerImg} alt="container" />
                <div className="w-[212px] text-center">
                    <p className="font-inter font-semibold text-purple-50">{containerText}</p>
                </div>
            </div>

            {/* Circular div with conditional styling */}
            <div className={`w-[17px] h-[17px] border-2 ${isActive ? 'bg-purple-50 border-purple-50' : 'border-grey-200'} rounded-full mt-3`}></div>
        </div>
    );
};

export default JoinClientFreelancerContainer;
