import { z } from 'zod';
import type { QuestionnaireListFilter } from './types';

export const QUESTIONNAIRE_RELATED_MODULES = ['Offer', 'Contract', 'Supplier', 'Order'] as const;

export const QUESTIONNAIRE_STATUSES = ['Active', 'Passive', 'Draft'] as const;

export const questionnaireListFilterSchema: z.ZodType<QuestionnaireListFilter> = z.object({
  name: z.string().optional(),
  relatedModule: z.enum(QUESTIONNAIRE_RELATED_MODULES).optional(),
  status: z.enum(QUESTIONNAIRE_STATUSES).optional(),
  isActive: z
    .union([z.boolean(), z.literal('true'), z.literal('false')])
    .optional()
    .transform((v) => (v === undefined ? undefined : v === true || v === 'true')),
}) as z.ZodType<QuestionnaireListFilter>;

export const questionnaireListFilterDefaults: QuestionnaireListFilter = {};
