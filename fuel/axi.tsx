import axios from 'axios';

axios.get('https://www.bbc.com/')
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error(error);
  });