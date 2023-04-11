import React from "react";
 
import { Route, Routes } from "react-router-dom";
import GlobalStyles from '@mui/material/GlobalStyles';

import Navbar from "./components/navbar";
import RecordList from "./components/recordList";
import Edit from "./components/edit";
 
const App = () => {
 return (
   <div>
     <GlobalStyles
        styles={{
          '*::-webkit-scrollbar': {
            width: '0.4em',
          },
          '*::-webkit-scrollbar-track': {
            '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)',
          },
          '*::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,.1)',
            outline: '1px solid slategrey',
          },
        }}
      />
     <Navbar />
     <Routes>
       <Route exact path="/" element={<RecordList />} />
       <Route path="/edit/:id" element={<Edit />} />
     </Routes>
   </div>
 );
};
 
export default App;