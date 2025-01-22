function SearchFilter({searchFilter}) {
    return (
        <>
            <div className="flex items-center gap-4">
                <input
                    type="checkbox"
                    className={`h-6 w-6`}
                />
                <span className="text-lg flex items-center">{searchFilter}</span>
            </div>
        </>
    )
}

export default SearchFilter;