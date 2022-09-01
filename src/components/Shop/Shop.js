import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { addToDb, getStoredCart } from "../../utilities/fakedb";
import Cart from "../Cart/Cart";
import Product from "../Product/Product";
import "./Shop.css";

const Shop = () => {
  // const first10 = fakeData.slice(0, 10);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/products")
    .then(res => res.json())
    .then(data => setProducts(data))
  }, [])

  useEffect(() => {
    const savedCart = getStoredCart();
    const productKeys = Object.keys(savedCart);
    console.log(products, productKeys);
    if(products.length > 0){
      const previousCart = productKeys.map(existingKey => {
        const product = products.find(pd => pd.key === existingKey);
        product.quantity = savedCart[existingKey];
        return product;
      })
    setCart(previousCart);
    }
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
