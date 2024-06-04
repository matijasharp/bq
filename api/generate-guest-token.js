const jwt = require('jsonwebtoken');
const axios = require('axios');

module.exports = async (req, res) => {
  const { userID, meetingID, role } = req.body;

  try {
    // Verify if the user can be a moderator
    if (role === 'moderator') {
      const response = await axios.get(`https://api.airtable.com/v0/your_base_id/Meetings?filterByFormula=AND({MeetingID}='${meetingID}', {Organizator}='${userID}')`, {
        headers: { Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}` }
      });

      if (response.data.records.length === 0) {
        return res.status(403).json({ error: 'User not authorized to be a moderator' });
      }
    }

    const payload = {
      meetingID,
      role
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Error generating token' });
  }
};
