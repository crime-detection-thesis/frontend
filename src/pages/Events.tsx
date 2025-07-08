import React, { useState, useEffect, useRef } from 'react';
import Loader from '../components/Loader';
import Navbar from '../components/Navbar';
import {
  getCrimeImageDetail,
  updateCrimeImages,
  type CrimeImage
} from '../api/crimeImages';
import { getStatuses, type Status } from '../api/status';
import { getCameras } from '../api/camera';
import type { Camera } from '../interfaces/camera.interface';
import Button from '../components/Button';
import Select from '../components/Select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getCrimes, getCrimeDetail, updateCrimeStatus, type GetCrimesParams, type PaginatedResponse } from '../api/crime';
import type { Crime } from '../interfaces/crime.interface';

const Events: React.FC = () => {
  const [crimes, setCrimes] = useState<Crime[]>([]);
  const [modalImages, setModalImages] = useState<CrimeImage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [confirmedStatusId, setConfirmedStatusId] = useState<number>(2);
  const [falsePositiveStatusId, setFalsePositiveStatusId] = useState<number>(3);
  const CONFIRMED_STATUS_NAME = 'Confirmado';
  const FALSE_POSITIVE_STATUS_NAME = 'Falso positivo';
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [filters, setFilters] = useState({ 
    cameraId: '', 
    startDate: '', 
    endDate: '',
    statusId: '' 
  });
  const [appliedFilters, setAppliedFilters] = useState<GetCrimesParams>({ 
    cameraId: '', 
    startDate: '', 
    endDate: '',
    statusId: '' 
  });
  // Estado para rastrear qué imágenes deben mostrar las cajas
  const [imagesWithBoxes, setImagesWithBoxes] = useState<Record<string, boolean>>({});
  // justo al inicio de tu componente Events:
  const canvasRefs = useRef<Record<string, HTMLCanvasElement>>({});
  const [pendingStatuses, setPendingStatuses] = useState<Record<string, { status_id: number; description: string }>>({});

  // Estados y funciones para el modal de edición de eventos
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [selectedCrimeDetail, setSelectedCrimeDetail] = useState<Crime | null>(null);
  const [editForm, setEditForm] = useState<{ statusId: string; description: string }>({ statusId: '', description: '' });
  const [currentCrimeId, setCurrentCrimeId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;  // igual que en tu PAGE_SIZE de DRF

  // Lógica de paginación truncada
  const totalPages = Math.ceil(totalCount / pageSize);
  const siblingCount = 2;
  const paginationRange: (number | string)[] = [];
  if (totalPages > 0) {
    paginationRange.push(1);
    if (page - siblingCount > 2) paginationRange.push('…');
    for (let p = Math.max(2, page - siblingCount); p <= Math.min(totalPages - 1, page + siblingCount); p++) {
      paginationRange.push(p);
    }
    if (page + siblingCount < totalPages - 1) paginationRange.push('…');
    if (totalPages > 1) paginationRange.push(totalPages);
  }

  const openEditModal = async (id: string) => {
    try {
      const detail = await getCrimeDetail(id);
      setCurrentCrimeId(Number(id));
      setSelectedCrimeDetail(detail);
      setEditForm({ statusId: String(detail.status_id), description: (detail as any).description ?? '' });
      setIsEditModalOpen(true);
    } catch (error) {
      console.error('Error al cargar detalles de evento:', error);
    }
  };

  const saveEventChanges = async () => {
    if (!selectedCrimeDetail) return;
    await updateCrimeStatus(
      String(selectedCrimeDetail.id),
      Number(editForm.statusId),
      editForm.description
    );
    setCrimes(prev => prev.map(c => c.id === selectedCrimeDetail.id ? { ...c, status_id: Number(editForm.statusId), description: editForm.description } : c));
    setIsEditModalOpen(false);
  };

  
  // Función para alternar la visibilidad de las cajas de una imagen específica
  const toggleBoxes = (imageId: string) => {
    setImagesWithBoxes(prev => ({
      ...prev,
      [imageId]: !prev[imageId]
    }));
  };

const drawBoxes = (
    canvas: HTMLCanvasElement,
    image: HTMLImageElement,
    detections: { box: number[] }[]
  ) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
  
    // 1) Tamaños
    const dispW = canvas.width;
    const dispH = canvas.height;
    const natW  = image.naturalWidth;
    const natH  = image.naturalHeight;
  
    // 2) Limpiar
    ctx.clearRect(0, 0, dispW, dispH);
    ctx.imageSmoothingEnabled = false;
  
    // 3) Calcular letter-box
    const imgRatio       = natW / natH;
    const canvasRatio    = dispW / dispH;
    let drawW: number,
        drawH: number,
        offsetX: number,
        offsetY: number;
  
    if (imgRatio > canvasRatio) {
      // la imagen llena todo el ancho, barras arriba/abajo
      drawW   = dispW;
      drawH   = dispW / imgRatio;
      offsetX = 0;
      offsetY = (dispH - drawH) / 2;
    } else {
      // la imagen llena todo el alto, barras a los lados
      drawH   = dispH;
      drawW   = dispH * imgRatio;
      offsetX = (dispW - drawW) / 2;
      offsetY = 0;
    }
  
    // 4) Dibujar cada caja, escalando sólo sobre drawW×drawH y desplazando por offset
    detections.forEach(b => {
      const scaleX = drawW / natW;
      const scaleY = drawH / natH;
  
      const x = offsetX + b.box[0] * scaleX;
      const y = offsetY + b.box[1] * scaleY;
      const w = (b.box[2] - b.box[0]) * scaleX;
      const h = (b.box[3] - b.box[1]) * scaleY;
  
      // Fondo blanco grueso
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.lineWidth   = 8;
      ctx.strokeRect(x, y, w, h);
  
      // Borde exterior negro
      ctx.strokeStyle = '#000000';
      ctx.lineWidth   = 6;
      ctx.strokeRect(x, y, w, h);
  
      // Borde principal brillante
      ctx.strokeStyle = '#00FF00';
      ctx.lineWidth   = 3;
      ctx.strokeRect(x, y, w, h);
  
      // Relleno semitransparente
      ctx.fillStyle   = 'rgba(0, 255, 0, 0.1)';
      ctx.fillRect(x, y, w, h);
    });
  };

  // Cargar datos iniciales
  useEffect(() => {
    getStatuses().then(statuses => {
      const foundConfirmedId = statuses.find(s => s.name === CONFIRMED_STATUS_NAME)?.id ?? 2;
      setConfirmedStatusId(foundConfirmedId);

      const foundFpId = statuses.find(s => s.name === FALSE_POSITIVE_STATUS_NAME)?.id ?? 3;
      setFalsePositiveStatusId(foundFpId);
      setStatuses(statuses);
    });
    getCameras().then(setCameras);
  }, []);

  useEffect(() => {
    console.log('confirmedStatusId', confirmedStatusId);
    console.log('falsePositiveStatusId', falsePositiveStatusId);
  }, [confirmedStatusId, falsePositiveStatusId]);

  // Cargar crímenes cuando se apliquen los filtros
  useEffect(() => {
    setLoading(true);
    getCrimes({
      cameraId: appliedFilters.cameraId,
      startDate: appliedFilters.startDate,
      endDate: appliedFilters.endDate,
      statusId: appliedFilters.statusId,
      page,
      page_size: pageSize
    })
    .then((data: PaginatedResponse<Crime>) => {
        setCrimes(data.results);
        setTotalCount(data.count);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error al cargar crímenes:', error);
      })
      .finally(() => setLoading(false));
  }, [appliedFilters, page]);

  // Función para aplicar los filtros
  const applyFilters = () => {
    // Asegurarse de que las fechas estén en el formato correcto
    const formattedFilters: GetCrimesParams = {
      ...filters,
      startDate: filters.startDate || undefined,
      endDate: filters.endDate || undefined,
      cameraId: filters.cameraId || undefined,
      statusId: filters.statusId || undefined
    };
    setAppliedFilters(formattedFilters);
    setPage(1);
  };

  const updateStatus = (id: string, newStatusId: number, desc?: string) => {
    setPendingStatuses(prev => ({
      ...prev,
      [id]: {
        status_id: newStatusId,
        description: desc ?? prev[id]?.description ?? ''
      }
    }));
  };

  const saveAllStatuses = async () => {
    const updates = Object.entries(pendingStatuses).map(([id, { status_id, description }]) => ({
      id: Number(id),
      status_id,
      description
    }));
    if (updates.length === 0) return;
    await updateCrimeImages(updates);
    const imageStatuses = Object.values(pendingStatuses).map(u => u.status_id);
    if (currentCrimeId) {
      let newStatus: number | undefined;
      if (imageStatuses.some(s => s === confirmedStatusId)) {
        newStatus = confirmedStatusId;
      } else if (imageStatuses.length > 0 && imageStatuses.every(s => s === falsePositiveStatusId)) {
        newStatus = falsePositiveStatusId;
      }
      if (newStatus !== undefined) {
        setCrimes(prev => prev.map(c => c.id === currentCrimeId ? { ...c, status_id: newStatus } : c));
      }
    }
    setPendingStatuses({});
    setModalImages([]);
  }; 

  const openModal = async (id: string) => {
    try {
      const detail = await getCrimeImageDetail(id);
      setCurrentCrimeId(Number(id));
      console.log('Detalle de la imagen:', detail);
      // Si es necesario, convertir la respuesta a un array
      const images = Array.isArray(detail) ? detail : [detail];
      setModalImages(images);
      // Inicializar el estado de visibilidad de cajas para cada imagen
      const initialBoxesState = images.reduce((acc, img) => ({
        ...acc,
        [img.id]: false
      }), {});
      setImagesWithBoxes(initialBoxesState);
      // Inicializar pendingStatuses a partir de modalImages
      const initialPending: Record<string, { status_id: number; description: string }> = images.reduce((acc, img) => ({
        ...acc,
        [img.id]: { status_id: img.status_id, description: img.description }
      }), {} as Record<string, { status_id: number; description: string }>);
      setPendingStatuses(initialPending);
    } catch (error) {
      console.error('Error al cargar el detalle de la imagen:', error);
      // Opcional: Mostrar un mensaje de error al usuario
    }
  };

  // Efecto para inicializar el estado cuando se cargan las imágenes
  useEffect(() => {
    if (modalImages.length > 0) {
      const initialBoxesState = modalImages.reduce((acc, img) => ({
        ...acc,
        [img.id]: false
      }), {});

      setImagesWithBoxes(prev => ({
        ...initialBoxesState,
        ...prev
      }));
    }
  }, [modalImages]);

  const cameraOptions = [
    { label: 'Todos', value: '' },
    ...cameras.map(c => ({ label: c.name, value: String(c.id) }))
  ];
  const statusOptions = [
    { label: 'Todos', value: '' },
    ...statuses.map(s => ({ label: s.name, value: String(s.id) }))
  ];

  return (
    <div className="min-h-screen bg-gray-800 text-gray-300">
    <Navbar />  {/* aquí bg-gray-900 para destacar */}
    <main className="p-6 space-y-6">
      <h1 className="text-2xl text-white">Registro de Eventos</h1>
  
      {/* Filtros */}
<div className="bg-gray-700 p-4 rounded-lg shadow">
  <div className="grid 
                  grid-cols-1 
                  sm:grid-cols-2 
                  md:grid-cols-3 
                  lg:grid-cols-5 
                  gap-4 
                  items-end">
    {/* Cámara */}
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1">
        Cámara
      </label>
      <Select
        className="bg-gray-700 text-gray-300 w-full"
        options={cameraOptions}
        value={filters.cameraId}
        onChange={v => setFilters(f => ({ ...f, cameraId: v }))}
        placeholder="Todas"
      />
    </div>

    {/* Fecha Inicio */}
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1">
        Fecha Inicio
      </label>
      <DatePicker
        className="bg-gray-700 text-gray-300 border border-gray-600 rounded px-2 py-1 w-full"
        selected={filters.startDate ? new Date(filters.startDate + 'T00:00:00') : null}
        onChange={d => {
          if (!d) return;
          // Crear fecha local sin ajuste de zona horaria
          const localDate = new Date(d);
          const year = localDate.getFullYear();
          const month = String(localDate.getMonth() + 1).padStart(2, '0');
          const day = String(localDate.getDate()).padStart(2, '0');
          setFilters(f => ({ ...f, startDate: `${year}-${month}-${day}` }));
        }}
        placeholderText="Fecha inicio"
        dateFormat="yyyy-MM-dd"
        maxDate={filters.endDate ? new Date(filters.endDate) : undefined}
      />
    </div>

    {/* Fecha Fin */}
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1">
        Fecha Fin
      </label>
      <DatePicker
        className="bg-gray-700 text-gray-300 border border-gray-600 rounded px-2 py-1 w-full"
        selected={filters.endDate ? new Date(filters.endDate + 'T00:00:00') : null}
        onChange={d => {
          if (!d) return;
          // Crear fecha local sin ajuste de zona horaria
          const localDate = new Date(d);
          const year = localDate.getFullYear();
          const month = String(localDate.getMonth() + 1).padStart(2, '0');
          const day = String(localDate.getDate()).padStart(2, '0');
          setFilters(f => ({ ...f, endDate: `${year}-${month}-${day}` }));
        }}
        placeholderText="Fecha fin"
        dateFormat="yyyy-MM-dd"
        minDate={filters.startDate ? new Date(filters.startDate) : undefined}
      />
    </div>

    {/* Estado */}
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1">
        Estado
      </label>
      <Select
        className="bg-gray-700 text-gray-300 w-full"
        options={statusOptions}
        value={filters.statusId}
        onChange={v => setFilters(f => ({ ...f, statusId: v }))}
        placeholder="Todos"
      />
    </div>

    {/* Botón Filtrar: ocupa todo el ancho hasta lg, luego sólo su celda */}
    <div className="col-span-full lg:col-span-1">
      <Button
        type="button"
        text="Filtrar"
        variant="primary"
        className="w-full h-10 text-base font-medium"
        onClick={applyFilters}
      />
    </div>
  </div>
</div>
  
      {/* tabla */}
      <div className="overflow-x-auto bg-gray-700 rounded-lg shadow">
        {loading ? (
          <Loader className="p-8 h-56 w-full" message="Cargando eventos..." />
        ) : crimes.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <p className="text-lg">No se encontraron registros</p>
            <p className="text-sm mt-2">Intenta con otros criterios de búsqueda</p>
          </div>
        ) : (
          <>
          <table className="min-w-full">
            <thead className="bg-green-600 sticky top-0">
              <tr>
                <th className="p-3 text-white">Cámara</th>
                <th className="p-3 text-white">Descripción</th>
                <th className="p-3 text-white">Fecha y hora</th>
                <th className="p-3 text-white">Estado</th>
                <th className="p-3 text-white">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {crimes.map(i => (
                <tr key={i.id} className="border-b border-gray-700 hover:bg-gray-700">
                  <td className="p-2 text-center">{i.camera.name}</td>
                  <td className="p-2 text-center max-w-64">{i.description || 'Sin descripción'}</td>
                  <td className="p-2 text-center">{new Date(i.created_at).toLocaleString()}</td>
                  <td className="p-2 w-40 text-center">
                    <span className="px-2 py-1 bg-gray-600 rounded text-gray-100 text-sm">
                      {statuses.find(s => s.id === i.status_id)?.name || ''}
                    </span>
                  </td>
                  <td className="p-2 text-center">
                    <div className="flex justify-center gap-2">
                      <Button
                        type="button"
                        text="👁 Ver"
                        variant="secondary"
                        className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 text-white rounded border border-blue-400"
                        onClick={() => openModal(String(i.id))}
                      />
                      <Button
                        type="button"
                        text="✏️ Editar"
                        variant="secondary"
                        className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 text-white rounded border border-blue-400"
                        onClick={() => openEditModal(String(i.id))}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-center items-center space-x-3 mt-4">
            <Button type="button" text="‹" variant="success" onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1} />
            {paginationRange.map((item, idx) => (
              typeof item === 'string' ? (
                <span key={idx} className="px-2 text-gray-300">…</span>
              ) : (
                <Button
                  key={idx}
                  type="button"
                  text={item.toString()}
                  variant={item === page ? 'success' : 'secondary'}
                  onClick={() => setPage(item as number)}
                />
              )
            ))}
            <Button type="button" text="›" variant="success" onClick={() => setPage(p => Math.min(p + 1, Math.ceil(totalCount / pageSize)))} disabled={page * pageSize >= totalCount} />
          </div>
          </>
        )}
        </div>

        {/* modal */}
        {modalImages.length > 0 && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-start z-50 overflow-y-auto py-10" onClick={(e) => {
            // Cerrar el modal si se hace clic fuera del contenido
            if (e.target === e.currentTarget) {
              setModalImages([]);
            }
          }}>
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-6xl w-full relative my-8 mx-4" onClick={(e) => e.stopPropagation()}>
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl"
                onClick={() => setModalImages([])}
              >
                ×
              </button>
              
              {/* Título del modal */}
              <h2 className="text-xl font-bold text-white mb-6">Imágenes de la detección</h2>
                  
              
              {/* Lista de imágenes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {modalImages.map((img, imgIndex) => (
                  <div key={imgIndex} className="bg-gray-700 p-4 rounded-lg">
                    <div className="relative mb-4">
                      <div className="relative w-full h-64">
                        <div className="relative w-full h-full">
                          <img
                              src={img.image_url}
                              alt={`Detección ${imgIndex + 1}`}
                              className="w-full h-full object-contain rounded"
                              onLoad={(e) => {
                                const imgEl = e.currentTarget as HTMLImageElement;
                                const canvas = canvasRefs.current[img.id];
                                if (!canvas || !img.detections?.length) return;

                                // 1) Medir tamaño que ocupa la imagen en pantalla
                              //   const { width: dispW, height: dispH } = imgEl.getBoundingClientRect();
                              const rect = imgEl.getBoundingClientRect();
                              const dispW = Math.round(rect.width);
                              const dispH = Math.round(rect.height);

                                // 2) Ajustar canvas (CSS y sistema de coordenadas internas)
                                canvas.style.width  = `${dispW}px`;
                                canvas.style.height = `${dispH}px`;
                                canvas.width  = dispW;
                                canvas.height = dispH;

                                // 3) Dibujar cajas
                                drawBoxes(canvas, imgEl, img.detections);
                              }}
                            />

                            <canvas
                              ref={el => {
                                if (el) canvasRefs.current[img.id] = el;
                              }}
                              className="absolute top-0 left-0 pointer-events-none"
                              style={{
                                opacity: imagesWithBoxes[img.id] ? 1 : 0,
                                transition: 'opacity 0.2s'
                              }}
                            />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <p className="text-gray-300 text-sm">
                        <span className="font-medium">Hora:</span> {img.time}
                      </p>
                      
                      <div className="mb-2">
                        <textarea
                          className="w-full bg-gray-700 text-white p-2 rounded text-sm"
                          placeholder="Agregar descripción..."
                          value={pendingStatuses[img.id]?.description || ''}
                          onChange={(e) =>
                            setPendingStatuses(prev => ({
                              ...prev,
                              [img.id]: {
                                status_id: prev[img.id]?.status_id || img.status_id,
                                description: e.target.value
                              }
                            }))
                          }
                          rows={3}
                        />
                      </div>
                      
                      {img?.detections?.length > 0 && (
                        <div className="mt-2">
                          <h4 className="font-medium text-gray-200 mb-1">Detecciones:</h4>
                          <ul className="space-y-1">
                            {img.detections.map((box, boxIndex) => (
                              <li key={boxIndex} className="text-xs text-gray-400">
                                {box.label} (Confianza: {(box.confidence * 100).toFixed(1)}%)
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

<div className="flex flex-wrap items-center gap-4 pt-2 border-t border-gray-600">
                      <label className="flex items-center gap-2 text-gray-200">
                        <input
                          type="checkbox"
                          className="form-checkbox text-green-500"
                          checked={!!imagesWithBoxes[img.id]}
                          onChange={() => toggleBoxes(img.id)}
                        />
                        Mostrar cajas
                      </label>
                      <div className="flex-1" />
                      <Button
                        type="button"
                        text="Confirmado"
                        variant={(pendingStatuses[img.id]?.status_id ?? img.status_id) === confirmedStatusId ? 'success' : 'secondary'}
                        className="px-3 py-1 text-sm"
                        onClick={() => updateStatus(img.id.toString(), confirmedStatusId)}
                      />
                      <Button
                        type="button"
                        text="Falso positivo"
                        variant={(pendingStatuses[img.id]?.status_id ?? img.status_id) === falsePositiveStatusId ? 'danger' : 'secondary'}
                        className="px-3 py-1 text-sm"
                        onClick={() => updateStatus(img.id.toString(), falsePositiveStatusId)}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-4 mt-6">
                    <Button type="button" text="Guardar cambios" variant="primary" className="px-4 py-2" onClick={saveAllStatuses} />
                    <Button type="button" text="Cancelar" variant="secondary" className="px-4 py-2" onClick={() => setModalImages([])} />
                  </div>
            </div>
          </div>
        )}
        {isEditModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-start z-50 overflow-y-auto py-10" onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsEditModalOpen(false);
            }
          }}>
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full relative my-8 mx-4" onClick={(e) => e.stopPropagation()}>
              <button className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl" onClick={() => setIsEditModalOpen(false)}>×</button>
              <h2 className="text-xl font-bold text-white mb-4">Editar Evento</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300">Cámara</label>
                  <span className="block mt-1 text-gray-100">{selectedCrimeDetail?.camera.name}</span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Descripción</label>
                  <textarea placeholder='Descripción...' className="w-full bg-gray-700 text-white p-2 rounded text-sm" value={editForm.description} onChange={(e) => setEditForm(f => ({ ...f, description: e.target.value }))} rows={3} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Fecha y hora</label>
                  <span className="block mt-1 text-gray-100">{selectedCrimeDetail ? new Date(selectedCrimeDetail.created_at).toLocaleString() : ''}</span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Estado</label>
                  <Select className="bg-gray-700 text-gray-100 w-full" options={statuses.map(s => ({ label: s.name, value: String(s.id) }))} value={editForm.statusId} onChange={(v) => setEditForm(f => ({ ...f, statusId: v }))} />
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <Button type="button" text="Guardar cambios" variant="primary" className="px-4 py-2" onClick={saveEventChanges} />
                <Button type="button" text="Cancelar" variant="secondary" className="px-4 py-2" onClick={() => setIsEditModalOpen(false)} />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Events;

