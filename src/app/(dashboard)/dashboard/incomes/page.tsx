'use client';

import React, { useEffect, useState } from 'react';

type Project = {
  id: string;
  name: string;
  client: {
    id: string;
    name: string;
  };
};

type Income = {
  id: string;
  amount: number;
  currency: string;
  receivedAt: string;
  notes: string | null;
  project: Project;
};

export default function IncomesPage() {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingIncomes, setLoadingIncomes] = useState(true);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [projectId, setProjectId] = useState('');
  const [amount, setAmount] = useState<string>('');
  const [currency, setCurrency] = useState('USD');
  const [receivedAt, setReceivedAt] = useState('');
  const [notes, setNotes] = useState('');

  async function loadIncomes() {
    try {
      setLoadingIncomes(true);
      const res = await fetch('/api/incomes');
      if (!res.ok) {
        throw new Error('Failed to fetch incomes');
      }
      const data = await res.json();
      setIncomes(data.incomes ?? []);
    } catch (err) {
      console.error(err);
      setError('No se pudieron cargar los ingresos');
    } finally {
      setLoadingIncomes(false);
    }
  }

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

  useEffect(() => {
    const fetchAll = async () => {
      await Promise.all([loadIncomes(), loadProjects()]);
    };
    fetchAll();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!projectId) {
      setError('Debes seleccionar un proyecto');
      return;
    }
    if (amount.trim() === '' || isNaN(Number(amount))) {
      setError('El monto es obligatorio y debe ser numérico');
      return;
    }

    try {
      setError(null);

      const res = await fetch('/api/incomes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId,
          amount: Number(amount),
          currency,
          receivedAt: receivedAt || undefined,
          notes: notes || null,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'Error al crear ingreso');
      }

      setProjectId('');
      setAmount('');
      setCurrency('USD');
      setReceivedAt('');
      setNotes('');

      await loadIncomes();
    } catch (err) {
      console.error(err);
      setError('No se pudo crear el ingreso');
    }
  }

  return (
    <main className="p-4 space-y-6">
      <h1 className="text-xl font-semibold">Incomes</h1>

      <section className="border rounded p-4 space-y-3">
        <h2 className="font-medium">Nuevo ingreso</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Proyecto*</label>
            <select
              className="border rounded px-2 py-1"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              disabled={loadingProjects || projects.length === 0}
            >
              <option value="">
                {loadingProjects
                  ? 'Cargando proyectos...'
                  : projects.length === 0
                  ? 'No hay proyectos, crea uno primero'
                  : 'Selecciona un proyecto'}
              </option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name} ({project.client?.name})
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3">
            <div className="flex-1 flex flex-col gap-1">
              <label className="text-sm font-medium">Monto*</label>
              <input
                className="border rounded px-2 py-1"
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Ej: 1000"
              />
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <label className="text-sm font-medium">Moneda</label>
              <input
                className="border rounded px-2 py-1"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                placeholder="USD"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Fecha de recepción</label>
            <input
              className="border rounded px-2 py-1"
              type="date"
              value={receivedAt}
              onChange={(e) => setReceivedAt(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Notas</label>
            <textarea
              className="border rounded px-2 py-1"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notas sobre el pago"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
          >
            Registrar ingreso
          </button>
        </form>
      </section>

      <section className="space-y-2">
        <h2 className="font-medium">Listado de ingresos</h2>

        {loadingIncomes ? (
          <p>Cargando ingresos...</p>
        ) : incomes.length === 0 ? (
          <p>No hay ingresos aún.</p>
        ) : (
          <ul className="space-y-2">
            {incomes.map((income) => (
              <li
                key={income.id}
                className="border rounded p-3 flex flex-col gap-1"
              >
                <span className="font-medium">
                  {income.amount} {income.currency}
                </span>
                <span className="text-sm text-gray-600">
                  Proyecto: {income.project?.name} (
                  {income.project?.client?.name})
                </span>
                <span className="text-xs text-gray-500">
                  Fecha:{' '}
                  {new Date(income.receivedAt).toLocaleDateString('es-CL')}
                </span>
                {income.notes && (
                  <span className="text-xs text-gray-500">
                    Notas: {income.notes}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}