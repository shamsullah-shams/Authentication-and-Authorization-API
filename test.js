
const accountSid = 'AC62a4b9c2c6f1e5effc288a1115e20e49';
const authToken = 'f8a51b8b8e32d881bbe13a9ab742539d';



const client = require('twilio')(accountSid, authToken);

client.messages
    .create({
        to: '+93703973893',
        from: '+19785749045',
        body: 'Hi from shamsullah',
    })
    .then(message => console.log(message)).catch(eror => console.log(eror));