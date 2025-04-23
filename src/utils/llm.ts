import OpenAI from 'openai';
import { LLMError } from './errors.js';
import { loadEnvConfig } from './env.js';

let openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    loadEnvConfig(); // Only load config when client is needed
    openaiClient = new OpenAI();
  }
  return openaiClient;
}

export async function refineVision(raw: string): Promise<string> {
  const prompt = `
You're a product strategist helping refine a product vision statement.
The user wrote this rough idea:

"${raw}"

Please rewrite it to sound more polished, inspirational, and product-focused. Keep it short and clear.
Only output the improved version—no commentary, no preamble.
  `;

  const completion = await getOpenAIClient().chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
  });

  return completion.choices[0].message.content?.trim() || raw;
}

export async function getPersonaNameOptions(raw: string, vision: string): Promise<string[]> {
  const prompt = `
You're a product strategist helping define user personas.

The product vision is:
"${vision}"

The user described their customer like this:
"${raw}"

Please provide 5 specific, industry-standard role titles that best describe this user.
Each title should be:
- Clear and specific
- Common in the industry
- Professional and descriptive
- Different from each other
- No more than 3-4 words

Return ONLY the 5 titles, one per line, with no numbers or bullet points.
`;

  const completion = await getOpenAIClient().chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
  });

  const response = completion.choices[0].message.content?.trim() || '';
  return response.split('\n').map(name => name.trim()).filter(Boolean);
}

export async function refinePersona(raw: string, vision: string, selectedName: string): Promise<{
  name: string;
  formatted: string;
}> {
  const prompt = `
You're a product strategist helping define a user persona.

The product vision is:
"${vision}"

The user described their customer like this:
"${raw}"

Please format the persona in markdown with the following structure:

# ${selectedName}

## Goals
- [3 bullet points]

## Frustrations
- [3 bullet points]

## Typical Tools
- [List of tools]

## Daily Behaviors
- [List of behaviors]

Make sure the persona aligns with and supports the product vision.
The content should be specific to the role of ${selectedName}.
`;

  const completion = await getOpenAIClient().chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
  });

  const response = completion.choices[0].message.content?.trim() || raw;

  return {
    name: selectedName,
    formatted: response,
  };
}

export async function refineJobs(persona: string, raw: string, vision: string): Promise<{
  formatted: string;
}> {
  const prompt = `
The user is working on a product strategy.

The product vision is:
"${vision}"

They've described this persona:
"${persona}"

They listed a few jobs this user needs to do:
"${raw}"

Please return 2–4 structured Jobs to Be Done in this markdown format:

### Job: [short name]
- **Trigger:** [why the job happens]
- **Outcome:** [what success looks like]
- **Success Metric:** [how we know it worked]

Make sure the jobs align with both the product vision and the persona's needs.
Return only the markdown.
`;

  const completion = await getOpenAIClient().chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
  });

  return {
    formatted: completion.choices[0].message.content?.trim() || raw,
  };
}

interface RefineOptions {
  personaName?: string;
  jobsContent?: string;
  vision?: string;
}

type Message = {
  role: 'system' | 'user';
  content: string;
};

export async function refineProblemSpace(input: string): Promise<string> {
  try {
    const messages: Message[] = [
      {
        role: 'system',
        content: 'You are a product strategy expert. Refine the problem space description to be clear, concise, and actionable.'
      },
      {
        role: 'user',
        content: input
      }
    ];

    const completion = await getOpenAIClient().chat.completions.create({
      messages,
      model: 'gpt-4-turbo-preview',
    });

    return completion.choices[0]?.message?.content || input;
  } catch (error) {
    throw new LLMError(`Failed to refine problem space: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function refineValueProposition(input: string): Promise<string> {
  try {
    const messages: Message[] = [
      {
        role: 'system',
        content: 'You are a product strategy expert. Refine the value proposition to be compelling and customer-focused.'
      },
      {
        role: 'user',
        content: input
      }
    ];

    const completion = await getOpenAIClient().chat.completions.create({
      messages,
      model: 'gpt-4-turbo-preview',
    });

    return completion.choices[0]?.message?.content || input;
  } catch (error) {
    throw new LLMError(`Failed to refine value proposition: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function refinePrinciples(input: string): Promise<string> {
  try {
    const messages: Message[] = [
      {
        role: 'system',
        content: 'You are a product strategy expert. Refine the product principles to be clear, actionable, and aligned with the product vision.'
      },
      {
        role: 'user',
        content: input
      }
    ];

    const completion = await getOpenAIClient().chat.completions.create({
      messages,
      model: 'gpt-4-turbo-preview',
    });

    return completion.choices[0]?.message?.content || input;
  } catch (error) {
    throw new LLMError(`Failed to refine principles: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function refineSolutions(input: string, options: RefineOptions = {}): Promise<string> {
  try {
    const { personaName, jobsContent, vision } = options;
    const context = [
      personaName ? `Persona: ${personaName}` : '',
      jobsContent ? `Jobs: ${jobsContent}` : '',
      vision ? `Vision: ${vision}` : ''
    ].filter(Boolean).join('\n');

    const messages: Message[] = [
      {
        role: 'system',
        content: 'You are a product strategy expert. Refine the solutions to be specific, feasible, and aligned with the product vision and user needs.'
      }
    ];

    if (context) {
      messages.push({
        role: 'system',
        content: `Context:\n${context}`
      });
    }

    messages.push({
      role: 'user',
      content: input
    });

    const completion = await getOpenAIClient().chat.completions.create({
      messages,
      model: 'gpt-4-turbo-preview',
    });

    return completion.choices[0]?.message?.content || input;
  } catch (error) {
    throw new LLMError(`Failed to refine solutions: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
  
  