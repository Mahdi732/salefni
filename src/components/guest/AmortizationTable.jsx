import React, { useState } from 'react';
import { formatCurrency } from '@utils/formatters';

export const AmortizationTable = ({ amortization }) => {
  const [expanded, setExpanded] = useState(false);
  const displayRows = expanded ? amortization : amortization.slice(0, 6);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-2 px-2">Mois</th>
            <th className="text-right py-2 px-2">Intérêts</th>
            <th className="text-right py-2 px-2">Principal</th>
            <th className="text-right py-2 px-2">Paiement</th>
            <th className="text-right py-2 px-2">Solde</th>
          </tr>
        </thead>
        <tbody>
          {displayRows.map((row, idx) => (
            <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-2 px-2 text-gray-600">{row.month}</td>
              <td className="py-2 px-2 text-right">{formatCurrency(row.interest)}</td>
              <td className="py-2 px-2 text-right">{formatCurrency(row.principal)}</td>
              <td className="py-2 px-2 text-right font-semibold">
                {formatCurrency(row.totalPayment)}
              </td>
              <td className="py-2 px-2 text-right">{formatCurrency(row.remaining)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {amortization.length > 6 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full py-2 text-primary-600 hover:bg-gray-50 font-medium text-sm mt-2"
        >
          {expanded ? 'Afficher moins' : `Afficher tous (${amortization.length} mois)`}
        </button>
      )}
    </div>
  );
};