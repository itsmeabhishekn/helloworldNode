const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
    const decodedToken = jwt.verify(token, 'nekot');
    req.userId = decodedToken.id;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authenticateUser;
