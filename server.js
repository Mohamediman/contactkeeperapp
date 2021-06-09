const express = require('express');


const app = express();

app.get('/', (req, res) => res.json({msg: 'Welcome to our Contact Keeper API....' }))

//=== Define Routes

app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/contacts', require('./routes/contact'));

const PORT = process.env.port || 5000;

app.listen(PORT, () => console.log(`The app is running on Port ${PORT}`));