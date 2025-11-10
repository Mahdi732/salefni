import React from 'react';
import { Card } from '@components/common/Card';
import { formatDate } from '@utils/formatters';

export const ApplicationNotes = ({ notes = [] }) => {
  if (!notes || notes.length === 0) {
    return (
      <Card title="Notes internes">
        <p className="text-center text-gray-600 py-8">Aucune note</p>
      </Card>
    );
  }

  return (
    <Card title="Notes internes">
      <div className="space-y-3">
        {notes.map((note) => (
          <div key={note.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-700">{note.text}</p>
            <p className="text-xs text-gray-500 mt-2">{formatDate(note.createdAt)}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};