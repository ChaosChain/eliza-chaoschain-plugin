import {
    elizaLogger,
    Action,
    ActionExample,
    HandlerCallback,
    IAgentRuntime,
    Memory,
    State,
    generateObject,
    ModelClass,
    composeContext,
    Content,
} from "@elizaos/core";
import { validateChaoschainConfig } from "../environment.ts";
import { submitTransactionService } from "../services.ts";
import { proposeTransactionExamples } from "../examples/actionExamples.ts";
import { TransactionProposal } from "../types.ts";
import { ProposeBlockSchema } from "../utils/schemas.ts";
import { submitTransactionTemplate } from "../utils/templates.ts";
import { z } from "zod";

export type ProposeBlockContent = z.infer<typeof ProposeBlockSchema> & Content;
export const isProposeBlockContent = (
    obj: unknown
): obj is ProposeBlockContent => {
    return ProposeBlockSchema.safeParse(obj).success;
};

export const proposeTransactionAction: Action = {
    name: "CHAOSCHAIN_SUBMIT_TRANSACTION",
    similes: ["TRANSACTION", "PROPOSE CONTENT", "CHAOSCHAIN"],
    description:
        "Submits a transaction to ChaosChain.",
    validate: async (runtime: IAgentRuntime) => {
        await validateChaoschainConfig(runtime);
        return true;
    },
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown },
        callback: HandlerCallback
    ) => {
        const config = await validateChaoschainConfig(runtime);
        const chaoschainService = submitTransactionService();

        let currentState = state;
        if (!currentState) {
            currentState = await runtime.composeState(message);
        } else {
            currentState = await runtime.updateRecentMessageState(currentState);
        }

        const transactionContext = composeContext({
            state: currentState,
            template: submitTransactionTemplate,
        });

        const response = await generateObject({
        runtime,
        context: transactionContext,
        modelClass: ModelClass.LARGE,
        schema: ProposeBlockSchema,
        });

        const { agentID, apiPort } = JSON.parse(
            await runtime.cacheManager.get(message.roomId)
        );

        if (!agentID || !apiPort) {
            callback({
                text: "Agent credentials are missing. Register the agent first.",
            });
            return false;
        }

        try {
            const transactionProposal = {
                ...response,
                from: agentID,
            };

            await chaoschainService.submit(
                transactionProposal,
                agentID,
                apiPort
            );

            elizaLogger.success("[ChaosChain] Transaction proposal submitted.");
            callback({
                text: "Transaction proposal submitted successfully.",
            });
            return true;
        } catch (error: any) {
            elizaLogger.error(
                "[ChaosChain] Error proposing transaction:",
                error
            );
            callback({
                text: `Error proposing transaction: ${error.message}`,
                content: { error: error.message },
            });
            return false;
        }
    },
    examples: proposeTransactionExamples as ActionExample[][],
} as Action;

