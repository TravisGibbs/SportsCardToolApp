import React, {useEffect, useState} from 'react';
import Box from '@mui/material/Box';

import LinearProgress from '@mui/material/LinearProgress';

const parse = require('html-react-parser');

export default function News(props) {
  const [currentNews, setCurrentNews] = useState(null);
 
  useEffect(() => {
    async function fetchNews() {
      if (props.short_names.length > 0) {
        

        let data = "<div>Placeholder</div>"
        
        setCurrentNews(parse(data));
      }
    }

    fetchNews();

    return;
  }, [props.short_names]);


  return (
    <div>
      {currentNews ? (
        currentNews
      ) : (
        <Box sx={{width: '100%'}}>
          <LinearProgress />
        </Box>
      )}
    </div>
  );
}