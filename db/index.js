// const pgp = require('pg-promise')(); // Import pg-promise and initialize it

// const connection = 
//     "postgresqql://postgres:123456@localhost:5432/DACN";

// const db = pgp(connection); // Creating a database instance

// // Now you can use the 'db' object to execute queries
// module.exports = db;

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://vxitllncvfyiozcpfzgs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4aXRsbG5jdmZ5aW96Y3BmemdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTYzODQzMjYsImV4cCI6MjAzMTk2MDMyNn0.a088hUhrFv8bLkro2PLpkkpscCnsRDKu7nKXu5r2BRo';

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;