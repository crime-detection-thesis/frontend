import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';
import Card from '../components/Card';
import StyledSelect from '../components/StyledSelect';
import Button from '../components/Button';
import { useAuth } from '../contexts/AuthContext';
import {
  getMetrics,
  getEventsOverTime,
  getEventsByState,
  getEventsByCamera,
  type Metrics,
  type Point,
  type StateSlice,
  type CameraSlice,
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
import { getUsersByCenter } from '../api/user';

// adapta tu tipo Option (si quieres) para react‑select:
interface RSOption { value: number; label: string; }

const STATE_COLORS: Record<string, string> = {
  Confirmado:     '#22C55E',
  'Falso positivo': '#F87171',
  Pendiente:      '#FBBF24',
};

const Dashboard: React.FC = () => {
  const { surveillanceCenterId, isAdmin } = useAuth();
  const [metrics, setMetrics]           = useState<Metrics | null>(null);
  const [overTime, setOverTime]         = useState<Point[]>([]);
  const [byState, setByState]           = useState<StateSlice[]>([]);
  const [byCamera, setByCamera]         = useState<CameraSlice[]>([]);

  const [users, setUsers]               = useState<RSOption[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<RSOption[]>([]);

  // 1) carga lista de usuarios
  useEffect(() => {
    if (isAdmin && surveillanceCenterId > 0) {
      getUsersByCenter(surveillanceCenterId)
        .then(list =>
          setUsers(
            // conviertes cada {id,username} a {value,label}
            list.map(u => ({ value: u.id, label: u.username }))
          )
        )
        .catch(console.error);
    }
  }, [isAdmin, surveillanceCenterId]);

  // función que recarga todo
  const fetchAll = () => {
    setMetrics(null);
    setOverTime([]);
    setByState([]);
    setByCamera([]);

    // convierte a números y filtra vacíos
    const userIds = isAdmin
      ? selectedUsers.map(u => u.value)
      : [];

    Promise.all([
      getMetrics(userIds).then(setMetrics),
      getEventsOverTime(30, userIds).then(setOverTime),
      getEventsByState(userIds).then(setByState),
      getEventsByCamera(10, userIds).then(setByCamera),
    ]).catch(console.error);
  };

  // primera carga
  useEffect(() => {
    if (surveillanceCenterId > 0) fetchAll();
  }, [surveillanceCenterId]);

  return (
    <div className="min-h-screen bg-gray-800 text-gray-300">
      <Navbar />

      <main className="p-6">

        {/* 1) Sección de filtros siempre visible si es admin */}
        {isAdmin && (
      <div className="mb-6 flex items-center space-x-4">
        <div className="w-1/3">
        <StyledSelect
          options={users}
          value={selectedUsers}
          onChange={(value) => setSelectedUsers(value as RSOption[])}
          placeholder="Filtrar por usuario…"
        />
        </div>
        <div className="w-1/6">
          <Button
            type="button"
            onClick={fetchAll}
            text="Filtrar"
            variant="primary"
          />
        </div>
      </div>
    )}

        {/* 2) Loader o contenido, debajo de los filtros */}
        {!metrics ? (
          <Loader className="p-6 h-64" />
        ) : (
          <>
            <div className="grid grid-cols-6 gap-3 mb-6">
              <Card title="Total Cámaras" className="p-3 text-sm">
                {metrics.total_cameras}
              </Card>
              <Card title="Activas (24 h)" className="p-3 text-sm">
                {metrics.active_cameras}
              </Card>
              <Card title="Total Alertas" className="p-3 text-sm">
                {metrics.total_events}
              </Card>
              <Card title="Pendientes" className="p-3 text-sm">
                {metrics.pending_events}
              </Card>
              <Card title="Confirmadas" className="p-3 text-sm">
                {metrics.confirmed_events}
              </Card>
              <Card title="Falsos Positivos" className="p-3 text-sm">
                {metrics.false_positives}
              </Card>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <Card title="Alertas en 30 días" className="p-4">
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={overTime} margin={{ top: 20, right: 10, left: 0, bottom: 5 }}>
                    <XAxis dataKey="date" tick={{ fill: '#D1D5DB', fontSize: 14 }} />
                    <YAxis tick={{ fill: '#D1D5DB', fontSize: 14 }} domain={[0, 'dataMax + 1']} />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="#10A37F" dot={false}>
                      <LabelList dataKey="count" position="top" fill="#E5E7EB" style={{ fontSize: 12 }} />
                    </Line>
                  </LineChart>
                </ResponsiveContainer>
              </Card>

              <Card title="Estados de Alertas" className="p-4">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Legend verticalAlign="bottom" align="center" iconType="circle" wrapperStyle={{ fontSize: 16 }} />
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
              <ResponsiveContainer width="100%" height={500}>
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
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
