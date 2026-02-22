import React from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";



//import Navbar from "./Components/Navbar";
import LoginPage from "./pages/LoginPage";
import Homepage from "./pages/Homepage";
import Profilepage from "./pages/Profilepage";
import SavedPage from "./pages/SavedPage";


function App() {
  
  return (

<Router>
  {/* Check this current conflict when merging with the main */}
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<Homepage />} /> 
        <Route path="/profile" element={<Profilepage/>} />
        <Route path="/saved" element={<SavedPage/>} />

      </Routes>
</Router>
    
  );
}

export default App;