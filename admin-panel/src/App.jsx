import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Header from "./Components/Header";
import Sidebar from "./Components/Sidebar";
import Add from "./Pages/Add";
import Items from "./Pages/items";
import Orders from "./Pages/Order";
import Login from "./Components/Login";

function App() {
  const [token, setToken] = useState("");

  return (
    <div className=" bg-gray-50  min-h-screen">
      {token === "" ? (
        <Login />
      ) : (
        <>
          <Header />
          <hr />
          <div className=" flex w-full">
            <Sidebar />
            <div className=" w-[70%] mx-auto ml-10 my-10 text-gray-600 text-base">
              <Routes>
                <Route path="/add" element={<Add />} />
                <Route path="/Order" element={<Orders />} />
                <Route path="/Items" element={<Items />} />
              </Routes>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
