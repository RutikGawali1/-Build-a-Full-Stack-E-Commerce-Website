// src/components/ProductDetail.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/products/${id}`);
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <p className="text-center mt-5">Loading product...</p>;
  if (!product) return <p className="text-center mt-5">Product not found</p>;

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-md-6">
          <img
            src={product.image || 'https://via.placeholder.com/400'}
            alt={product.name}
            className="img-fluid rounded"
          />
        </div>
        <div className="col-md-6">
          <h2>{product.name}</h2>
          <p className="text-muted">{product.description}</p>
          <h4 className="text-primary">${product.price}</h4>
          <p>Category: {product.category}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
