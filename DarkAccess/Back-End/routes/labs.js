const express = require("express");
const router = express.Router();

router.post("/start", (req, res) => {
  const { challengeId } = req.body;
  const VM_PUBLIC_IP = process.env.VM_PUBLIC_IP || "localhost";

  const urls = {
    xss: `http://${VM_PUBLIC_IP}:8080`,
    so: `http://${VM_PUBLIC_IP}:8081`
  };

  if (!urls[challengeId])
    return res.status(400).json({ success: false, message: "Lab não encontrado." });

  res.json({
    success: true,
    sessionId: "fixed",
    url: urls[challengeId]
  });
});

router.post("/stop", (req, res) => {
  res.json({ success: true, message: "Ambiente encerrado." });
});

module.exports = router;
