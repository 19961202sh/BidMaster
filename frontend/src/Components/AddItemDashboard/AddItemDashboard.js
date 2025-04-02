import React, { useState, useEffect } from "react";
import axios from "axios";

function AddItemDashboard() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const response = await axios.get("http://localhost:5000/api/items");
    setItems(response.data);
  };

  const addItem = async () => {
    if (newItem) {
      await axios.post("http://localhost:5000/api/items", { name: newItem });
      setNewItem("");
      fetchItems();
    }
  };

  const updateStatus = async (id, status) => {
    await axios.put(`http://localhost:5000/api/items/${id}`, { status });
    fetchItems();
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <input
        type="text"
        value={newItem}
        onChange={(e) => setNewItem(e.target.value)}
        placeholder="Add new item"
      />
      <button onClick={addItem}>Add Item</button>
      <ul>
        {items
          .filter((item) => item.status === "pending")
          .map((item) => (
            <li key={item._id}>
              {item.name}
              <button onClick={() => updateStatus(item._id, "approved")}>
                Approve
              </button>
              <button onClick={() => updateStatus(item._id, "rejected")}>
                Reject
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
}

export default AddItemDashboard;