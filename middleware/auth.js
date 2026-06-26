const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Get token from header
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({ msg: 'No hay token, autorización denegada' });
  }

  // Token format should be: Bearer <token>
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ msg: 'Formato de token inválido' });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_minecraft_secret_key_123!@#');
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'El token no es válido' });
  }
};
