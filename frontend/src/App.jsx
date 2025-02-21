import  { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';

function App() {
  const [data, setData] = useState([]);
  const [timeFilter, setTimeFilter] = useState('60s');

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8080'); // Replace with your WebSocket URL

    socket.onmessage = (event) => {
      const newDataPoint = JSON.parse(event.data);
      newDataPoint.timestamp = new Date().getTime();
      setData((prevData) => [...prevData, newDataPoint]);
    };

    return () => socket.close();
  }, []);

  const filteredData = data.filter((d) => {
    const now = Date.now();
    const timeDiff = (now - d.timestamp) / 1000;

    if (timeFilter === '60s') return timeDiff <= 60;
    if (timeFilter === '60m') return timeDiff <= 3600;
    if (timeFilter === '12h') return timeDiff <= 43200;

    return true;
  });

  const getOption = () => ({
    title: {
      text: 'Live Data Chart',
    },
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: ['Line Speed', 'Capacitance', 'RPM' , 'cold OD Average', 'Hot OD Average' , 'masterRatio' , 'screwRPM', 'coldDiameterX', 'coldDiameterY'],
    },
    xAxis: {
      type: 'category',
      data: filteredData.map((d) => new Date(d.timestamp).toLocaleTimeString()),
    },
    yAxis: {
      type: 'value',
    },
    dataZoom: [
      {
        type: 'slider',
        xAxisIndex: 0,
        start: 0,
        end: 100,
      },
      {
        type: 'inside',
        xAxisIndex: 0,
        start: 0,
        end: 100,
      },
    ],
    series: [
      {
        name: 'Line Speed',
        type: 'line',
        data: filteredData.map((d) => d.lineSpeed),
      },
      {
        name: 'Capacitance',
        type: 'line',
        data: filteredData.map((d) => d.capacitance),
      },
      {
        name: 'RPM',
        type: 'line',
        data: filteredData.map((d) => d.screwRPM),
      },
      
      {
        name: 'cold OD Average',
        type: 'line',
        data: filteredData.map((d) => d.coldODAverage),
      },
      {
        name: 'Hot OD Average',
        type: 'line',
        data: filteredData.map((d) => d.hotODAverage),
      },
      {
        name: 'masterRatio',
        type: 'line',
        data: filteredData.map((d) => d.masterRatio),
      },
      {
        name: 'screwRPM',
        type: 'line',
        data: filteredData.map((d) => d.screwRPM),
      },
      {
        name: 'coldDiameterX',
        type: 'line',
        data: filteredData.map((d) => d.coldDiameterY),
      },
      {
        name: 'coldDiameterY',
        type: 'line',
        data: filteredData.map((d) => d.coldDiameterY),
      },
    ],
  });

  return (
    <div>
      <div>
        <button onClick={() => setTimeFilter('60s')}>Last 60s</button>
        <button onClick={() => setTimeFilter('60m')}>Last 60m</button>
        <button onClick={() => setTimeFilter('12h')}>Last 12h</button>
      </div>
      <ReactECharts option={getOption()} style={{ height: '500px' }} />
    </div>
  );
}

export default App;
