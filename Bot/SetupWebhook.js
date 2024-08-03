const axios = require('axios');

const TOKEN = '7091294846:AAE6GIm2_YsHjqjYBAWhe8hwIDRw5aa47Qs';
const URL = 'https://apecomtest12.vercel.app/webhook';

axios.get(`https://api.telegram.org/bot${TOKEN}/setWebhook?url=${URL}`)
  .then(response => {
    if (response.data.ok) {
      console.log('Webhook set successfully');
    } else {
      console.log('Error setting webhook:', response.data);
    }
  })
  .catch(error => {
    console.error('Error setting webhook:', error);
  });
