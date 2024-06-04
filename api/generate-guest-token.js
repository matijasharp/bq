const jwt = require('jsonwebtoken');
const axios = require('axios');

module.exports = async (req, res) => {
  const { userID, userName, userAvatar, userEmail, meetingID, role } = req.body;

  try {
    if (role === 'moderator') {
      const response = await axios.get(`https://api.airtable.com/v0/your_base_id/Meetings?filterByFormula=AND({MeetingID}='${meetingID}', {Organizator}='${userID}')`, {
        headers: { Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}` }
      });

      if (response.data.records.length === 0) {
        return res.status(403).json({ error: 'User not authorized to be a moderator' });
      }
    }

    const payload = {
      aud: "jitsi",
      context: {
        user: {
          id: userID,
          name: userName,
          avatar: userAvatar,
          email: userEmail,
          moderator: role === "moderator" ? "true" : "false"
        }
      },
      iss: "chat",
      sub: "vpaas-magic-cookie-fa27b48785ce4d90b6d28ab2c649d8f4",
      room: "*", // or specify the room name
      exp: Math.floor(Date.now() / 1000) + (60 * 60), // 1 hour expiration
      nbf: Math.floor(Date.now() / 1000)
    };

    const header = {
      alg: "RS256",
      kid: "vpaas-magic-cookie-1fc542a3e4414a44b2611668195e2bfe/4f4910",
      typ: "JWT"
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { header });

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Error generating token' });
  }
};
