import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { connectToMqtt, subscribeToPLCData, disconnectFromMqtt } from '../lib/mqtt';

const PLCDataDisplay = () => {
  const [plcData, setPlcData] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [updateInterval, setUpdateInterval] = useState(null);
  const [selectedRange, setSelectedRange] = useState('top100');
  
  const [updateMetrics, setUpdateMetrics] = useState({
    totalUpdates: 0,
    averageInterval: 0,
    minInterval: Infinity,
    maxInterval: 0
  });

  const lastUpdateTimeRef = useRef(null);

  // Performansı artırmak için memoize edilmiş filtreleme
  const filteredData = useMemo(() => {
    if (!plcData || !plcData.Rows) return [];
    
    let rows = plcData.Rows;
    
    switch (selectedRange) {
      case 'top10': return rows.slice(0, 10);
      case 'top50': return rows.slice(0, 50);
      case 'top100': return rows.slice(0, 100);
      default: return rows.slice(0, 500);
    }
  }, [plcData, selectedRange]);

  const styles = {
    container: {
      padding: '24px',
      fontFamily: 'Arial, sans-serif',
      maxWidth: '1200px',
      margin: '0 auto'
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '24px',
      color: '#333'
    },
    controls: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px',
      flexWrap: 'wrap',
      gap: '12px'
    },
    gridViewButton: {
      padding: '8px 16px',
      borderRadius: '4px',
      border: 'none',
      cursor: 'pointer',
      backgroundColor: '#007bff',
      color: 'white',
      fontWeight: '500'
    },
    select: {
      padding: '8px 12px',
      borderRadius: '4px',
      border: '1px solid #ddd',
      marginLeft: '10px'
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      marginBottom: '24px',
      overflow: 'hidden'
    },
    cardHeader: {
      padding: '16px',
      borderBottom: '1px solid #eee',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    cardTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#333'
    },
    updateMetricsContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '12px',
      backgroundColor: '#f8f9fa',
      flexWrap: 'wrap',
      gap: '10px'
    },
    metricItem: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    },
    gridContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      padding: '16px',
      gap: '12px'
    },
    gridItem: {
      flex: '1 1 calc(20% - 12px)',
      minWidth: '150px',
      backgroundColor: '#f4f4f4',
      borderRadius: '8px',
      padding: '16px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    progressContainer: {
      width: '100%',
      height: '8px',
      backgroundColor: '#e0e0e0',
      borderRadius: '4px',
      overflow: 'hidden',
      marginTop: '12px'
    },
    progressBar: {
      height: '100%'
    },
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '300px',
      backgroundColor: 'white',
      border: '1px solid #eee',
      borderRadius: '8px'
    }
  };

  useEffect(() => {
    let isMounted = true;
    let dummyInterval = null;
    
    const updateIntervalMetrics = (newInterval) => {
      setUpdateMetrics(prevMetrics => {
        const totalUpdates = prevMetrics.totalUpdates + 1;
        const newAverageInterval = 
          (prevMetrics.averageInterval * prevMetrics.totalUpdates + newInterval) / totalUpdates;
        
        return {
          totalUpdates,
          averageInterval: newAverageInterval,
          minInterval: Math.min(prevMetrics.minInterval, newInterval),
          maxInterval: Math.max(prevMetrics.maxInterval, newInterval)
        };
      });
    };
    
    const generateDummyData = () => {
      if (isMounted) {
        const currentTime = new Date();
        
        const newData = {
          Rows: Array(100).fill(0).map((_, index) => ({
            index,
            value: Math.floor(Math.random() * 1000)
          })),
          LastUpdate: currentTime
        };
        
        if (lastUpdateTimeRef.current) {
          const interval = currentTime - lastUpdateTimeRef.current;
          setUpdateInterval(interval);
          updateIntervalMetrics(interval);
        }
        
        lastUpdateTimeRef.current = currentTime;
        setPlcData(newData);
        setLastUpdate(currentTime);
      }
    };
    
    connectToMqtt();
    
    const unsubscribe = subscribeToPLCData((data) => {
      if (isMounted) {
        const currentTime = new Date();
        
        if (lastUpdateTimeRef.current) {
          const interval = currentTime - lastUpdateTimeRef.current;
          setUpdateInterval(interval);
          updateIntervalMetrics(interval);
        }
        
        lastUpdateTimeRef.current = currentTime;
        setPlcData(data);
        setLastUpdate(currentTime);
      }
    });
    
    const timeout = setTimeout(() => {
      if (isMounted && !plcData) {
        dummyInterval = setInterval(generateDummyData, 1000);
      }
    }, 2000); // 5 saniye yerine 2 saniye
    
    return () => {
      isMounted = false;
      clearTimeout(timeout);
      if (dummyInterval) clearInterval(dummyInterval);
      unsubscribe();
      disconnectFromMqtt();
    };
  }, []); 
  
  if (!plcData) {
    return (
      <div style={styles.loadingContainer}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            border: '4px solid #007bff',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p>Connecting to MQTT broker and waiting for data...</p>
          <style jsx>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }
  
  const getProgressBarColor = (value) => {
    if (value < 300) return '#28a745'; // Yeşil
    if (value < 600) return '#ffc107'; // Sarı
    return '#dc3545'; // Kırmızı
  };
  
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Live PLC Data Monitor</h2>
      
      <div style={styles.controls}>
        <button style={styles.gridViewButton}>
          Grid View
        </button>
        
        <div>
          <span>Show:</span>
          <select 
            value={selectedRange}
            onChange={e => setSelectedRange(e.target.value)}
            style={styles.select}
          >
            <option value="all">All Values</option>
            <option value="top10">Top 10</option>
            <option value="top50">Top 50</option>
            <option value="top100">Top 100</option>
          </select>
        </div>
      </div>
      
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h3 style={styles.cardTitle}>
            PLC Data Values
            {updateInterval != null && (
              <span style={{ marginLeft: '10px', color: '#6c757d' }}>
                (Last Update: {Math.round(updateInterval)} ms)
              </span>
            )}
          </h3>
          <div style={{ color: '#6c757d' }}>
            Last Updated: {lastUpdate.toLocaleTimeString()}
          </div>
        </div>
        
        <div style={styles.updateMetricsContainer}>
          <div style={styles.metricItem}>
            <strong>Total Updates</strong>
            <span>{updateMetrics.totalUpdates}</span>
          </div>
          <div style={styles.metricItem}>
            <strong>Avg Interval</strong>
            <span>{updateMetrics.averageInterval.toFixed(2)} ms</span>
          </div>
          <div style={styles.metricItem}>
            <strong>Min Interval</strong>
            <span>
              {updateMetrics.minInterval === Infinity 
                ? 'N/A' 
                : updateMetrics.minInterval.toFixed(2)} ms
            </span>
          </div>
          <div style={styles.metricItem}>
            <strong>Max Interval</strong>
            <span>{updateMetrics.maxInterval.toFixed(2)} ms</span>
          </div>
        </div>
        
        <div style={styles.gridContainer}>
          {filteredData.map(item => {
            const percentage = Math.min((item.value / 1000) * 100, 100);
            const progressColor = getProgressBarColor(item.value);
            
            return (
              <div key={item.index} style={styles.gridItem}>
                <div style={{ fontSize: '14px', color: '#6c757d' }}>
                  Index: {item.index}
                </div>
                <div style={{ 
                  fontSize: '20px', 
                  fontWeight: 'bold', 
                  marginBottom: '12px' 
                }}>
                  {item.value}
                </div>
                
                <div style={styles.progressContainer}>
                  <div 
                    style={{
                      ...styles.progressBar,
                      width: `${percentage}%`,
                      backgroundColor: progressColor
                    }}
                  ></div>
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  fontSize: '12px', 
                  color: '#6c757d', 
                  marginTop: '4px' 
                }}>
                  <span>0</span>
                  <span>1000</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PLCDataDisplay;