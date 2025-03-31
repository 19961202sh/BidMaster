
import { Routes, Route } from "react-router-dom";
import React from "react";



import "./App.css";
import Nav from "./Components/Nav/Nav";
import Home from "./Components/Home/Home";
import Login from "./Components/Login/Login";
import Register from "./Components/Register/Register";
import Dashboard from "./Components/Dashboard/Dashboard";
import AddEmployee from "./Components/AsignRoles/AddEmployee";
import EmployeeDashboard from "./Components/AsignRoles/EmployeeDashboard";
import AboutUs from "./Components/AboutUs/AboutUs";
import Footer from "./Components/Footer/Footer";
import ContactUs from "./Components/ContactUs/ContactUs";
import UpdateEmployee from "./Components/UpdateEmployee/UpdateEmployee";
import Terms from "./Components/Terms/Terms";
import EmployeeDetails from "./Components/EmployeeDetails/EmployeeDetails";


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
        <Route path="/aboutUs" element={<AboutUs/>}/>
        <Route path="/contactUs" element={<ContactUs/>}/>
        <Route path="/home" element={<Home/>}/>
        <Route path="/terms" element={<Terms/>}/>
        <Route path="/employeeDashboard/:id" element={<UpdateEmployee/>}/>
        <Route path="/employeeDetails/:id" element={<EmployeeDetails />} />


        
      </Routes>
    </React.Fragment>


   <Footer></Footer>
    </div>
  );
}

export default App;
