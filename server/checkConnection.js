require('dotenv').config();
console.log('Environment variables:');
console.log('MONGODB_URI:', process.env.MONGODB_URI);
console.log('NODE_ENV:', process.env.NODE_ENV);

// Parse the connection string
if (process.env.MONGODB_URI) {
  const uri = process.env.MONGODB_URI;
  console.log('\nConnection string analysis:');
  console.log('Full URI:', uri);
  
  // Extract database name
  const dbMatch = uri.match(/\/([^?]+)/);
  if (dbMatch) {
    console.log('Database name from URI:', dbMatch[1]);
  }
}