// Load environment variables
require('dotenv').config();

// Import necessary modules
const express = require('express');
const bodyParser = require('body-parser');
const { createClient } = require('@supabase/supabase-js');

// Initialize the Supabase client with your project URL and Anon Key
const supabaseUrl = 'https://ptxcoguihwewlfhcopdb.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY; // Ensure the Anon Key is stored securely in an .env file
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Initialize the Express app
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Serve the static HTML file
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/login.html');
});

// Handle form submission and store email details in Supabase
app.post('/send-email', async (req, res) => {
  const { fullname, email, message } = req.body;

  try {
    const { data, error } = await supabase
      .from('emails')
      .insert([{ fullname, email, message }]);
      console.log('Received data:', { fullname, email, message });
    if (error) {
      console.error('Error storing email in database:', error.message); // Log the error message
      return res.status(500).send('Error storing email in database.');
    }

    res.status(200).send('Email details stored successfully!');
  } catch (err) {
    console.error('Error processing request:', err);
    res.status(500).send('Error processing request.');
  }
});



// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
