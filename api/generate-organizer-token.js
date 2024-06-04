const jwt = require('jsonwebtoken');

module.exports = async (req, res) => {
  const { userID, meetingID } = req.body;

  const payload = {
    userID,
    meetingID,
    role: 'organizer'
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.status(200).json({ token });
};
