import { z } from 'zod';

const questionTypeEnum = z.enum(['YesNo', 'ShortText', 'LongText', 'Number', 'Date', 'MultipleChoice']);
const relatedModuleEnum = z.enum(['Offer', 'Contract', 'Supplier', 'Order']);
const statusEnum = z.enum(['Active', 'Passive', 'Draft']);

const optionSchema = z.object({
  id: z.string(),
  optionText: z.string().min(1).max(500),
  orderIndex: z.number().int().nonnegative(),
});

const questionSchema = z.object({
  id: z.string(),
  questionText: z.string().min(1, 'common:errors.required').max(1000),
  questionType: questionTypeEnum,
  isRequired: z.boolean(),
  orderIndex: z.number().int().nonnegative(),
  options: z.array(optionSchema),
});

export const questionnaireSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'common:errors.required').max(300),
  relatedModule: relatedModuleEnum,
  status: statusEnum,
  isActive: z.boolean(),
  questions: z.array(questionSchema),
});
