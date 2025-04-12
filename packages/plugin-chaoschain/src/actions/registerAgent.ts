import {
    elizaLogger,
    Action,
    ActionExample,
    HandlerCallback,
    IAgentRuntime,
    Memory,
    State,
    composeContext,
    Content,
    generateObject,
    ModelClass,
} from "@elizaos/core";
import { validateChaoschainConfig } from "../environment";
import { registerAgentService } from "../services";
import { registerAgentExamples } from "../examples/actionExamples";
import { RegisterAgentSchema } from "../utils/schemas";
import { z } from "zod";
import { registerChaosAgentTemplate } from "../utils/templates";
import { v4 as uuid } from 'uuid';

export type RegisterAgentContent = z.infer<typeof RegisterAgentSchema> &
  Content;
export const isRegisterAgentContent = (
  obj: unknown
): obj is RegisterAgentContent => {
  return RegisterAgentSchema.safeParse(obj).success;
};

export const registerAgentAction: Action = {
    name: "CHAOSCHAIN_REGISTER_AGENT",
    similes: ["REGISTER", "AGENT", "REGISTER AGENT",
    "Create a new agent",
    "Register a new agent",
    "Enroll a new agent",
    "Sign up for a new agent",],
    description: "Registers the Eliza agent with ChaosChain.",
    validate: async (runtime: IAgentRuntime) => {
        elizaLogger.success(
            "registering agent",
        );
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
        const chaoschainService = registerAgentService();

        let currentState = state;
        if (!currentState) {
            currentState = await runtime.composeState(message);
        } else {
            currentState = await runtime.updateRecentMessageState(currentState);
        }

        const agentContext = composeContext({
            state: currentState,
            template: registerChaosAgentTemplate,
        });


        try {
            // Construct agent data using character attributes
            const agentData: Record<string, unknown> = {
                id: uuid(), // Generate a unique ID for the agent
                name: runtime.character?.name || 'Unknown Agent',
                role: 'validator', // Default role, could be made configurable
                metadata: {
                    bio: runtime.character?.bio,
                    lore: runtime.character?.lore,
                    knowledge: runtime.character?.knowledge,
                    topics: runtime.character?.topics,
                    style: runtime.character?.style,
                    adjectives: runtime.character?.adjectives,
                }
            }

            const response = await chaoschainService.register(agentData);

            elizaLogger.success(
                "[ChaosChain] Agent registered successfully.",
                response
            );

            // set the registered agent on eliza cache
            await runtime.cacheManager.set(
                message.roomId,
                JSON.stringify({
                    agentID: response.agentID,
                    apiPort: response.apiPort
                })
            );

            callback({
                text: `Agent ${response.agentID} successfully registered on ChaosChain with port ${response.apiPort}!`,
            });
            return true;
        } catch (error: any) {
            elizaLogger.error("[ChaosChain] Error registering agent:", error);
            callback({
                text: `Error registering agent: ${error.message}`,
                content: { error: error.message },
            });
            return false;
        }
    },
    examples: registerAgentExamples as ActionExample[][],
} as Action;
