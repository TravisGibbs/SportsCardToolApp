import React, {useEffect, useState} from 'react';
import Box from '@mui/material/Box';

import LinearProgress from '@mui/material/LinearProgress';

const parse = require('html-react-parser');


export default function Sales(props) {
    const [currentPoint, setCurrentPoint] = React.useState(null);

    useEffect(() => {
        async function fetchPoint() {
          if (props.names.length > 0) {
            const searchTerm = (
                props.set_alt.trim() +
              '%2B' +
                props.names.join('%2B')
            ).replace(/ /g, '%2B');
            const response = await fetch('https://back.130point.com/sales/', {
              headers: {
                accept: '*/*',
                'accept-language': 'en-US,en;q=0.9',
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'sec-ch-ua':
                  '"Chromium";v="112", "Google Chrome";v="112", "Not:A-Brand";v="99"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-site',
              },
              referrer: 'https://130point.com/',
              referrerPolicy: 'strict-origin-when-cross-origin',
              body: 'query=' + searchTerm + '&type=2&subcat=-1',
              method: 'POST',
              mode: 'cors',
              credentials: 'omit',
            });
    
            if (!response.ok) {
              const message = `An error has occurred: ${response.statusText}`;
              window.alert(message);
              return;
            }
    
            let data = await response.text();
    
            const entries = data.split('var offerData =').splice(1);
    
            entries.forEach(_element => {
              // TODO: Finding best offers requires pinging another access point indvidually refrain from doing so for now?
              // const sale_data = JSON.parse(element.split(";")[0])
              // data = data.replace("<b>Best Offer Sale - Loading Actual Sold Price</b>", '<b>Sale Price:</b> <span class="bidLink" style="color: green; font-weight: bold; text-decoration-line: underline; background-color: lightgreen;">'+sale_data["2"]+sale_data["3"]+'</span>')
              data = data.replace(' - Loading Actual Sold Price', '');
            });
    
            setCurrentPoint(parse(data));
          }
        }
    
        fetchPoint();
    
        return;
      },  [props.names, props.set_alt]);


      return (
        <div>
            {currentPoint ? (
                currentPoint
            ) : (
                <Box sx={{width: '100%'}}>
                <LinearProgress />
                </Box>
            )}
          </div>
      )
    
}