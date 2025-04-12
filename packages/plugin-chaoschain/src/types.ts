export interface ChaosAgentRegistration {
    name: string;
    personality: string[];
    style: string;
    stake_amount: number;
    role: "validator" | "proposer";
}

export interface ChaosAgentResponse {
    agentID: string;
    apiPort: number;
    message: string;
}

export interface BlockValidationRequest {
    block_id: string;
    drama_level: number;
    transactions: any[];
    network_mood: string;
}

export interface BlockValidationDecision {
    block_id: string;
    approved: boolean;
    reason: string;
    drama_level: number;
}

export interface TransactionProposal {
    from: string;
    to: string;
    type: string;
    amount: number;
    fee: number;
    content: string;
}

export interface AllianceProposal {
    name: string;
    purpose: string;
    ally_ids: string[];
    drama_commitment: number;
}

export interface RegisterAgentContent {
    id?: string;
    name: string;
    role: string;
    metadata: Record<string, unknown>;
}
