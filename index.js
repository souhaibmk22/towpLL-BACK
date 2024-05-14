const express = require('express');
const mongoose = require('mongoose');
const UserModel = require('./model/user_model');
const router = require('./routers/user_router.js')
const app = express();
const port = 5000; // Change the port number to 3000

app.use(express.json());
app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.use('/', router);

// Update the connection string with your IP address
mongoose.connect(`mongodb+srv://ouby:ouby2004@towpall.6zhkshp.mongodb.net/?retryWrites=true&w=majority&appName=towpall`)
.then(() => {
  console.log("Connected to MongoDB successfully");
}).catch((error) => {
  console.log("Error connecting to MongoDB:", error);
});

app.listen(port, () => {
  console.log(`Server listening on port http://192.168.165.209:${port}`);
});
// 192.168.33.209