import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatCurrency, formatDate, formatPercentage } from '@utils/formatters';

export const exportSimulationPDF = (simulation, creditType, applicant = null) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 10;

  // Header
  doc.setFontSize(24);
  doc.text('SmartCredit', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 15;

  doc.setFontSize(12);
  doc.text('Simulation de Crédit', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 15;

  // Date
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Généré le: ${formatDate(new Date().toISOString())}`, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 10;

  doc.setTextColor(0, 0, 0);

  // Applicant Info (if provided)
  if (applicant) {
    doc.setFontSize(12);
    doc.text('Informations du Demandeur', 10, yPosition);
    yPosition += 8;

    autoTable(doc, {
      startY: yPosition,
      margin: 10,
      head: [['Champ', 'Valeur']],
      body: [
        ['Nom', applicant.fullName || ''],
        ['Email', applicant.email || ''],
        ['Téléphone', applicant.phone || ''],
        ['Revenu Mensuel', formatCurrency(applicant.monthlyIncome || 0)],
      ],
      styles: { fontSize: 9 }
    });
    yPosition = doc.lastAutoTable.finalY + 10;
  }

  // Simulation Summary
  doc.setFontSize(12);
  doc.text('Résumé de la Simulation', 10, yPosition);
  yPosition += 8;

  autoTable(doc, {
    startY: yPosition,
    margin: 10,
    head: [['Paramètre', 'Valeur']],
    body: [
      ['Type de Crédit', creditType?.label || ''],
      ['Montant Emprunté', formatCurrency(simulation.amount)],
      ['Durée', `${simulation.months} mois`],
      ['Taux Annuel', formatPercentage(simulation.annualRate)],
      ['Mensualité', formatCurrency(simulation.monthlyPayment)],
      ['Coût Total', formatCurrency(simulation.totalCost)],
      ['TAEG', formatPercentage(simulation.apr)],
      ['Intérêts Totaux', formatCurrency(simulation.totalInterest)],
      ...(simulation.fees > 0 ? [['Frais', formatCurrency(simulation.fees)]] : []),
      ...(simulation.totalInsurance > 0 ? [['Assurance', formatCurrency(simulation.totalInsurance)]] : [])
    ],
    styles: { fontSize: 9 }
  });

  yPosition = doc.lastAutoTable.finalY + 10;

  // Amortization Table (first 12 months or less)
  if (simulation.amortization && simulation.amortization.length > 0) {
    if (yPosition > pageHeight - 40) {
      doc.addPage();
      yPosition = 10;
    }

    doc.setFontSize(12);
    doc.text('Tableau d\'Amortissement (Premier Trimestre)', 10, yPosition);
    yPosition += 8;

    const displayRows = simulation.amortization.slice(0, 12);
    
    autoTable(doc, {
      startY: yPosition,
      margin: 10,
      head: [['Mois', 'Intérêts', 'Principal', 'Paiement Total', 'Solde Restant']],
      body: displayRows.map(row => [
        row.month.toString(),
        formatCurrency(row.interest),
        formatCurrency(row.principal),
        formatCurrency(row.totalPayment),
        formatCurrency(row.remaining)
      ]),
      styles: { fontSize: 8 }
    });
  }

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(
    'Ce document est une simulation à titre informatif. Les montants réels peuvent varier.',
    pageWidth / 2,
    pageHeight - 10,
    { align: 'center' }
  );

  // Save
  const filename = applicant 
    ? `demande-credit-${applicant.fullName}-${Date.now()}.pdf`
    : `simulation-credit-${Date.now()}.pdf`;
  
  doc.save(filename);
};

export const exportApplicationPDF = (application, simulation, creditType) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let yPosition = 10;

  // Header
  doc.setFontSize(20);
  doc.text('Demande de Crédit', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 15;

  doc.setFontSize(11);
  doc.setTextColor(100, 100, 100);
  doc.text(`Réf: #${application.id}`, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 10;

  doc.setTextColor(0, 0, 0);

  // Applicant Info
  doc.setFontSize(12);
  doc.text('Informations Personnelles', 10, yPosition);
  yPosition += 7;

  autoTable(doc, {
    startY: yPosition,
    margin: 10,
    head: [['Champ', 'Valeur']],
    body: [
      ['Nom', application.fullName],
      ['Email', application.email],
      ['Téléphone', application.phone],
      ['Revenu Mensuel', formatCurrency(application.monthlyIncome)],
      ['Type d\'Emploi', application.employmentTypeId],
      ['Métier', application.jobId],
    ],
    styles: { fontSize: 9 }
  });

  yPosition = doc.lastAutoTable.finalY + 10;

  // Simulation Details
  doc.setFontSize(12);
  doc.text('Détails du Crédit', 10, yPosition);
  yPosition += 7;

  autoTable(doc, {
    startY: yPosition,
    margin: 10,
    head: [['Paramètre', 'Valeur']],
    body: [
      ['Type de Crédit', creditType?.label || ''],
      ['Montant', formatCurrency(simulation.amount)],
      ['Durée', `${simulation.months} mois`],
      ['Mensualité', formatCurrency(simulation.monthlyPayment)],
      ['Coût Total', formatCurrency(simulation.totalCost)],
      ['TAEG', formatPercentage(simulation.apr)]
    ],
    styles: { fontSize: 9 }
  });

  if (application.comment) {
    yPosition = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.text('Commentaire', 10, yPosition);
    yPosition += 7;
    
    doc.setFontSize(9);
    const lines = doc.splitTextToSize(application.comment, pageWidth - 20);
    doc.text(lines, 10, yPosition);
  }

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(
    'Demande enregistrée le ' + formatDate(application.createdAt),
    pageWidth / 2,
    doc.internal.pageSize.getHeight() - 10,
    { align: 'center' }
  );

  doc.save(`demande-credit-${application.id}.pdf`);
};
