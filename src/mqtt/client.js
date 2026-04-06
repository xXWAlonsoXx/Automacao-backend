const mqtt = require("mqtt");
const { db } = require("../config/firebaseAdmin");

const client = mqtt.connect({
  host: process.env.MQTT_HOST,
  port: 8883,
  protocol: "mqtts",
  username: process.env.MQTT_USER,
  password: process.env.MQTT_PASS
});

client.on("connect", () => {
  console.log("✅ MQTT conectado (backend)");

  client.subscribe("devices/+/status");
});

client.on("message", async (topic, message) => {
  try {
    const data = JSON.parse(message.toString());
    const id = topic.split("/")[1];

    console.log("📩 Status recebido:", id, data);

    await db.collection("devices").doc(id).set({
      status: data.status,
      updatedAt: new Date()
    }, { merge: true });

  } catch (err) {
    console.error("Erro ao processar mensagem MQTT:", err);
  }
});

module.exports = client;
