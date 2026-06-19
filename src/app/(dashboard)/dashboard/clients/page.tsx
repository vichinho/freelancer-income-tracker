import React from 'react';

async function getClients() {
  const res = await fetch('http://localhost:3000/api/clients', {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch clients');
  }

  const data = await res.json();
  return data.clients as {
    id: string;
    name: string;
    email: string | null;
    type: string | null;
    notes: string | null;
    createdAt: string;
  }[];
}

export default async function ClientsPage() {
  const clients = await getClients();

  return (
    <main className="p-4">
      <h1 className="text-xl font-semibold mb-4">Clients</h1>

      {clients.length === 0 ? (
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
    </main>
  );
}