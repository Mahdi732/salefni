export const calculateMonthlyPayment = (principal, annualRate, months, insuranceRate = 0) => {
  const monthlyRate = annualRate / 12 / 100;
  const insuranceMonthly = (principal * insuranceRate / 100) / 12;
  
  if (monthlyRate === 0) {
    return principal / months + insuranceMonthly;
  }
  
  const x = Math.pow(1 + monthlyRate, months);
  const monthlyPayment = (principal * monthlyRate * x) / (x - 1);
  
  return monthlyPayment + insuranceMonthly;
};

export const calculateTotalCost = (monthlyPayment, months, fees) => {
  return (monthlyPayment * months) + (fees || 0);
};

export const calculateAPR = (principal, totalCost, months) => {
  const totalInterest = totalCost - principal;
  const averageMonthlyInterest = totalInterest / months;
  const averageMonthlyRate = averageMonthlyInterest / principal;
  const annualRate = averageMonthlyRate * 12 * 100;
  
  return Math.max(0, annualRate);
};

export const generateAmortizationSchedule = (
  principal,
  annualRate,
  months,
  monthlyPayment,
  insuranceRate = 0
) => {
  const schedule = [];
  const monthlyRate = annualRate / 12 / 100;
  const insuranceMonthly = (principal * insuranceRate / 100) / 12;
  const basePayment = monthlyPayment - insuranceMonthly;
  
  let remainingPrincipal = principal;
  
  for (let month = 1; month <= months; month++) {
    const interestPayment = remainingPrincipal * monthlyRate;
    const principalPayment = basePayment - interestPayment;
    
    remainingPrincipal -= principalPayment;
    
    if (month === months) {
      remainingPrincipal = 0;
    }
    
    schedule.push({
      month,
      interest: Math.round(interestPayment * 100) / 100,
      principal: Math.round(principalPayment * 100) / 100,
      insurance: Math.round(insuranceMonthly * 100) / 100,
      totalPayment: Math.round(monthlyPayment * 100) / 100,
      remaining: Math.max(0, Math.round(remainingPrincipal * 100) / 100)
    });
  }
  
  return schedule;
};

export const simulateCredit = ({
  creditTypeId,
  amount,
  months,
  annualRate,
  fees = 0,
  insuranceRate = 0
}) => {
  const monthlyPayment = calculateMonthlyPayment(amount, annualRate, months, insuranceRate);
  const totalCost = calculateTotalCost(monthlyPayment, months, fees);
  const apr = calculateAPR(amount, totalCost, months);
  const amortization = generateAmortizationSchedule(
    amount,
    annualRate,
    months,
    monthlyPayment,
    insuranceRate
  );
  
  const totalInterest = amortization.reduce((sum, row) => sum + row.interest, 0);
  const totalInsurance = amortization.reduce((sum, row) => sum + row.insurance, 0);
  
  return {
    creditTypeId,
    amount,
    months,
    annualRate,
    fees,
    insuranceRate,
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    totalCost: Math.round(totalCost * 100) / 100,
    apr: Math.round(apr * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    totalInsurance: Math.round(totalInsurance * 100) / 100,
    amortization,
    createdAt: new Date().toISOString()
  };
};

export const validateSimulationParams = (params, creditType) => {
  const errors = [];
  
  if (params.amount < creditType.minAmount) {
    errors.push(`Montant minimum: ${creditType.minAmount} MAD`);
  }
  
  if (params.amount > creditType.maxAmount) {
    errors.push(`Montant maximum: ${creditType.maxAmount} MAD`);
  }
  
  if (params.months > creditType.maxMonths) {
    errors.push(`Durée maximum: ${creditType.maxMonths} mois`);
  }
  
  if (params.months < 6) {
    errors.push('Durée minimum: 6 mois');
  }
  
  return errors;
};