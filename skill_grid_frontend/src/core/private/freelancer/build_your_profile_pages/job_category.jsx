import React, { useState, useEffect } from "react";

const JobCategoryForm = ({ data, updateData }) => {
  const [selectedCategory, setSelectedCategory] = useState(data || null);

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

  // Update parent with the selected category whenever it changes
  useEffect(() => {
    updateData({ job_category: selectedCategory });
  }, [selectedCategory, updateData]);

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-semibold text-center">Select a Job Category</h2>

      {/* Category Icons Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
        {categories.map((category) => (
          <div
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className={`flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer
              ${selectedCategory === category.id ? "border-green-500 bg-green-100" : "border-gray-300 hover:bg-gray-100"}`}
          >
            <div className="text-4xl">{category.icon}</div>
            <p className="text-sm font-medium mt-2">{category.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobCategoryForm;
