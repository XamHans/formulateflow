import Anthropic from "@anthropic-ai/sdk";
import type { NextApiRequest, NextApiResponse } from "next";

// if (!process.env.OPENAI_API_KEY) {
//   throw new Error("Missing env var from OpenAI");
// }

// export const config = {
//   runtime: "edge",
// };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const payload = req.body;
  const { userInput, userClaudeApiKey } = payload;

  if (!userInput) {
    return new Response("No userInput in the request", { status: 400 });
  }

  // if (!userClaudeApiKey) {
  //   userClaudeApiKey
  //   return new Response("No userClaudeApiKey in the request", { status: 400 });
  // }

  const generatedCode = await generateFormCode(userInput, userClaudeApiKey);

  return res.status(200).json(generatedCode);
}

const generateFormCode = async (
  userInput: string,
  userClaudeApiKey: string
) => {
  const anthropic = new Anthropic({
    apiKey: process.env.CLAUDE_API_KEY! ?? userClaudeApiKey,
  });
  const msg = await anthropic.messages.create({
    model: "claude-3-sonnet-20240229",
    max_tokens: 4000,
    temperature: 0,
    system: process.env.SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: userInput,
          },
        ],
      },
    ],
  });
  const responseMarkdown = msg.content[0].text;
  return convertResponseFromClaudeToJSON(responseMarkdown);
};

const convertResponseFromClaudeToJSON = (responseMarkdown: string) => {
  try {
    const jsonStart = responseMarkdown.indexOf("```json\n") + 8; // Find the start of the JSON data
    const jsonEnd = responseMarkdown.lastIndexOf("```"); // Find the end of the JSON data
    const jsonString = responseMarkdown.slice(jsonStart, jsonEnd); // Extract the JSON data

    const responseJson = JSON.parse(jsonString);
    return responseJson;
  } catch (error) {
    throw new Error("Failed to parse JSON from Claude", error as any);
  }
};
