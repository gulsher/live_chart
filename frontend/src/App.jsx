import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

function App() {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState('seconds'); // 'seconds', 'minutes', 'hours'

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8080'); // Your WebSocket server URL

    socket.onopen = () => console.log('✅ WebSocket connected');
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      const newPoint = {
        timestamp: message.timestamp,
        time: new Date(message.timestamp).toLocaleTimeString(),
        minute: new Date(message.timestamp).toLocaleTimeString([], { minute: '2-digit', second: '2-digit' }),
        hour: new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        value: parseFloat(message.value),
      };

      setData((prev) => {
        const updatedData = [...prev, newPoint];

        // Optional: Limit total data points to prevent memory overflow
        return updatedData.slice(-5000);
      });
    };

    socket.onerror = (error) => console.error('❌ WebSocket error:', error);
    socket.onclose = () => console.log('❌ WebSocket disconnected');

    return () => socket.close();
  }, []);

  // Filter data based on selected interval
  const getFilteredData = () => {
    const now = new Date();
    switch (filter) {
      case 'seconds':
        return data.slice(-60);
      case 'minutes':
        const last60Minutes = now.getTime() - 60 * 60 * 1000;
        return aggregateData(data, 'minute', last60Minutes);
      case 'hours':
        const last12Hours = now.getTime() - 12 * 60 * 60 * 1000;
        return aggregateData(data, 'hour', last12Hours);
      default:
        return data;
    }
  };

  // Helper function to aggregate data by time unit (minute or hour)
  const aggregateData = (data, timeKey, threshold) => {
    const filtered = data.filter((d) => new Date(d.timestamp).getTime() > threshold);
    const grouped = filtered.reduce((acc, item) => {
      if (!acc[item[timeKey]]) {
        acc[item[timeKey]] = { time: item[timeKey], value: item.value, count: 1 };
      } else {
        acc[item[timeKey]].value += item.value;
        acc[item[timeKey]].count += 1;
      }
      return acc;
    }, {});

    return Object.values(grouped).map((item) => ({
      time: item.time,
      value: item.value / item.count, // Average value per time unit
    }));
  };

  return (
    <div style={{ width: '100%', height: '500px', padding: '20px' }}>
      <h1 className="text-xl font-bold mb-4">Real-Time Data Chart (WebSocket + Filter)</h1>

      {/* Dropdown Filter */}
      <div style={{ marginBottom: '10px' }}>
        <label htmlFor="filter">View data by: </label>
        <select id="filter" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="seconds">Last 60 Seconds</option>
          <option value="minutes">Last 60 Minutes (Averaged per Minute)</option>
          <option value="hours">Last 12 Hours (Averaged per Hour)</option>
        </select>
      </div>

      {/* Line Chart */}
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={getFilteredData()}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default App;
