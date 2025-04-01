import React from 'react'
import { Route, Routes } from 'react-router-dom'
import "@fontsource/montserrat";

import Home from './Pages/Home'
import  Header from './Component/Header'
import Footer from './Component/Footer'
import Footer2 from './Component/Footer2';
import Cover from '../src/Component/Cover'
import Mens from './Pages/Mens';

function App() {
  return (
    <div>
        <Header/>
        <Routes>
            <Route path='/' element={<Home/>} />
            <Route path='/Mens' element={<Mens/>} />
        </Routes>
        <Cover />
        <Footer2 />
        <Footer />
    </div>
  )
}

export default App