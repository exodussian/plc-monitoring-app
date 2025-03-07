import { useState, useEffect } from 'react';
import Head from 'next/head';
import { connectToMqtt, subscribeToPLCData, disconnectFromMqtt } from '../lib/mqtt';

export default function Services() {
  const [mqttSettings, setMqttSettings] = useState({
    broker: 'localhost',
    port: '1883',
    topic: 'plc/values',
    clientId: `PLCWebClient_${Math.random().toString(16).substr(2, 8)}`
  });
  
  const [plcSettings, setPlcSettings] = useState({
    ipAddress: '192.168.1.10',
    rack: '0',
    slot: '1',
    dbNumber: '1',
    scanRate: '1'
  });

  const [mqttStatus, setMqttStatus] = useState({
    connected: false,
    lastMessageTime: null
  });
  
  const handleMqttChange = (e) => {
    const { name, value } = e.target;
    setMqttSettings(prev => ({ ...prev, [name]: value }));
  };
  
  const handlePlcChange = (e) => {
    const { name, value } = e.target;
    setPlcSettings(prev => ({ ...prev, [name]: value }));
  };
  
  const handleMqttSubmit = (e) => {
    e.preventDefault();
    alert('MQTT settings saved!');
  };
  
  const handlePlcSubmit = (e) => {
    e.preventDefault();
    alert('PLC settings saved!');
  };

  useEffect(function() {
    var timeoutId;
    var unsubscribe;

    function checkMqttConnection() {
      connectToMqtt();

      unsubscribe = subscribeToPLCData(function(data) {
        setMqttStatus({
          connected: true,
          lastMessageTime: new Date()
        });
      });

      timeoutId = setTimeout(function() {
        if (!mqttStatus.lastMessageTime || 
            (new Date() - mqttStatus.lastMessageTime > 10000)) {
          setMqttStatus({
            connected: false,
            lastMessageTime: null
          });
        }
      }, 3000);

      return function() {
        if (timeoutId) clearTimeout(timeoutId);
        if (unsubscribe) unsubscribe();
        disconnectFromMqtt();
      };
    }

    return checkMqttConnection();
  }, [mqttStatus.lastMessageTime]);

  var styles = {
    container: {
      padding: '24px',
      fontFamily: 'Arial, sans-serif'
    },
    heading: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#111827',
      marginBottom: '24px'
    },
    cardGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '24px',
      marginBottom: '24px'
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      overflow: 'hidden'
    },
    cardHeader: {
      display: 'flex',
      alignItems: 'center',
      padding: '16px',
      backgroundColor: '#f0f9ff',
      borderBottom: '1px solid #e0f2fe'
    },
    cardIcon: {
      color: '#0284c7',
      marginRight: '8px',
      fontSize: '20px'
    },
    cardTitle: {
      fontSize: '18px',
      fontWeight: '500',
      color: '#0c4a6e'
    },
    cardBody: {
      padding: '16px'
    },
    formGroup: {
      marginBottom: '16px'
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '500',
      color: '#374151',
      marginBottom: '8px'
    },
    input: {
      width: '100%',
      padding: '12px',
      border: '1px solid #d1d5db',
      borderRadius: '4px',
      fontSize: '14px'
    },
    inputRow: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '16px'
    },
    button: {
      width: '100%',
      backgroundColor: '#0284c7',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      padding: '12px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      marginTop: '8px'
    },
    statusGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '16px',
      marginBottom: '16px'
    },
    statusCard: {
      padding: '16px',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      backgroundColor: '#f0fdf4'
    },
    disconnectedStatusCard: {
      backgroundColor: '#fff0f0',
      border: '1px solid #ffcccc'
    },
    statusIndicator: {
      display: 'flex',
      alignItems: 'center'
    },
    statusDot: {
      height: '12px',
      width: '12px',
      borderRadius: '50%',
      backgroundColor: '#22c55e',
      marginRight: '8px'
    },
    disconnectedStatusDot: {
      backgroundColor: '#ff4444'
    },
    statusLabel: {
      fontWeight: '500',
      color: '#166534'
    },
    statusDesc: {
      fontSize: '14px',
      color: '#6b7280',
      marginTop: '8px'
    }
  };
  
  return (
    <>
      <Head>
        <title>Services | PLC Monitoring System</title>
        <meta name="description" content="Configure PLC and MQTT services" />
      </Head>
      
      <div style={styles.container}>
        <h2 style={styles.heading}>Services Configuration</h2>
        
        <div style={styles.cardGrid}>
          {/* MQTT Settings */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <span style={styles.cardIcon}>⚙️</span>
              <h3 style={styles.cardTitle}>MQTT Broker Settings</h3>
            </div>
            
            <form onSubmit={handleMqttSubmit} style={styles.cardBody}>
              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="broker">Broker Address</label>
                <input
                  id="broker"
                  name="broker"
                  type="text"
                  value={mqttSettings.broker}
                  onChange={handleMqttChange}
                  style={styles.input}
                  placeholder="localhost or IP address"
                  required
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="port">Port</label>
                <input
                  id="port"
                  name="port"
                  type="text"
                  value={mqttSettings.port}
                  onChange={handleMqttChange}
                  style={styles.input}
                  placeholder="1883"
                  required
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="topic">Topic</label>
                <input
                  id="topic"
                  name="topic"
                  type="text"
                  value={mqttSettings.topic}
                  onChange={handleMqttChange}
                  style={styles.input}
                  placeholder="plc/values"
                  required
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="clientId">Client ID</label>
                <input
                  id="clientId"
                  name="clientId"
                  type="text"
                  value={mqttSettings.clientId}
                  onChange={handleMqttChange}
                  style={styles.input}
                  placeholder="Client ID"
                  required
                />
              </div>
              
              <button type="submit" style={styles.button}>
                Save MQTT Settings
              </button>
            </form>
          </div>
          
          {/* PLC Settings */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <span style={styles.cardIcon}>🖥️</span>
              <h3 style={styles.cardTitle}>PLC Connection Settings</h3>
            </div>
            
            <form onSubmit={handlePlcSubmit} style={styles.cardBody}>
              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="ipAddress">IP Address</label>
                <input
                  id="ipAddress"
                  name="ipAddress"
                  type="text"
                  value={plcSettings.ipAddress}
                  onChange={handlePlcChange}
                  style={styles.input}
                  placeholder="192.168.1.10"
                  required
                />
              </div>
              
              <div style={{...styles.formGroup, ...styles.inputRow}}>
                <div>
                  <label style={styles.label} htmlFor="rack">Rack</label>
                  <input
                    id="rack"
                    name="rack"
                    type="text"
                    value={plcSettings.rack}
                    onChange={handlePlcChange}
                    style={styles.input}
                    placeholder="0"
                    required
                  />
                </div>
                
                <div>
                  <label style={styles.label} htmlFor="slot">Slot</label>
                  <input
                    id="slot"
                    name="slot"
                    type="text"
                    value={plcSettings.slot}
                    onChange={handlePlcChange}
                    style={styles.input}
                    placeholder="1"
                    required
                  />
                </div>
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="dbNumber">DB Number</label>
                <input
                  id="dbNumber"
                  name="dbNumber"
                  type="text"
                  value={plcSettings.dbNumber}
                  onChange={handlePlcChange}
                  style={styles.input}
                  placeholder="1"
                  required
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="scanRate">Scan Rate (ms)</label>
                <input
                  id="scanRate"
                  name="scanRate"
                  type="text"
                  value={plcSettings.scanRate}
                  onChange={handlePlcChange}
                  style={styles.input}
                  placeholder="1"
                  required
                />
              </div>
              
              <button type="submit" style={styles.button}>
                Save PLC Settings
              </button>
            </form>
          </div>
        </div>
        
        {/* System Status Section */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <span style={styles.cardIcon}>📊</span>
            <h3 style={styles.cardTitle}>System Status</h3>
          </div>
          
          <div style={styles.cardBody}>
            <div style={styles.statusGrid}>
              <div style={{
                ...styles.statusCard,
                ...(mqttStatus.connected ? {} : styles.disconnectedStatusCard)
              }}>
                <div style={styles.statusIndicator}>
                  <div style={{
                    ...styles.statusDot,
                    ...(mqttStatus.connected ? {} : styles.disconnectedStatusDot)
                  }}></div>
                  <span style={styles.statusLabel}>
                    MQTT Connection
                  </span>
                </div>
                <div style={styles.statusDesc}>
                  {mqttStatus.connected ? 'Connected to broker' : 'Disconnected'}
                </div>
              </div>
              
              <div style={styles.statusCard}>
                <div style={styles.statusIndicator}>
                  <div style={styles.statusDot}></div>
                  <span style={styles.statusLabel}>PLC Connection</span>
                </div>
                <div style={styles.statusDesc}>Connected to PLC</div>
              </div>
              
              <div style={{...styles.statusCard, backgroundColor: '#eff6ff'}}>
                <div style={styles.statusIndicator}>
                  <div style={{...styles.statusDot, backgroundColor: '#3b82f6'}}></div>
                  <span style={{...styles.statusLabel, color: '#1e40af'}}>Data Processing</span>
                </div>
                <div style={styles.statusDesc}>Processing rate: 1000 values/sec</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}