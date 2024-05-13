import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

// if (!process.env.OPENAI_API_KEY) {
//   throw new Error("Missing env var from OpenAI");
// }

// export const config = {
//   runtime: "edge",
// };

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

let thread = {
  id: "",
};

let run = undefined;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const payload = req.body;
  const { userInput } = payload;

  if (!userInput) {
    return new Response("No userInput in the request", { status: 400 });
  }

  run = createRunPerUser(userInput);

  const generatedCode = await generateFormCode();

  return res.status(200).json({ generatedCode });
}

// Function to create a new thread
const createRunPerUser = async (userInput: string) => {
  if (!thread?.id) {
    thread = await openai.beta.threads.create();
  }

  await openai.beta.threads.messages.create(thread.id, {
    role: "user",
    content: userInput,
  });

  run = await openai.beta.threads.runs.create(thread.id, {
    assistant_id: process.env.ASSISTANT_ID!,
  });
};

const checkRun = async () => {
  if (!run) {
    throw new Error("No run found, therefore no check run can be done");
  }
  return new Promise((resolve, reject) => {
    const interval = setInterval(async () => {
      const retrieveRun = await openai.beta.threads.runs.retrieve(
        thread.id,
        run.id
      );

      console.log("Run status: ", retrieveRun.status);

      if (retrieveRun.status === "completed") {
        console.log("Run completed: ", retrieveRun);

        clearInterval(interval);
        resolve(retrieveRun);
      }
    }, 3000);
  });
};

const generateFormCode = async () => {
  await checkRun();

  const messages = await openai.beta.threads.messages.list(thread.id);

  const answers = (messages.data ?? [])
    .filter((m) => m?.role === "assistant")
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  if (!answers || answers.length === 0) {
    return "No answer found";
  }

  return answers[0].content[0].text.value;
};
