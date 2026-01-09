import { useState } from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../styles/productCard.css";
import CertificationBadge from "./CertificationBadge";
import Rating from "./Rating";

const Product = ({ product }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const getStockStatus = () => {
    if (product.countInStock === 0) return "out";
    if (product.countInStock <= 5) return "low";
    return "in";
  };

  const stockStatus = getStockStatus();

  return (
    <Card className="organic-product-card">
      <div className="organic-product-image-wrapper">
        <Link to={`/product/${product._id}`}>
          <Card.Img
            src={product.image}
            alt={product.name}
            className="organic-product-image"
          />
        </Link>

        {/* Hover Overlay */}
        <div className="organic-product-overlay">
          <Link
            to={`/product/${product._id}`}
            className="organic-product-quick-view"
          >
            <i className="fas fa-eye"></i> Quick View
          </Link>
        </div>

        {/* Wishlist Button */}
        <button
          className={`organic-wishlist-btn ${isWishlisted ? "active" : ""}`}
          onClick={() => setIsWishlisted(!isWishlisted)}
          aria-label="Add to wishlist"
        >
          <i className={`${isWishlisted ? "fas" : "far"} fa-heart`}></i>
        </button>

        {/* Product Badges */}
        <div className="organic-product-badges">
          <div className="organic-product-badges-left">
            {product.isNewArrival && (
              <span className="organic-badge-new">
                <i className="fas fa-sparkles"></i> New
              </span>
            )}
          </div>
          <div className="organic-product-badges-right">
            {product.isFeatured && (
              <span className="organic-badge-featured">
                <i className="fas fa-star"></i> Featured
              </span>
            )}
            {product.discount > 0 && (
              <span className="organic-badge-discount">
                -{product.discount}%
              </span>
            )}
          </div>
        </div>
      </div>

      <Card.Body className="organic-product-body">
        {/* Product Title */}
        <Link
          to={`/product/${product._id}`}
          className="organic-product-title-link"
        >
          <h3 className="organic-product-title">{product.name}</h3>
        </Link>

        {/* Product Attributes */}
        <div className="organic-product-attributes">
          {product.isOrganic && (
            <span className="organic-attribute-badge organic-attribute-organic">
              <i className="fas fa-leaf organic-attribute-icon"></i>
              Organic
            </span>
          )}
          {product.isVegan && (
            <span className="organic-attribute-badge organic-attribute-vegan">
              <i className="fas fa-seedling organic-attribute-icon"></i>
              Vegan
            </span>
          )}
          {product.isGlutenFree && (
            <span className="organic-attribute-badge organic-attribute-gluten-free">
              <i className="fas fa-wheat organic-attribute-icon"></i>
              Gluten-Free
            </span>
          )}
        </div>

        {/* Certifications */}
        {product.certifications && product.certifications.length > 0 && (
          <div className="organic-product-certifications">
            {product.certifications.map((cert) => (
              <CertificationBadge
                key={cert._id || cert}
                certification={typeof cert === "object" ? cert : null}
                size="sm"
              />
            ))}
          </div>
        )}

        {/* Origin */}
        {product.origin && (
          <div className="organic-product-origin">
            <i className="fas fa-map-marker-alt"></i>
            <span>{product.origin}</span>
          </div>
        )}

        {/* Rating */}
        <div className="organic-product-rating">
          <Rating
            value={product.rating}
            text={`${product.numReviews} reviews`}
          />
        </div>

        {/* Price */}
        <div className="organic-product-price-wrapper">
          <h4 className="organic-product-price">${product.price}</h4>
          {product.pricePerUnit > 0 && (
            <span className="organic-product-price-unit">
              / {product.weight}
              {product.unit}
            </span>
          )}
        </div>

        {/* Stock Status */}
        <span
          className={`organic-product-stock organic-product-stock-${stockStatus}`}
        >
          {stockStatus === "out" && (
            <>
              <i className="fas fa-times-circle"></i>
              Out of Stock
            </>
          )}
          {stockStatus === "low" && (
            <>
              <i className="fas fa-exclamation-triangle"></i>
              Low Stock ({product.countInStock} left)
            </>
          )}
          {stockStatus === "in" && (
            <>
              <i className="fas fa-check-circle"></i>
              In Stock
            </>
          )}
        </span>
      </Card.Body>
    </Card>
  );
};

export default Product;
