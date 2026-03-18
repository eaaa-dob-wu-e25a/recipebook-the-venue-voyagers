require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json()); // Middleware to parse JSON bodies
app.use(cors()); // Enable CORS for all routes

app.get('/', (req, res) => {
    res.send('Hello from our server');
})

app.get('/recipes', (req, res) => {
    // Stub data for now
    res.status(200).json({ 
        "recipes":[        
            {
                id: 1,
                name: 'Spaghetti Bolognese',
                cuisine: 'Italian',
                ingredients: ['spaghetti', 'ground beef', 'tomato sauce'],
                body: 'Cook spaghetti according to package instructions. In a separate pan, brown the ground beef and add tomato sauce. Combine and serve.',
                time: '30 minutes'
            },
            {
                id: 2,
                name: 'Chicken Curry',
                cuisine: 'Indian',
                ingredients: ['chicken', 'curry powder', 'coconut milk'],
                body: 'Season the chicken with curry powder and cook until golden. Add coconut milk and simmer until the chicken is tender.',
                time: '45 minutes'
            }
        ],
        "total": 2,
        "page": 1,
    })
})

app.listen(process.env.PORT || 8080, () => {
    console.log('server listening on port ' + (process.env.PORT || 8080))
})