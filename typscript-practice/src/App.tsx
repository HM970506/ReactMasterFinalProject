  import React from "react";

  import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
  import Home from "./Routes/Home";
  import Tv from "./Routes/Tv";
  import Search from "./Routes/Search";
  import Header from "./Components/Header";

  //헤더 아웃렛으로 들어가야되지 않어?
function App(){
  return(
    <Router>
    <Header/>
      <Routes>
        <Route path="/tv" element={<Tv/>} />
        <Route path="/Search" element={<Search/>} />
        <Route path="/*" element={<Home/>} />
        <Route path="/movies/:movieId" element={<Home/>} />
      </Routes>
    </Router>
  );
}

export default App;