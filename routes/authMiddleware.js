const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    console.log('No token found');
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
    console.log('Token:', token);
    const decodedToken = jwt.verify(token, 'nekot');
    console.log('Decoded Token:', decodedToken);
    req.userId = decodedToken.id;
    next();
  } catch (error) {
    console.error('Token Verification Error:', error);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authenticateUser;
