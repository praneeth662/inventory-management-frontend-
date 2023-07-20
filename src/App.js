import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

const App = () => {
  const [consumptionItemId, setConsumptionItemId] = useState('');
  const [additionItemId, setAdditionItemId] = useState('');
  const [quantityConsumed, setQuantityConsumed] = useState('');
  const [quantityAdded, setQuantityAdded] = useState('');
  const [stockData, setStockData] = useState([]);

  useEffect(() => {
    // Listen for stock updates from the server
    socket.on('stockUpdate', (updatedStockData) => {
      setStockData(
        stockData.map((item) =>
          item.itemId === updatedStockData.itemId
            ? { ...item, stockQuantity: updatedStockData.stockQuantity }
            : item
        )
      );
    });

    // Fetch the current stock from the server
    axios.get('/api/inventory')
      .then((response) => {
        setStockData(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleConsumptionSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('/api/inventory/consumption', { itemId: consumptionItemId, quantityConsumed });
      setConsumptionItemId('');
      setQuantityConsumed('');
      console.log('Consumption added successfully');
    } catch (error) {
      console.error(error);
    }
  };

  const handleAdditionSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('/api/inventory/addition', { itemId: additionItemId, quantityAdded });
      setAdditionItemId('');
      setQuantityAdded('');
      console.log('Addition added successfully');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Inventory Management System</h1>
      <form onSubmit={handleConsumptionSubmit}>
        <h2>Add Consumption</h2>
        <input
          type="text"
          placeholder="Item ID"
          value={consumptionItemId}
          onChange={(e) => setConsumptionItemId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Quantity Consumed"
          value={quantityConsumed}
          onChange={(e) => setQuantityConsumed(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
      <form onSubmit={handleAdditionSubmit}>
        <h2>Add Addition</h2>
        <input
          type="text"
          placeholder="Item ID"
          value={additionItemId}
          onChange={(e) => setAdditionItemId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Quantity Added"
          value={quantityAdded}
          onChange={(e) => setQuantityAdded(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
      <h2>Current Stock</h2>
      <ul>
        {stockData.map((item) => (
          <li key={item.itemId}>
            Item ID: {item.itemId}, Stock Quantity: {item.stockQuantity}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;