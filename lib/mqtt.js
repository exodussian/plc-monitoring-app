import mqtt from 'mqtt';

let client = null;
let isConnected = false;
const listeners = [];

// Daha fazla debug bilgisi için console.log ekleyelim
export const connectToMqtt = (brokerUrl = 'mqtt://localhost:1883') => {
  console.log("Attempting to connect to MQTT broker at:", brokerUrl);
  
  if (client && isConnected) {
    console.log("Already connected to MQTT broker");
    return;
  }
  
  try {
    // Not: WebSocket port (9001) yerine MQTT port (1883) kullanılıyor
    client = mqtt.connect(brokerUrl, {
      keepalive: 60,
      reconnectPeriod: 1000, // Daha hızlı yeniden bağlanma
      connectTimeout: 10000,
      clean: true
    });
    
    console.log("MQTT client created, waiting for connect event");
    
    client.on('connect', () => {
      console.log('✅ Connected to MQTT broker successfully');
      isConnected = true;
      client.subscribe('plc/values', (err) => {
        if (err) {
          console.error('❌ Error subscribing to topic:', err);
        } else {
          console.log('✅ Subscribed to plc/values topic');
        }
      });
    });
    
    client.on('message', (topic, message) => {
      console.log(`Received message on topic: ${topic}`);
      try {
        const data = JSON.parse(message.toString());
        console.log('Parsed data, notifying listeners');
        listeners.forEach(listener => listener(data));
      } catch (error) {
        console.error('❌ Error parsing MQTT message:', error);
      }
    });
    
    client.on('error', (error) => {
      console.error('❌ MQTT connection error:', error);
      isConnected = false;
    });
    
    client.on('close', () => {
      console.log('MQTT connection closed');
      isConnected = false;
    });
    
    client.on('reconnect', () => {
      console.log('🔄 Attempting to reconnect to MQTT broker...');
    });
    
    client.on('offline', () => {
      console.log('MQTT client went offline');
      isConnected = false;
    });
  } catch (error) {
    console.error('❌ Failed to create MQTT client:', error);
  }
};

export const disconnectFromMqtt = () => {
  if (client) {
    console.log('Disconnecting from MQTT broker');
    client.end(true);
    isConnected = false;
    console.log('Disconnected from MQTT broker');
  }
};

export const subscribeToPLCData = (callback) => {
  console.log('Adding new MQTT data listener');
  
  if (typeof callback === 'function') {
    listeners.push(callback);
    return () => {
      console.log('Removing MQTT data listener');
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }
  return () => {};
};