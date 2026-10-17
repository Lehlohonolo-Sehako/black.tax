import type { components as Core } from './generated/core.ts';
import type { components as AgentApi } from './generated/agent.ts';

export type AgentState = Core['schemas']['AgentState'];
export type Member = Core['schemas']['Member'];
export type KeyValue = Core['schemas']['KeyValue'];
export type DecisionType = Core['schemas']['DecisionType'];
export type AgentOutcome = Core['schemas']['AgentOutcome'];
export type LedgerEntryType = Core['schemas']['LedgerEntryType'];
export type RecordDecisionRequest = Core['schemas']['RecordDecisionRequest'];
export type AgentDecision = Core['schemas']['AgentDecision'];
export type NewLoanRequest = Core['schemas']['NewLoanRequest'];
export type Trigger = Core['schemas']['Trigger'];

export type EvaluateRequest = AgentApi['schemas']['EvaluateRequest'];
export type EvaluateResponse = AgentApi['schemas']['EvaluateResponse'];
export type AssessRequest = AgentApi['schemas']['AssessRequest'];
export type AssessResponse = AgentApi['schemas']['AssessResponse'];
export type FundLoanRequest = AgentApi['schemas']['FundLoanRequest'];
export type FundLoanResponse = AgentApi['schemas']['FundLoanResponse'];
export type Action = EvaluateResponse['actions'][number];
