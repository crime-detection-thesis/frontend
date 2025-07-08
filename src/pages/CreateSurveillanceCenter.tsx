import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegistration } from '../contexts/RegistrationContext';
import { useAuth } from '../contexts/AuthContext';
import { createSurveillanceCenter } from '../api/surveillance';
import Button from '../components/Button';
import FormContainer from '../components/FormContainer';
import {
    GoogleMap,
    useLoadScript,
} from '@react-google-maps/api';

// ← Definiciones estáticas FUERA del componente
const LIBRARIES = ['marker'] as const;
const MAP_OPTIONS: google.maps.MapOptions = {
    mapId: import.meta.env.VITE_GOOGLE_MAPS_MAP_ID,
};
const containerStyle = { width: '100%', height: '400px' };
const initialCenter = { lat: -12.046374, lng: -77.042793 };

export default function CreateSurveillanceCenter() {
    const { pending } = useRegistration();
    const { register } = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [markerPos, setMarkerPos] = useState<google.maps.LatLngLiteral | null>(null);

    // refs para mapa y marcador
    const mapRef = useRef<google.maps.Map | undefined>(undefined);
    const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);

    // carga la API de Google Maps, incluida la librería marker
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries: [...LIBRARIES], // Convert to mutable array
    });

    // Cada vez que cambie markerPos, limpiamos el viejo y creamos el nuevo
    useEffect(() => {
        if (!mapRef.current) return;

        // elimina marcador previo
        if (markerRef.current) {
            markerRef.current.map = null;
            markerRef.current = null;
        }

        // crea uno nuevo si hay posición
        if (markerPos) {
            markerRef.current = new google.maps.marker.AdvancedMarkerElement({
                map: mapRef.current,
                position: markerPos,
                title: name || 'Centro',
            });
        }
    }, [markerPos, name]);

    if (!pending) {
        navigate('/register');
        return null;
    }

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
            // asegúrate de haber actualizado/migrado tu modelo para FloatField o DecimalField más ancho
            const { data: center } = await createSurveillanceCenter(
              name,
              markerPos.lat,
              markerPos.lng
            );
            await register({
                email: pending.email,
                username: pending.username,
                password: pending.password,
                surveillance_center_id: center.id,
            });
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
      <FormContainer title="Crear Centro de Vigilancia">
          <form onSubmit={handleCreate}>
              {/* Nombre */}
              <div className="mb-4">
                  <label htmlFor="name" className="block mb-1">
                      Nombre del Centro
                  </label>
                  <input
                    id="name"
                    type="text"
                    className="w-full border rounded p-2"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
              </div>

              {/* Mapa */}
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
                    <p className="mt-2">
                        Lat: {markerPos.lat.toFixed(6)}, Lng: {markerPos.lng.toFixed(6)}
                    </p>
                  )}
              </div>

              {/* Botones */}
              <div className="flex space-x-2 mt-4">
                  <Button
                    type="button"
                    text="Volver"
                    className="bg-gray-500 hover:bg-gray-600"
                    onClick={() => navigate('/select-surveillance-center')}
                  />
                  <Button
                    type="submit"
                    text="Crear y registrar"
                    className="bg-blue-500 hover:bg-blue-600"
                  />
              </div>
          </form>
      </FormContainer>
    );
}


