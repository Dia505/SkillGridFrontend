import React, { useState } from "react";

const JobCategoryForm = ({ onNext, onPrevious, data }) => {
  const [selectedCategory, setSelectedCategory] = useState(data?.category || null);

  const categories = [
    { id: "design", name: "Design", icon: "📐" },
    { id: "technology", name: "Technology", icon: "💻" },
    { id: "marketing", name: "Marketing", icon: "📢" },
    { id: "business", name: "Business", icon: "📈" },
    { id: "writing", name: "Writing", icon: "✍️" },
    { id: "photography", name: "Photography", icon: "📷" },
    { id: "education", name: "Education", icon: "🎓" },
    { id: "artisan_craft", name: "Artisan and Craft", icon: "🎨" },
  ];

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedCategory) {
      alert("Please select a category.");
      return;
    }
    onNext({ jobCategory: selectedCategory });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h2 className="text-xl font-semibold text-center">Select a Job Category</h2>

      {/* Category Icons Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
        {categories.map((category) => (
          <div
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className={`flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer
              ${selectedCategory === category.id ? "border-green-500 bg-green-100" : "border-gray-300 hover:bg-gray-100"}
            `}
          >
            <div className="text-4xl">{category.icon}</div>
            <p className="text-sm font-medium mt-2">{category.name}</p>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        {onPrevious && (
          <button
            type="button"
            onClick={onPrevious}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md shadow-sm hover:bg-gray-300"
          >
            Previous
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 bg-green-500 text-white rounded-md shadow-sm hover:bg-green-600"
        >
          Next
        </button>
      </div>
    </form>
  );
};

export default JobCategoryForm;
