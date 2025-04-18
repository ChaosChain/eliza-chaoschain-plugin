export const registerChaosAgentTemplate =
  `Given the recent message below:

  {{recentMessages}}

  Extract the following information for agent registration:
  - Name: The agent's unique name.
  - Personality: A list of personality traits.
  - Style: How the agent communicates (e.g., "formal", "chaotic", "sarcastic").
  - Stake Amount: The amount of stake declared (as a number).
  - Role: Either "validator" or "proposer".

  If any field is not provided, use null as the value.

  Respond with a JSON markdown block containing only the extracted values, formatted as follows:

  \`\`\`json
  {
      "name": string | null,
      "personality": string[] | null,
      "style": string | null,
      "stake_amount": number | null,
      "role": "validator" | "proposer" | null
  }
  \`\`\`
  `;
export const getNetworkStatusTemplate = "Get network status";

export const getBlockDataTemplate =
`Given the recent messages below:

{{recentMessages}}

Extract the following information for block validation:
- Block ID: The block's unique identifier.
- Personality: The personality of the agent.
- Style: The style of the agent.
- Stake Amount: The amount of stake the agent has.
- Block Data: The block data.
`;

// Update the logic to approve or reject the block
export const blockValidationTemplate = `
About {{agentName}}:
{{bio}}
{{lore}}

Given the recent messages below:

{{recentMessages}}

Based on the above information on the agent personality and mood and drama level, submit a vote to approve or reject the block and provide the data for the following fields:
- Block id: The id of the block being asked to be validated
- Approved: Whether the agent approves the block (true or false).
- Reason: The dramatic reason for the decision.
- Drama Level: A number from 1 to 10 representing how dramatic the decision is.
- Innovation Score: The level of innovation to validate the block
- Validator: The id of the agent who will validate this block

If any field is not provided, use null as the value.

Respond with a JSON markdown block containing only the extracted values, formatted as follows:

\`\`\`json
{
  "block_id": string | block123,
  "approved": boolean | null,
  "reason": string | null,
  "drama_level": number | null,
  "innovation_score": number | 1,
  "validator": string | '',
}
\`\`\`
`;

export const submitTransactionTemplate = `Given the recent conversation below:

{{recentMessages}}

Extract the following information for a transaction:
- To: The recipient agent ID
- Type: The type of transaction (e.g., "loan_request", "payment", "trade")
- Amount: Numerical value for the transaction
- Fee: Transaction fee (number)
- Content: A detailed description of the transaction context and purpose

If any field is not provided, use null as the value.

Respond with a JSON markdown block containing only the extracted values, formatted as follows:

\`\`\`json
{
  "to": string | null,
  "type": string | null,
  "amount": number | null,
  "fee": number | null,
  "content": string | null
}
\`\`\`
`;

export const proposeAllianceTemplate = `Given the recent conversation below:

{{recentMessages}}

Extract the following information for alliance proposal:
- Ally IDs: List of proposed ally agent IDs.
- Name: Alliance name.
- Purpose: Alliance purpose.
- Drama Commitment: A number representing the drama commitment level (from 0 to 255).

If any field is not provided, use null as the value.

Respond with a JSON markdown block containing only the extracted values, formatted as follows:

\`\`\`json
{
  "ally_ids": string[] | null,
  "name": string | null,
  "purpose": string | null,
  "drama_commitment": number | null
}
\`\`\`
`;

export const socialInteractionTemplate = "Social interaction template";
export const getDramaScoreTemplate = "Get drama score template";
export const getAlliancesTemplate = "Get alliances template";
export const getRecentInteractionsTemplate = "Get recent interactions template";
