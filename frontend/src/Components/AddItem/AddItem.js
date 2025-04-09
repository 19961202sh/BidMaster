import React, { useState } from 'react';
import Nav from '../Nav/Nav';

import { useNavigate } from "react-router";
import axios from 'axios';
import './AddItem.css';

function AddItem() {
    const history = useNavigate();
    
    const [inputs, setInputs] = useState({
        title: "",
        image:"",
        description: "",
        startingBid: "",
    });

    const handleChange=(e)=>{
        setInputs((prevState)=>({
            ...prevState,
            [e.target.name]:e.target.value,
        }));
    };

    const handleSubmit=(e)=>{
        e.preventDefault();
        console.log(inputs);
        sendRequest().then(()=>history("/seller-dashboard"))
        
    }

    const sendRequest = async () => {
        await axios.post("http://localhost:5000/items", {
                title: String(inputs.title),
                description: String(inputs.description),
                startingBid: Number(inputs.startingBid),
            }).then(res=>res.data);
            
        }

    return (
        <div className="AR-add-item-page">
            <Nav /><br/><br/><br/><br/>
            <div>
                <div className="AR-header">
                    <h1>Add Item</h1>
                </div>
            </div>
            
            <form onSubmit={handleSubmit} className="AR-form-container AR-report-form">

                <label >Title:</label>
                <div className="AR-form-group">
                    <input 
                        type="text" 
                        name="title"
                        onChange={handleChange}
                        value={inputs.title}
                        placeholder="Enter item title"
                        required
                        
                    />
                </div>

                 <label>Description:</label>
                <div className="AR-form-group">
                    <textarea
                        type="text"
                        name="description"
                        onChange={handleChange}
                        value={inputs.description}
                        placeholder="Enter item description"
                        required
                        rows="4"
                        
                    />
                </div>
                
                <label>Starting Bid:</label>
                <div className="AR-form-group">
                    <input 
                        type="number"
                        name="startingBid"
                        onChange={handleChange}
                        min="0"
                        value={inputs.startingBid}
                        placeholder="Enter starting bid"
                        required
                        
                    />
                </div>
                <br/>
                <button type="submit" className="submit-button">Add Item</button>
            </form>
            <br/><br/>
          
        </div>
    );
}

export default AddItem;