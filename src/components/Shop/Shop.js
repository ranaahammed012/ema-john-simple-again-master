import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { addToDb, getStoredCart } from "../../utilities/fakedb";
import Cart from "../Cart/Cart";
import Product from "../Product/Product";
import "./Shop.css";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetch("https://damp-coast-75016.herokuapp.com/products")
    .then(res => res.json())
    .then(data => setProducts(data))
  }, [])

  useEffect(() => {
    const savedCart = getStoredCart();
    const productKeys = Object.keys(savedCart);
    fetch("https://damp-coast-75016.herokuapp.com/productsByKeys", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(productKeys)
    })
    .then(res => res.json())
    .then(data => setCart(data))
  }, [products])

  const handleAddProduct = (product) => {
    const toBeAddedKey = product.key;
    const sameProduct = cart.find(pd => pd.key === toBeAddedKey);
    let count = 1;
    let newCart;
    if (sameProduct) {
      count = sameProduct.quantity + 1;
      sameProduct.quantity = count;
      const others = cart.filter(pd => pd.key !== toBeAddedKey);
      newCart = [...others, sameProduct];
    }
    else {
      product.quantity = 1;
      newCart = [...cart, product];
    }
    setCart(newCart); 
    
    addToDb(product.key, count);
  }
  return (
    <div className="twin-container">
      <div className="product-container">
        {
          products.map(pd => <Product 
            showAddToCart={true}
            key = {pd.key}
            handleAddProduct = {handleAddProduct}
            product = {pd}></Product>)
        }
      </div>

      <div className="cart-container">
        <Cart cart = {cart}>
        <Link to="/review"><button className="main-button">Review Order</button></Link>
        </Cart>
      </div>
      
    </div>
  );
};

export default Shop;
