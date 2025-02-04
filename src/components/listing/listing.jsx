import React from "react";
import { useParams } from "react-router-dom";
import "./Listing.scss";

const products = [
  {
    id: 1,
    name: "Heart Denim Skirt",
    listedBy: "@niceguy32",
    category: "Bottoms",
    condition: "Like new",
    size: "Medium",
    description: "A cute heart-patterned denim skirt.",
    imageUrl: "https://via.placeholder.com/250"
  },
  {
    id: 2,
    name: "Red T-Shirt",
    listedBy: "@fashionguru",
    category: "Tops",
    condition: "Brand new",
    size: "Large",
    description: "A stylish red t-shirt for casual wear.",
    imageUrl: "https://via.placeholder.com/250"
  }
];

export default function Listing() {
  const { id } = useParams();
  const product = products.find((p) => p.id === parseInt(id));

  if (!product) {
    return <main className="listing-page"><h1>Product not found</h1></main>;
  }

  return (
    <main className="listing-page">
      <section className="product">
        <div className="product__image-container">
          <img src={product.imageUrl} alt={product.name} />
        </div>
        <div className="product__details-container">
          <div className="details__title-section">
            <h1>{product.name}</h1>
            <p className="details__listing-info">Listing by <strong>{product.listedBy}</strong></p>
          </div>
          <div className="details__info-section">
            <div className="info__item">
              <p className="info__label">Category</p>
              <p className="info__value">{product.category}</p>
            </div>
            <div className="info__item">
              <p className="info__label">Condition</p>
              <p className="info__value">{product.condition}</p>
            </div>
            <div className="info__item">
              <p className="info__label">Size</p>
              <p className="info__value">{product.size}</p>
            </div>
          </div>
          <div className="details__description-section">
            <p className="description__label">Description</p>
            <p className="description__text">{product.description}</p>
          </div>
          <div className="reqest_bookmark_container">
            <button className="details__request-btn"
              onClick={() => alert(`Your request for ${product.name} has been sent to ${product.listedBy}`)}>
              Request
            </button>
            <div className="bookmark-container">
              <input type="checkbox" id="bookmark-toggle" />
              <label htmlFor="bookmark-toggle"></label>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}