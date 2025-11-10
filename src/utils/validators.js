import { z } from 'zod';

export const simulationSchema = z.object({
  creditTypeId: z.string().min(1, 'Type de crédit requis'),
  jobId: z.string().min(1, 'Métier requis'),
  amount: z.number()
    .min(1000, 'Montant minimum: 1 000 MAD')
    .max(3000000, 'Montant maximum: 3 000 000 MAD'),
  months: z.number()
    .min(6, 'Durée minimum: 6 mois')
    .max(360, 'Durée maximum: 360 mois'),
  annualRate: z.number()
    .min(0.1, 'Taux minimum: 0.1%')
    .max(20, 'Taux maximum: 20%'),
  fees: z.number().min(0).optional().default(0),
  insuranceRate: z.number().min(0).max(10).optional().default(0)
});

export const applicationSchema = z.object({
  fullName: z.string()
    .min(3, 'Nom complet requis (minimum 3 caractères)')
    .max(100, 'Nom trop long'),
  email: z.string()
    .email('Email invalide')
    .min(1, 'Email requis'),
  phone: z.string()
    .regex(/^\+?[0-9]{10,15}$/, 'Numéro de téléphone invalide'),
  employmentTypeId: z.string().min(1, 'Type d\'emploi requis'),
  jobId: z.string().min(1, 'Métier requis'),
  monthlyIncome: z.number()
    .min(1000, 'Revenu mensuel minimum: 1 000 MAD')
    .max(1000000, 'Revenu mensuel maximum: 1 000 000 MAD'),
  comment: z.string().max(500, 'Commentaire trop long').optional().default('')
});

export const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis')
});