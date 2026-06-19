'use client';

import React, { useEffect, useState } from 'react';

type Client = {
  id: string;
  name: string;
  email: string | null;
  type: string | null;
  notes: string | null;
  createdAt: string;
};

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [type, setType] = useState('');
  const [notes, setNotes] = useState('');

  async function loadClients() {
    try {
      setLoading(true);
      setError(null);

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
      setLoading(false);
    }
  }

  useEffect(() => {
  const fetchClients = async () => {
    await loadClients();
  };

  fetchClients();
}, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim()) {
      setError('El nombre es obligatorio');
      return;
    }

    try {
      setError(null);

      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email: email || null,
          type: type || null,
          notes: notes || null,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'Error al crear cliente');
      }

      setName('');
      setEmail('');
      setType('');
      setNotes('');

      await loadClients();
    } catch (err) {
      console.error(err);
      setError('No se pudo crear el cliente');
    }
  }

  return (
    <main className="p-4 space-y-6">
      <h1 className="text-xl font-semibold">Clients</h1>

      <section className="border rounded p-4 space-y-3">
        <h2 className="font-medium">Nuevo cliente</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Nombre*</label>
            <input
              className="border rounded px-2 py-1"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Empresa XYZ"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Email</label>
            <input
              className="border rounded px-2 py-1"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="cliente@correo.com"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Tipo</label>
            <input
              className="border rounded px-2 py-1"
              value={type}
              onChange={(e) => setType(e.target.value)}
              placeholder="freelance, empresa, etc."
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Notas</label>
            <textarea
              className="border rounded px-2 py-1"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notas adicionales sobre el cliente"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
          >
            Crear cliente
          </button>
        </form>
      </section>

      <section className="space-y-2">
        <h2 className="font-medium">Listado de clientes</h2>

        {loading ? (
          <p>Cargando clientes...</p>
        ) : clients.length === 0 ? (
          <p>No hay clientes aún.</p>
        ) : (
          <ul className="space-y-2">
            {clients.map((client) => (
              <li
                key={client.id}
                className="border rounded p-3 flex flex-col gap-1"
              >
                <span className="font-medium">{client.name}</span>
                <span className="text-sm text-gray-600">
                  {client.email ?? 'Sin email'}
                </span>
                <span className="text-xs text-gray-500">
                  Tipo: {client.type ?? 'N/A'}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}