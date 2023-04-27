import React, {useEffect, useState} from 'react';
import Box from '@mui/material/Box';

import LinearProgress from '@mui/material/LinearProgress';

const parse = require('html-react-parser');

export default function News(props) {
  const [currentNews, setCurrentNews] = useState(null);
 
  useEffect(() => {
    async function fetchNews() {
      if (props.short_names.length > 0) {
        
        const response = await fetch("https://www.espn.com/search/_/q/rafael%20devers", {
          "headers": {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "accept-language": "en-US,en;q=0.9",
            "cache-control": "max-age=0",
            "if-modified-since": "Thu, 27 Apr 2023 18:14:03 GMT",
            "sec-ch-ua": "\"Chromium\";v=\"112\", \"Google Chrome\";v=\"112\", \"Not:A-Brand\";v=\"99\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "same-origin",
            "sec-fetch-user": "?1",
            "upgrade-insecure-requests": "1"
          },
          referrer: "https://www.espn.com/",
          referrerPolicy: 'strict-origin-when-cross-origin',
          body: null,
          method: 'GET',
          mode: 'cors',
          credentials: 'omit',
        });

        let data = await response.text
        
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