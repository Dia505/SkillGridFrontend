function SearchFilter({ searchFilter, onChange, checked }) {
    return (
        <div className="flex items-center gap-4">
            <input
                type="checkbox"
                className="h-6 w-6"
                checked={checked}
                onChange={onChange}
            />
            <span className="text-lg flex items-center">{searchFilter}</span>
        </div>
    );
}

export default SearchFilter;
