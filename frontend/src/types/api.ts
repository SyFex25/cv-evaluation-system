/**
 * File: src/types/api.ts
 * Module: Types
 * Responsibility: Defines frontend TypeScript types for backend API responses
 */

export type ProviderName = 'openai' | 'anthropic' | 'xai'

export type User = {
  id: number
  email: string
  full_name: string | null
}

export type AuthResponse = {
  access_token: string
  token_type: 'bearer'
  user: User
}

export type SkillAssessment = {
  name: string
  score: number
  evidence: string
}

export type EvaluationReport = {
  overall_score: number
  summary: string
  strengths: string[]
  weaknesses: string[]
  skills: SkillAssessment[]
  recommendation: string
}

export type AnalyzeResponse = {
  provider: string
  report: EvaluationReport
}