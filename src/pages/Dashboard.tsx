import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';
import Card from '../components/Card';
import { useAuth } from '../contexts/AuthContext';
import {
  getMetrics,
  getEventsOverTime,
  getEventsByState,
  getEventsByCamera,
  type Metrics,
  type Point,
  type StateSlice,
  type CameraSlice
} from '../api/dashboard';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  LabelList,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar
} from 'recharts';

const STATE_COLORS: Record<string, string> = {
  Confirmado:     '#22C55E',
  'Falso positivo': '#F87171',
  Pendiente:      '#FBBF24',
};


const Dashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [overTime, setOverTime] = useState<Point[]>([]);
  const [byState, setByState] = useState<StateSlice[]>([]);
  const [byCamera, setByCamera] = useState<CameraSlice[]>([]);
  const { surveillanceCenterId } = useAuth();

  useEffect(() => {
    if (surveillanceCenterId > 0) {
      Promise.all([
        getMetrics(surveillanceCenterId).then(setMetrics),
        getEventsOverTime(surveillanceCenterId, 30).then(setOverTime),
        getEventsByState(surveillanceCenterId).then(setByState),
        getEventsByCamera(surveillanceCenterId, 10).then(setByCamera),
      ]).catch(console.error);
    }
  }, [surveillanceCenterId]);

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

      <main className="p-6">

        <div className="grid grid-cols-6 gap-3 mb-6">
          <div><Card title="Total Cámaras" className="p-3 text-sm">{metrics.total_cameras}</Card></div>
          <div><Card title="Activas (24 h)" className="p-3 text-sm">{metrics.active_cameras}</Card></div>
          <div><Card title="Total Alertas" className="p-3 text-sm">{metrics.total_events}</Card></div>
          <div><Card title="Pendientes" className="p-3 text-sm">{metrics.pending_events}</Card></div>
          <div><Card title="Confirmadas" className="p-3 text-sm">{metrics.confirmed_events}</Card></div>
          <div><Card title="Falsos Positivos" className="p-3 text-sm">{metrics.false_positives}</Card></div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <Card title="Alertas en 30 días" className="p-4">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={overTime} margin={{ top: 20, right: 10, left: 0, bottom: 5 }}>
                <XAxis dataKey="date" tick={{ fill: '#D1D5DB', fontSize: 12 }} />
                <YAxis tick={{ fill: '#D1D5DB', fontSize: 12 }} domain={[0, 'dataMax + 1']} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#10A37F" dot={false}>
                  <LabelList dataKey="count" position="top" fill="#E5E7EB" style={{ fontSize: 10 }} />
                </Line>
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card title="Estados de Alertas" className="p-4">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Legend verticalAlign="bottom" align="center" iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                <Pie
                  data={byState}
                  dataKey="count"
                  nameKey="state"
                  outerRadius={70}
                  innerRadius={30}
                  labelLine={false}
                  label={({ name, percent }: { name: string; percent?: number }) =>
                    `${name} ${percent !== undefined ? Math.round(percent * 100) : 0}%`
                  }
                >
                  {byState.map(slice => (
                    <Cell key={slice.state} fill={STATE_COLORS[slice.state] ?? '#8884d8'} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `${value}`} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <Card title="Top 10 Cámaras con más Alertas" className="p-4 w-full">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={byCamera}
              layout="vertical"
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <XAxis
                type="number"
                tick={{ fill: '#D1D5DB', fontSize: 16 }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                dataKey="camera"
                type="category"
                width={160}
                tickFormatter={str => String(str).replace(/ /g, '\u00A0')}
                tick={{ fill: '#D1D5DB', fontSize: 14 }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip cursor={{ fill: 'rgba(255,255,255,0.1)' }} />

              <Bar
                dataKey="count"
                fill="#10A37F"
                barSize={20}
                radius={[0, 10, 10, 0]}
              >
                <LabelList
                  dataKey="count"
                  position="right"
                  fill="#E5E7EB"
                  style={{ fontSize: 16, fontWeight: 'bold' }}
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
