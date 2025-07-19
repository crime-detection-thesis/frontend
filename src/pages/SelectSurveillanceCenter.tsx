import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../contexts/AuthContext';
import { completeRegistration } from '../api/auth';
import { type Center, getSurveillanceCenters } from '../api/surveillance';
import Button from '../components/Button';
import FormContainer from '../components/FormContainer';

export default function SelectSurveillanceCenter() {
  const [centers, setCenters] = useState<Center[]>([]);
  const [selectedId, setSelectedId] = useState<number | ''>('');
  const { logout, refreshCurrentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    getSurveillanceCenters()
      .then(r => setCenters(r.data))
      .catch(() => alert('Error cargando centros'));
  }, []);

  const onContinue = async () => {
    if (!selectedId) return alert('Selecciona un centro');
    try {
      await completeRegistration(selectedId).then(async () => {
        console.log('selectedId', selectedId);
        await refreshCurrentUser();
        navigate('/dashboard', { replace: true });
      });
    } catch {
      alert('Error completando registro');
    }
  };

  return (
    <FormContainer title="Selecciona o crea un centro">
      <select
        className="w-full border border-gray-300 bg-white p-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent text-gray-800"
        value={selectedId}
        onChange={e => setSelectedId(e.target.value === '' ? '' : Number(e.target.value))}
      >
        <option value="">-- Elige un centro --</option>
        {centers.map(c => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      <div className="flex flex-col gap-3 mt-6">
        <Button 
          type="button" 
          text={selectedId ? 'Finalizar registro' : 'Crear nuevo centro'}
          variant="primary"
          onClick={selectedId ? onContinue : () => navigate('/create-surveillance-center')}
          className="w-full py-2.5 text-base"
        />
        <Button 
          type="button"
          text="Cancelar"
          variant="secondary"
          onClick={() => logout()}
          className="w-full py-2.5 text-base"
        />
      </div>
    </FormContainer>
  );
}
