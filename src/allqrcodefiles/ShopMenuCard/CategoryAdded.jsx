import React, { useState } from "react";
import './ShopMenu.css'

const CategorySection = ({ shopcatdata, handleCategoryNameChange, handleProductNameChange, handleProductPriceChange, handleImageUpload, addProduct, addCategory, removeCategory, removeProduct }) => {
  // State to track if a category is collapsed or expanded
  const [collapsedCategories, setCollapsedCategories] = useState({});

  // Function to toggle the collapse state of a category
  const toggleCategoryCollapse = (categoryIndex) => {
    setCollapsedCategories((prevState) => ({
      ...prevState,
      [categoryIndex]: !prevState[categoryIndex]
    }));
  };

  return (
    <div className="category-container">
      <div className="add-category-section">
        <label htmlFor="add-category" className="add-category-label">Add Category</label>
        <button type="button" onClick={addCategory} className="add-category-btn">+</button>
      </div>

      {shopcatdata.categories.map((category, categoryIndex) => (
        <div key={categoryIndex} className="category-section">
          <div className="category-header">
            <label htmlFor={`category-name-${categoryIndex}`} className="category-label">
              Category Name
            </label>
            <div className="category-header-actions">
              <button
                type="button"
                onClick={() => removeCategory(categoryIndex)}
                className="remove-category-btn"
              >
                X
              </button>
              <button
                type="button"
                onClick={() => toggleCategoryCollapse(categoryIndex)}
                className="toggle-category-btn"
              >
                {collapsedCategories[categoryIndex] ? "+" : "-"}
              </button>
            </div>
          </div>

          {/* Category Name Input */}
          <input
            type="text"
            id={`category-name-${categoryIndex}`}
            placeholder="Category Name"
            value={category.categoryName}
            onChange={(e) => handleCategoryNameChange(categoryIndex, e)}
          />

          {/* Collapsible Product List */}
          {!collapsedCategories[categoryIndex] && (
            <div className="product-list">
              {category.products.map((product, productIndex) => (
                <div key={productIndex} className="product-item">
                  <div className="product-input-group">
                    <label htmlFor={`product-name-${productIndex}`} className="product-label">Product Name</label>
                    <div className="product-input-group-wrapper">
                      <input
                        type="text"
                        id={`product-name-${productIndex}`}
                        placeholder="Product Name"
                        value={product.name}
                        onChange={(e) => handleProductNameChange(categoryIndex, productIndex, e)}
                      />
                      <button
                        type="button"
                        onClick={() => removeProduct(categoryIndex, productIndex)}
                        className="remove-product-btn"
                      >
                        X
                      </button>
                    </div>
                  </div>

                  <div className="product-input-group">
                    <label htmlFor={`product-price-${productIndex}`} className="product-label">Price</label>
                    <input
                      type="number"
                      id={`product-price-${productIndex}`}
                      placeholder="Price"
                      value={product.price}
                      onChange={(e) => handleProductPriceChange(categoryIndex, productIndex, e)}
                    />
                  </div>

                  <div className="product-input-group">
                    <label htmlFor={`product-image-${productIndex}`} className="product-label">Image</label>
                    <input
                      type="file"
                      id={`product-image-${productIndex}`}
                      onChange={(e) => handleImageUpload(e, categoryIndex, productIndex)}
                    />
                    {product.image && <img src={product.image} width="60px" height="60px" alt="Product" />}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add Product Button */}
          <div className="add-product-section">
            <label htmlFor="add-product" className="add-product-label">Add Product</label>
            <button
              type="button"
              onClick={() => addProduct(categoryIndex)}
              className="add-product-btn"
            >
              +
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategorySection;
