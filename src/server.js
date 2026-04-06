const express = require("express");
const cors = require("cors");
const mqttClient = require("./mqtt/client");

const app = express();

app.use(cors());
app.use(express.json());

// teste básico
app.get("/", (req, res) => {
  res.send("Backend rodando");
});

// enviar comando para dispositivo
app.post("/device/toggle", (req, res) => {
  const { id, status } = req.body;

  const topic = `devices/${id}/set`;

  mqttClient.publish(topic, JSON.stringify({ status }));

  console.log("📤 Enviado:", id, status);

  res.json({ ok: true });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log("🚀 Backend rodando");
});
