// const pgp = require('pg-promise')(); // Import pg-promise and initialize it

// const connection =
//     "postgresqql://postgres:123456@localhost:5432/DACN";

// const db = pgp(connection); // Creating a database instance

// // Now you can use the 'db' object to execute queries
// module.exports = db;

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
