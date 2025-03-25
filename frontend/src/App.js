
import { Routes, Route } from "react-router-dom";
import React from "react";


import "./App.css";
import Nav from "./Components/Nav/Nav";
import Login from "./Components/Login/Login";
import Register from "./Components/Register/Register";
import Dashboard from "./Components/Dashboard/Dashboard";
import Footer from "./Components/Footer/Footer";
import AddEmployee from "./Components/AsignRoles/AddEmployee";
import EmployeeDashboard from "./Components/AsignRoles/EmployeeDashboard";


function App() {
  return (
    <div >
   
   <Nav></Nav>

    <React.Fragment>
      <Routes>
        <Route path="/register" element={<Register/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/addEmployee" element={<AddEmployee/>}/>
        <Route path="/employeeDashboard" element={<EmployeeDashboard/>}/>
        
      </Routes>
    </React.Fragment>

  <Footer></Footer>
   
    </div>
  );
}

export default App;
