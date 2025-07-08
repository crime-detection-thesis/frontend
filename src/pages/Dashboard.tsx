// src/pages/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { getMetrics, getEventsOverTime, getEventsByState, getEventsByCamera,
         type Metrics, type Point, type StateSlice, type CameraSlice } from '../api/dashboard';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';                              // o la librería que prefieras
import Card from '../components/Card';
import Loader from '../components/Loader';
import { Legend, LabelList } from 'recharts';

const STATE_COLORS: Record<string,string> = {
    Confirmado:    '#10A37F',
    'Falso positivo': '#DC2626',
    Pendiente:     '#FBBF24',
  };

const Dashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [overTime, setOverTime] = useState<Point[]>([]);
  const [byState, setByState] = useState<StateSlice[]>([]);
  const [byCamera, setByCamera] = useState<CameraSlice[]>([]);

  useEffect(() => {
    getMetrics().then(setMetrics);
    getEventsOverTime(30).then(setOverTime);
    getEventsByState().then(setByState);
    getEventsByCamera(10).then(setByCamera);
  }, []);

  if (!metrics) {
    return (
      <div className="min-h-screen bg-gray-800 text-gray-300">
        <Navbar />
        <Loader className="p-6 h-64" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-800 text-gray-300">
      <Navbar />
      <main className="p-6 space-y-6">
        <h1 className="text-2xl text-white font-semibold">Dashboard</h1>

        {/* Métricas clave */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card title="Total Cámaras">{metrics.total_cameras}</Card>
          <Card title="Cámaras Activas (24h)">{metrics.active_cameras}</Card>
          <Card title="Total Eventos">{metrics.total_events}</Card>
          <Card title="Pendientes">{metrics.pending_events}</Card>
          <Card title="Confirmados">{metrics.confirmed_events}</Card>
          <Card title="Falsos Positivos">{metrics.false_positives}</Card>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Eventos por día */}
          <Card title="Eventos en 30 días">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart 
                data={overTime} 
                margin={{ top: 30, right: 20, left: 0, bottom: 5 }}
              >
                <XAxis dataKey="date" tick={{fill: '#D1D5DB'}}/>
                <YAxis 
                  tick={{fill: '#D1D5DB'}}
                  domain={[0, 'dataMax + 1']}
                />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#10A37F" 
                  dot={false} 
                >
                  <LabelList 
                    dataKey="count"
                    position="top"
                    fill="#E5E7EB"
                    style={{ 
                      fontSize: '0.75rem',
                      fontWeight: 'bold'
                    }}
                  />
                </Line>
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Distribución por estado */}
          <Card title="Estados de eventos">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Legend verticalAlign="bottom" align="center" />
                <Pie
                  data={byState}
                  dataKey="count"
                  nameKey="state"
                  outerRadius={80}
                  label
                >
                  {byState.map(slice => (
                    <Cell
                      key={slice.state}
                      fill={STATE_COLORS[slice.state] ?? '#8884d8'}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Eventos por cámara */}
        <Card title="Top 10 Cámaras por eventos">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={byCamera} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="camera" tick={{fill: '#D1D5DB'}}/>
              <YAxis tick={{fill: '#D1D5DB'}}/>
              <Tooltip />
              <Bar dataKey="count" fill="#10A37F">
                <LabelList 
                  dataKey="count" 
                  position="top"
                  fill="#E5E7EB"
                  style={{ fontSize: '0.875rem', fontWeight: 'bold' }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
