const jwt = require('jsonwebtoken');

module.exports = async (req, res) => {
  const { userID, userName, userAvatar, userEmail, meetingID, isModerator } = req.body;

  const payload = {
    aud: "jitsi",
    context: {
      user: {
        id: userID,
        name: userName,
        avatar: userAvatar,
        email: userEmail,
        moderator: isModerator ? "true" : "false"
      },
      features: {
        livestreaming: "true",
        recording: "true"
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
};
