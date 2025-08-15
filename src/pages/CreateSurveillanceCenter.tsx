import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../contexts/AuthContext';
import { createSurveillanceCenter } from '../api/surveillance';
import { completeRegistration } from '../api/auth';
import Button from '../components/Button';
import FormContainer from '../components/FormContainer';
import PageTitle from '../components/PageTitle';
import {
    GoogleMap,
    useLoadScript,
} from '@react-google-maps/api';

const LIBRARIES = ['marker'] as const;
const MAP_OPTIONS: google.maps.MapOptions = {
    mapId: import.meta.env.VITE_GOOGLE_MAPS_MAP_ID,
};
const containerStyle = { width: '100%', height: '400px', borderRadius: '0.5rem' };
const initialCenter = { lat: -12.046374, lng: -77.042793 };

export default function CreateSurveillanceCenter() {
    const { refreshCurrentUser } = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [markerPos, setMarkerPos] = useState<google.maps.LatLngLiteral | null>(null);

    const mapRef = useRef<google.maps.Map | undefined>(undefined);
    const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries: [...LIBRARIES], // Convert to mutable array
    });

    useEffect(() => {
        if (!mapRef.current) return;

        if (markerRef.current) {
            markerRef.current.map = null;
            markerRef.current = null;
        }

        if (markerPos) {
            markerRef.current = new google.maps.marker.AdvancedMarkerElement({
                map: mapRef.current,
                position: markerPos,
                title: name || 'Centro',
            });
        }
    }, [markerPos, name]);

    const handleMapClick = (e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
            setMarkerPos({
                lat: e.latLng.lat(),
                lng: e.latLng.lng(),
            });
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !markerPos) {
            return alert('Debe dar un nombre y seleccionar ubicación en el mapa.');
        }
        try {
            const { data: center } = await createSurveillanceCenter(
              name,
              markerPos.lat,
              markerPos.lng
            );
            await completeRegistration(center.id);
            await refreshCurrentUser();
            navigate('/dashboard', { replace: true });
        } catch (err: unknown) {
            console.error(err);
            if (
              typeof err === 'object' &&
              err !== null &&
              'response' in err &&
              typeof (err as { response?: { data?: string } }).response === 'object'
            ) {
              alert(
                (err as { response?: { data?: string } }).response?.data ||
                  'Error creando o registrando. Revisa consola.'
              );
            } else {
              alert('Error creando o registrando. Revisa consola.');
            }
        }
    };

    if (loadError) return <p>Error cargando mapa</p>;
    if (!isLoaded) return <p>Cargando mapa...</p>;

    return (
      <>
        <PageTitle title="Crear Centro de Vigilancia" />
        <FormContainer title="Crear Centro de Vigilancia">
          <form onSubmit={handleCreate}>
              <div className="mb-4">
                  <label htmlFor="name" className="block mb-1">
                      Nombre del Centro
                  </label>
                  <input
                    id="name"
                    type="text"
                    className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
              </div>

              <div className="mb-4">
                  <label className="block mb-1">
                      Selecciona ubicación (clic en el mapa):
                  </label>
                  <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={initialCenter}
                    zoom={12}
                    options={MAP_OPTIONS}
                    onLoad={(map) => { mapRef.current = map; }}
                    onClick={handleMapClick}
                  />
                  {markerPos && (
                    <p className="mt-2 text-sm text-gray-400">
                        Lat: {markerPos.lat.toFixed(6)}, Lng: {markerPos.lng.toFixed(6)}
                    </p>
                  )}
              </div>

              <div className="flex space-x-2 mt-4">
                  <Button
                    type="button"
                    text="Volver"
                    variant="secondary"
                    onClick={() => navigate('/select-surveillance-center')}
                  />
                  <Button
                    type="submit"
                    text="Finalizar registro"
                    variant="primary"
                  />
              </div>
          </form>
      </FormContainer>
      </>
    );
}


