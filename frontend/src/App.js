import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [price, setPrice] = useState(50);
  const [ratingValue, setRatingValue] = useState(1);
  const [isGroup, setIsGroup] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Fetch data from the API
  useEffect(() => {
    fetch('http://localhost:3000/items')
      .then((response) => response.json())
      .then((data) => {
        setItems(data);
        setFilteredItems(data);
        setIsGroup(false);
      });
  }, []);

  const handleSearch = () => {
    setIsGroup(false);
    fetch(
      `http://localhost:3000/items/filter?minRating=${ratingValue}&maxPrice=${price}`
    )
      .then((response) => response.json())
      .then((data) => {
        setItems(data);
        setFilteredItems(data);
      });
  };

  const onClose = () => {
    setShowCart(!showCart);
  };

  const getByGroupBy = () => {
    fetch(`http://localhost:3000/items/group`)
      .then((response) => response.json())
      .then((data) => {
        // setGroupData(data);
        setFilteredItems(data);
        console.log(data);
        setIsGroup(true);
      });
  };

  const getStars = (rating) => {
    let stars = [];
    let i;
    for (i = 1; i <= 5; i++) {
      let starClass = i <= rating ? 'star fa fa-star' : 'star-empty fa fa-star';
      stars.push(<span className={starClass} key={i}></span>);
    }

    return <span>{stars}</span>;
  };

  const addToCart = (item, quantity) => {
    const updatedCart = [...cart];
    const existingItemIndex = updatedCart.findIndex(
      (cartItem) => cartItem.id === item.id
    );

    if (existingItemIndex !== -1) {
      updatedCart[existingItemIndex].quantity += quantity;
    } else {
      updatedCart.push({ ...item, quantity });
    }

    setCart(updatedCart);
    setQuantity(1);
  };

  useEffect(() => {
    const total = cart.reduce(
      (acc, cartItem) => acc + cartItem.price * cartItem.quantity,
      0
    );
    setTotalPrice(total);
  }, [cart]);

  return (
    <div className="App">
      <div className="header_main">
        <span> Shopping Cart</span>
        <div className="home_icon">
          <span className="movie_detail">
            <button onClick={() => setShowCart(!showCart)}>Cart</button>
          </span>
        </div>
      </div>
      <div style={{ marginTop: 95 }}>
        <div>
          <label style={{ margin: '10px' }}>
            Max Price:
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </label>
          <label style={{ margin: '10px' }}>
            Min Rating:
            <input
              type="number"
              value={ratingValue}
              onChange={(e) => setRatingValue(e.target.value)}
            />
          </label>

          <button onClick={handleSearch} style={{ margin: '10px' }}>
            Search
          </button>
          <button
            onClick={() => {
              getByGroupBy();
            }}
            style={{ margin: '10px' }}
          >
            Group By
          </button>
        </div>

        {showCart ? (
          <div style={{ border: '1px solid black' }}>
            <h2>Cart Details</h2>
            <ul>
              {cart.map((cartItem) => (
                <li key={cartItem.id} style={{ listStyleType: 'none' }}>
                  {cartItem.title} x{cartItem.quantity} -
                  {cartItem.price * cartItem.quantity} Rs
                </li>
              ))}
            </ul>
            <p>Total Price: {totalPrice} Rs</p>
          </div>
        ) : null}

        <div>
          {isGroup ? (
            <>
              {Object.values(filteredItems).map((itemArray, index) => (
                <>
                  <h1>{itemArray[index].category.toUpperCase()}</h1>
                  <div className="items" key={index}>
                    {itemArray.map((item, innerIndex) => (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          padding: '10px',
                          width: '280px',
                          boxShadow: '0 3px 10px 0 black',
                          cursor: 'pointer',
                          borderRadius: '4px',
                          paddingBottom: '10px',
                          margin: '10px',
                        }}
                        key={item.title}
                      >
                        <img
                          src={item.image}
                          style={{
                            objectFit: 'cover',
                            height: '300px',
                            borderTopLeftRadius: '4px',
                            borderTopRightRadius: '4px',
                          }}
                          alt={item.title}
                        />
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            flexDirection: 'column',
                            padding: '10px',
                            rowGap: '10px',
                          }}
                        >
                          <span>
                            <b>{item.title}</b>
                          </span>
                          <span>Price: {item.price} Rs</span>
                          <span>Rating: {getStars(item.rating.rate)}</span>
                          <label style={{ margin: '10px' }}>
                            Qty:
                            <input
                              type="number"
                              value={quantity}
                              onChange={(e) => {
                                if (Number(e.target.value > 0))
                                  setQuantity(e.target.value);
                              }}
                            />
                          </label>
                          <span>
                            {' '}
                            <button
                              onClick={() => {
                                addToCart(item, Number(quantity));
                              }}
                            >
                              Add to Cart
                            </button>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ))}
            </>
          ) : (
            <>
              <div className="items">
                {filteredItems.map((item) => (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      padding: '10px',
                      width: '280px',
                      boxShadow: '0 3px 10px 0 black',
                      cursor: 'pointer',
                      borderRadius: '4px',
                      paddingBottom: '10px',
                      margin: '10px',
                    }}
                    key={item.title}
                  >
                    <img
                      src={item.image}
                      style={{
                        objectFit: 'cover',
                        height: '300px',
                        borderTopLeftRadius: '4px',
                        borderTopRightRadius: '4px',
                      }}
                      alt={item.title}
                    />
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        padding: '10px',
                        rowGap: '10px',
                      }}
                    >
                      <span>
                        <b>{item.title}</b>
                      </span>
                      <span>Price: {item.price} Rs</span>
                      <span>Rating: {getStars(item.rating.rate)}</span>
                      <span>
                        <label style={{ margin: '10px' }}>
                          Qty:
                          <input
                            type="number"
                            value={quantity}
                            onChange={(e) => {
                              if (Number(e.target.value > 0))
                                setQuantity(e.target.value);
                            }}
                          />
                        </label>
                      </span>
                      <button
                        onClick={() => {
                          addToCart(item, Number(quantity));
                        }}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
