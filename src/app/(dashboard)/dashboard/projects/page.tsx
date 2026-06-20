'use client';

import React, { useEffect, useState } from 'react';

type Client = {
  id: string;
  name: string;
};

type Project = {
  id: string;
  name: string;
  status: string;
  rateType: string | null;
  rateAmount: number | null;
  createdAt: string;
  client: {
    id: string;
    name: string;
  };
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingClients, setLoadingClients] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [clientId, setClientId] = useState('');
  const [status, setStatus] = useState('active');
  const [rateType, setRateType] = useState('');
  const [rateAmount, setRateAmount] = useState<string>('');

  async function loadProjects() {
    try {
      setLoadingProjects(true);
      const res = await fetch('/api/projects');
      if (!res.ok) {
        throw new Error('Failed to fetch projects');
      }
      const data = await res.json();
      setProjects(data.projects ?? []);
    } catch (err) {
      console.error(err);
      setError('No se pudieron cargar los proyectos');
    } finally {
      setLoadingProjects(false);
    }
  }

  async function loadClients() {
    try {
      setLoadingClients(true);
      const res = await fetch('/api/clients');
      if (!res.ok) {
        throw new Error('Failed to fetch clients');
      }
      const data = await res.json();
      setClients(data.clients ?? []);
    } catch (err) {
      console.error(err);
      setError('No se pudieron cargar los clientes');
    } finally {
      setLoadingClients(false);
    }
  }

  useEffect(() => {
    const fetchAll = async () => {
      await Promise.all([loadProjects(), loadClients()]);
    };
    fetchAll();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim()) {
      setError('El nombre del proyecto es obligatorio');
      return;
    }
    if (!clientId) {
      setError('Debes seleccionar un cliente');
      return;
    }

    try {
      setError(null);

      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          clientId,
          status,
          rateType: rateType || null,
          rateAmount:
            rateAmount.trim() === '' ? null : Number(rateAmount.trim()),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'Error al crear proyecto');
      }

      setName('');
      setClientId('');
      setStatus('active');
      setRateType('');
      setRateAmount('');

      await loadProjects();
    } catch (err) {
      console.error(err);
      setError('No se pudo crear el proyecto');
    }
  }

  return (
    <main className="p-4 space-y-6">
      <h1 className="text-xl font-semibold">Projects</h1>

      <section className="border rounded p-4 space-y-3">
        <h2 className="font-medium">Nuevo proyecto</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Nombre del proyecto*</label>
            <input
              className="border rounded px-2 py-1"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Landing page para Empresa XYZ"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Cliente*</label>
            <select
              className="border rounded px-2 py-1"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              disabled={loadingClients || clients.length === 0}
            >
              <option value="">
                {loadingClients
                  ? 'Cargando clientes...'
                  : clients.length === 0
                  ? 'No hay clientes, crea uno primero'
                  : 'Selecciona un cliente'}
              </option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Estado</label>
            <select
              className="border rounded px-2 py-1"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="active">Activo</option>
              <option value="on-hold">En pausa</option>
              <option value="completed">Completado</option>
              <option value="cancelled">Cancelado</option>
            </select>
          </div>

          <div className="flex gap-3">
            <div className="flex-1 flex flex-col gap-1">
              <label className="text-sm font-medium">Tipo de tarifa</label>
              <select
                className="border rounded px-2 py-1"
                value={rateType}
                onChange={(e) => setRateType(e.target.value)}
              >
                <option value="">Sin tarifa</option>
                <option value="hourly">Por hora</option>
                <option value="fixed">Proyecto fijo</option>
              </select>
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <label className="text-sm font-medium">Monto</label>
              <input
                className="border rounded px-2 py-1"
                type="number"
                step="0.01"
                value={rateAmount}
                onChange={(e) => setRateAmount(e.target.value)}
                placeholder="Ej: 50"
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
          >
            Crear proyecto
          </button>
        </form>
      </section>

      <section className="space-y-2">
        <h2 className="font-medium">Listado de proyectos</h2>

        {loadingProjects ? (
          <p>Cargando proyectos...</p>
        ) : projects.length === 0 ? (
          <p>No hay proyectos aún.</p>
        ) : (
          <ul className="space-y-2">
            {projects.map((project) => (
              <li
                key={project.id}
                className="border rounded p-3 flex flex-col gap-1"
              >
                <span className="font-medium">{project.name}</span>
                <span className="text-sm text-gray-600">
                  Cliente: {project.client?.name ?? 'Sin cliente'}
                </span>
                <span className="text-xs text-gray-500">
                  Estado: {project.status} · Tarifa:{' '}
                  {project.rateType
                    ? `${project.rateType} ${project.rateAmount ?? ''}`
                    : 'N/A'}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}