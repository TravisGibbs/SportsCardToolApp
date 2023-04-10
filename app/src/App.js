import React from "react";
 
import { Route, Routes } from "react-router-dom";
 
import Navbar from "./components/navbar";
import RecordList from "./components/recordList";
import Edit from "./components/edit";
 
const App = () => {
 return (
   <div>
     <Navbar />
     <Routes>
       <Route exact path="/" element={<RecordList />} />
       <Route path="/edit/:id" element={<Edit />} />
     </Routes>
   </div>
 );
};
 
export default App;