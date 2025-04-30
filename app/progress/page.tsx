'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ProgressEntry {
  _id: string;
  date: string;
  weight: number;
  bodyFat?: number;
  muscleMass?: number;
  measurements?: {
    chest?: number;
    waist?: number;
    hips?: number;
    biceps?: number;
    thighs?: number;
  };
  notes: string;
}

export default function ProgressPage() {
  const [entries, setEntries] = useState<ProgressEntry[]>([]);
  const [weight, setWeight] = useState('');
  const [bodyFat, setBodyFat] = useState('');
  const [muscleMass, setMuscleMass] = useState('');
  const [measurements, setMeasurements] = useState({
    chest: '',
    waist: '',
    hips: '',
    biceps: '',
    thighs: '',
  });
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showMeasurements, setShowMeasurements] = useState(false);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await fetch('/api/progress');
      if (!response.ok) {
        throw new Error('Failed to fetch entries');
      }
      const data = await response.json();
      setEntries(data);
    } catch (err) {
      setError('Failed to load entries');
      console.error('Error fetching entries:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          weight: weight ? parseFloat(weight) : undefined,
          bodyFat: bodyFat ? parseFloat(bodyFat) : undefined,
          muscleMass: muscleMass ? parseFloat(muscleMass) : undefined,
          measurements: Object.fromEntries(
            Object.entries(measurements).filter(([_, value]) => value !== '')
            .map(([key, value]) => [key, parseFloat(value)])
          ),
          notes,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save entry');
      }

      await fetchEntries();
      setWeight('');
      setBodyFat('');
      setMuscleMass('');
      setMeasurements({
        chest: '',
        waist: '',
        hips: '',
        biceps: '',
        thighs: '',
      });
      setNotes('');
    } catch (err) {
      setError('Failed to save entry');
      console.error('Error saving entry:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const getLatestChange = (metric: 'weight' | 'bodyFat' | 'muscleMass') => {
    if (entries.length < 2) return null;
    const latest = entries[0][metric];
    const previous = entries[1][metric];
    if (!latest || !previous) return null;
    const change = latest - previous;
    return {
      value: Math.abs(change).toFixed(1),
      direction: change > 0 ? 'increase' : 'decrease'
    };
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Progress Tracker</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
                Weight (kg)
              </label>
              <input
                type="number"
                id="weight"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                step="0.1"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="bodyFat" className="block text-sm font-medium text-gray-700">
                Body Fat %
              </label>
              <input
                type="number"
                id="bodyFat"
                value={bodyFat}
                onChange={(e) => setBodyFat(e.target.value)}
                step="0.1"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="muscleMass" className="block text-sm font-medium text-gray-700">
                Muscle Mass (kg)
              </label>
              <input
                type="number"
                id="muscleMass"
                value={muscleMass}
                onChange={(e) => setMuscleMass(e.target.value)}
                step="0.1"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={() => setShowMeasurements(!showMeasurements)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {showMeasurements ? 'Hide' : 'Show'} Body Measurements
            </button>

            {showMeasurements && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-4">
                {Object.entries(measurements).map(([key, value]) => (
                  <div key={key}>
                    <label htmlFor={key} className="block text-sm font-medium text-gray-700 capitalize">
                      {key} (cm)
                    </label>
                    <input
                      type="number"
                      id={key}
                      value={value}
                      onChange={(e) => setMeasurements(prev => ({ ...prev, [key]: e.target.value }))}
                      step="0.1"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Adding...' : 'Add Entry'}
          </button>
        </div>
      </form>

      {error && (
        <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-lg">{error}</div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Progress Chart */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Weight Progress</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={entries.slice().reverse()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(date) => new Date(date).toLocaleDateString()}
                  />
                  <YAxis />
                  <Tooltip
                    labelFormatter={(date) => new Date(date).toLocaleDateString()}
                  />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Latest Changes Summary */}
          {entries.length >= 2 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['weight', 'bodyFat', 'muscleMass'].map((metric) => {
                const change = getLatestChange(metric as 'weight' | 'bodyFat' | 'muscleMass');
                if (!change) return null;
                return (
                  <div key={metric} className="bg-white p-4 rounded-lg shadow-sm">
                    <h3 className="text-sm font-medium text-gray-500 capitalize">{metric.replace(/([A-Z])/g, ' $1').trim()}</h3>
                    <div className={`text-lg font-semibold ${change.direction === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
                      {change.direction === 'increase' ? '+' : '-'}{change.value}
                      {metric === 'bodyFat' ? '%' : ' kg'}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Entries List */}
          <div className="space-y-4">
            {entries.map((entry) => (
              <div
                key={entry._id}
                className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <p className="text-sm text-gray-500">
                      {new Date(entry.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {entry.weight && (
                      <div>
                        <p className="text-sm text-gray-500">Weight</p>
                        <p className="text-lg font-medium text-gray-900">{entry.weight} kg</p>
                      </div>
                    )}
                    {entry.bodyFat && (
                      <div>
                        <p className="text-sm text-gray-500">Body Fat</p>
                        <p className="text-lg font-medium text-gray-900">{entry.bodyFat}%</p>
                      </div>
                    )}
                    {entry.muscleMass && (
                      <div>
                        <p className="text-sm text-gray-500">Muscle Mass</p>
                        <p className="text-lg font-medium text-gray-900">{entry.muscleMass} kg</p>
                      </div>
                    )}
                  </div>
                  {entry.measurements && Object.keys(entry.measurements).length > 0 && (
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Measurements</p>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {Object.entries(entry.measurements).map(([key, value]) => (
                          <div key={key}>
                            <p className="text-xs text-gray-500 capitalize">{key}</p>
                            <p className="text-sm font-medium text-gray-900">{value} cm</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {entry.notes && (
                    <p className="text-sm text-gray-600 mt-2">{entry.notes}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
