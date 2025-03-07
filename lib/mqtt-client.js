import mqtt from 'mqtt';

let client = null;
let isConnected = false;
const listeners = [];

export const connectToMqtt = (brokerUrl = 'ws://localhost:9001') => {
  if (client && isConnected) return;
  
  try {
    client = mqtt.connect(brokerUrl);
    
    client.on('connect', () => {
      console.log('Connected to MQTT broker');
      isConnected = true;
      client.subscribe('plc/values');
    });
    
    client.on('message', (topic, message) => {
      try {
        const data = JSON.parse(message.toString());
        listeners.forEach(listener => listener(data));
      } catch (error) {
        console.error('Error parsing MQTT message:', error);
      }
    });
    
    client.on('error', (error) => {
      console.error('MQTT connection error:', error);
      isConnected = false;
    });
    
    client.on('close', () => {
      console.log('MQTT connection closed');
      isConnected = false;
    });
  } catch (error) {
    console.error('Failed to connect to MQTT broker:', error);
  }
};

export const disconnectFromMqtt = () => {
  if (client && isConnected) {
    client.end();
    isConnected = false;
    console.log('Disconnected from MQTT broker');
  }
};

export const subscribeToPLCData = (callback) => {
  if (typeof callback === 'function') {
    listeners.push(callback);
    return () => {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }
  return () => {};
};
