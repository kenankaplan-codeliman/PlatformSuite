/**
 * Backend DTO'ları ile birebir uyumlu — CodePro.Application/Features/Questionnaires/Dtos/**
 */

export type QuestionnaireRelatedModule = 'Offer' | 'Contract' | 'Supplier' | 'Order';
export type QuestionnaireStatus = 'Active' | 'Passive' | 'Draft';
export type QuestionType = 'YesNo' | 'ShortText' | 'LongText' | 'Number' | 'Date' | 'MultipleChoice';

export interface QuestionnaireQuestionOptionItem {
  id: string;
  optionText: string;
  orderIndex: number;
}

export interface QuestionnaireQuestionItem {
  id: string;
  questionText: string;
  questionType: QuestionType;
  isRequired: boolean;
  orderIndex: number;
  options: QuestionnaireQuestionOptionItem[];
}

export interface QuestionnaireDetailItem {
  id: string;
  name: string;
  relatedModule: QuestionnaireRelatedModule;
  status: QuestionnaireStatus;
  isActive: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
  questions: QuestionnaireQuestionItem[];
}

export interface QuestionnaireListItem {
  id: string;
  name: string;
  relatedModule: QuestionnaireRelatedModule;
  status: QuestionnaireStatus;
  questionCount: number;
  isActive: boolean;
  createdAt: string;
}

export interface QuestionnaireListFilter {
  name?: string;
  relatedModule?: QuestionnaireRelatedModule;
  status?: QuestionnaireStatus;
  isActive?: boolean;
}

export interface QuestionnaireFormValues {
  id: string;
  name: string;
  relatedModule: QuestionnaireRelatedModule;
  status: QuestionnaireStatus;
  isActive: boolean;
  questions: QuestionnaireQuestionItem[];
}
