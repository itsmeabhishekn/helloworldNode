const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const signupRouter = require('./routes/signup');
const loginRouter = require('./routes/login');

const app = express();
const port = process.env.PORT || 8000;

connectDB();

app.use(cors({ origin: 'http://localhost:4200' }));

app.use(express.json());

app.use('/api', signupRouter);
app.use('/api', loginRouter);

app.listen(port, () => console.log(`Server listening on port ${port}`));
