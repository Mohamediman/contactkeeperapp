const express = require('express');
const { stat } = require('fs');
const path = require('path');

const dbConnect = require('./config/db');

const app = express();

dbConnect();
//initialize the Middleware
app.use(express.json({ extended: false }));

//=== Define Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/contacts', require('./routes/contact'));

//====Check if the environment 
if(process.env.NODE__ENV === 'production'){
    //==== Set the static folder
    app.use(express.static('client/build'));

    app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html')));
}

const PORT = process.env.port || 5000;

app.listen(PORT, () => console.log(`The app is running on Port ${PORT}`));