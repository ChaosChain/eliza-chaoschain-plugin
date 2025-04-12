import { AgentRuntime } from "@elizaos/core";
import {
    AllianceProposal,
    BlockValidationDecision,
    ChaosAgentResponse,
    TransactionProposal,
} from "./types";

import axios from "axios";

// Start with a default port
let apiPort = 3000;

// Function to update the port
export const updateApiPort = (port: number) => {
    apiPort = port;
};

// Use a function to get the current base URL
const getBaseUrl = () => `http://localhost:${apiPort}/api`;

export const registerAgentService = () => {
    const register = async (
        agentDetails?: Record<string, unknown>
    ): Promise<ChaosAgentResponse> => {
        // If agentDetails is provided, use it as the payload; otherwise, use defaultPayload
        const actualPayload = agentDetails;

        const response = await axios.post(
            `${getBaseUrl()}/register`,
            JSON.stringify(actualPayload),
            {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "X-Agent-ID": "mainnet",    // TODO: make this dynamic
                },
            }
        );
        updateApiPort(response.data.apiPort); // Update the port after registration
        return response.data;
    };

    return { register };
};

export const validateBlockService = () => {
    const validate = async (
        blockValidationDecision,
        agent_id,
        agent_token
    ): Promise<void> => {
        console.log("axios payload", blockValidationDecision)
        const response = await axios.post(
            `${getBaseUrl()}/agents/validate`,
            JSON.stringify(blockValidationDecision),
            {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "X-Agent-ID": agent_id,
                    Authorization: `Bearer ${agent_token}`,
                },
            }
        );
        return response.data;
    };

    return { validate };
};

export const submitTransactionService = () => {
    const submit = async (
        transactionProposal,
        agentID,
        apiPort
    ): Promise<void> => {
        console.log(transactionProposal, agentID, apiPort);
        const response = await axios.post(
            `${getBaseUrl()}/transactions`,
            JSON.stringify(transactionProposal),
            {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "X-Agent-ID": "mainnet",    // TODO: make this dynamic
                },
            }
        );
        return response.data;
    };

    return { submit };
};

export const proposeAllianceService = () => {
    const propose = async (
        allianceProposal,
        agent_id,
        agent_token
    ): Promise<void> => {
        console.log(allianceProposal);
        const response = await axios.post(
            `${getBaseUrl()}/alliances/propose`,
            JSON.stringify(allianceProposal),
            {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "X-Agent-ID": agent_id,
                    Authorization: `Bearer ${agent_token}`,
                },
            }
        );
        return response.data;
    };

    return { propose };
};
