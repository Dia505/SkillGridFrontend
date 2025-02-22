import { useState } from "react";
import { StarIcon } from "@heroicons/react/24/solid";

function StarRating({ onRate }) {
    const [hovered, setHovered] = useState(0);  // Track hovered star
    const [selected, setSelected] = useState(0); // Track selected rating

    const handleClick = (rating) => {
        setSelected(rating);
        onRate(rating); // Send rating to parent component
    };

    return (
        <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon
                    key={star}
                    className={`h-10 w-10 cursor-pointer transition-all 
                        ${
                            (hovered >= star || selected >= star)
                                ? "text-yellow-700"  // Highlight on hover or selection
                                : "text-grey-300"  // Default grey
                        }`}
                    onMouseEnter={() => setHovered(star)}
                    onMouseLeave={() => setHovered(0)}
                    onClick={() => handleClick(star)}
                />
            ))}
        </div>
    );
}

export default StarRating;
