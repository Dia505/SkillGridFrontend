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
    <div className="900:ml-24 900:mr-40 500:mr-14 mt-4">
      <h2 className="text-2xl font-caprasimo text-purple-700">Select your job category</h2>

      {/* Category Icons Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 mt-4">
        {categories.map((category) => (
          <div
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className={`flex flex-col items-center justify-center p-4 border-2 rounded-lg cursor-pointer
              ${selectedCategory === category.id ? "border-purple-700 bg-purple-200 bg-opacity-80" : "border-grey-300 hover:bg-grey-50 hover:bg-opacity-60"}`}
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
