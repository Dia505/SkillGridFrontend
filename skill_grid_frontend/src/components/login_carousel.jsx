import React, { useState, useEffect } from "react";

const LoginCarousel = ({ carouselData }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Function to go to the next slide
    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselData.length);
    };

    // Auto-slide every 3 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            handleNext();
        }, 3000);
        return () => clearInterval(interval); // Cleanup on unmount
    }, [carouselData.length]);

    const itemWidth = 500; // Set the desired width for each item
    const containerWidth = itemWidth; // Carousel container should match the item width

    return (
        <div
            className="overflow-hidden mx-auto bg-purple-700"
            style={{ width: `${containerWidth}px` }}
        >
            <div
                className="flex transition-transform duration-500"
                style={{
                    transform: `translateX(-${currentIndex * itemWidth}px)`,
                    width: `${carouselData.length * itemWidth}px`,
                }}
            >
                {carouselData.map((data, index) => (
                    <div
                        key={index}
                        className="flex-shrink-0 text-center"
                        style={{ width: `${itemWidth}px` }}
                    >
                        <img
                            src={data.image}
                            alt={data.title}
                            className="w-full h-[400px] object-contain"
                        />
                        <p className="font-caprasimo text-purple-50 text-3xl mt-4">
                            {data.title}
                        </p>
                        <div className="w-[365px] mx-auto mt-2">
                            <p className="font-inter text-purple-50 text-lg font-light">
                                {data.subtitle}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 mt-4">
                {carouselData.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-3 h-3 rounded-full ${
                            index === currentIndex ? "bg-purple-700" : "bg-purple-300"
                        }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default LoginCarousel;
