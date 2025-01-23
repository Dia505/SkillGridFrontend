function SearchResult() {
    return (
        <>
            <div className="flex flex-col pt-8 pl-14 items-center gap-10">
                <div className="flex justify-between w-[687px] items-center">
                    <div className="flex gap-5">
                        <div className="w-[70px] h-[70px] rounded-full overflow-hidden bg-purple-700">
                            <img
                                src=""
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div className="flex flex-col">
                            <p className="text-lg font-bold font-inter">
                                Freelancer name
                            </p>
                            <p className="text-base font-inter">profession</p>
                            <p className="text-sm text-grey-500 font-inter">address, city</p>
                        </div>
                    </div>

                    <p className="text-base font-inter">service rate</p>
                </div>

                <div>
                    <div className="w-[350px] h-[200px] bg-red-500 rounded-xl"></div>
                </div>

                <div className="flex">
                    <div className="flex bg-purple-100 rounded-3xl items-center justify-center pt-2 pl-4 pr-4 pb-2">
                        <p className="text-grey-700">Event photography</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SearchResult;