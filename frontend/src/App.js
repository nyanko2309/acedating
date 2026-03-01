import React from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";



//import Navbar from "./Components/Navbar";
import LoginPage from "./pages/LoginPage";
import Homepage from "./pages/Homepage";
import Profilepage from "./pages/Profilepage";
import SavedPage from "./pages/SavedPage";
import Random from "./pages/Random";
import Latters from "./pages/Latters";
import WriteLatter from "./pages/WriteLatter";
import Infopage from "./pages/Infopage";

function App() {
  
  return (

<Router>
  {/* Check this current conflict when merging with the main */}
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<Homepage />} /> 
        <Route path="/profile" element={<Profilepage/>} />
        <Route path="/saved" element={<SavedPage/>} />
        <Route path="/random" element={<Random/>} />
        <Route path="/latters" element={<Latters/>} />
        <Route path="/info" element={<Infopage/>} />
        <Route path="/writelatter/:profile_id" element={<WriteLatter />} />
      </Routes>
</Router>
    
  );
}

export default App;