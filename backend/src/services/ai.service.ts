import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IssueDto } from '../interfaces/types';

function buildPrompt(issue: IssueDto): string {
  const optionalFieldsText = issue.optionalFields?.length
    ? issue.optionalFields.map((f) => `- ${f.name}: ${f.value}`).join('\n')
    : 'None';

  return `
You are a senior software engineer and issue triage expert.

Analyze the issue and provide a structured response.

----------------------
TASKS:
1. Classify the bug type
2. Evaluate and suggest better Priority and Severity (if needed)
3. Identify:
   - Possible root causes
   - Suggested fixes
   - Debugging steps
4. Detect if the issue is unclear or lacks sufficient detail
5. Generate a professional Jira-style comment

----------------------
ISSUE DETAILS:

Title: ${issue.title}
Description: ${issue.description}
Status: ${issue.status}
Priority: ${issue.priority}
Severity: ${issue.severity}

Additional Fields:
${optionalFieldsText}

----------------------
OUTPUT FORMAT:

### Clarity Assessment
- Is the issue clear enough? (Yes/No)
- If No, what is missing?

### Bug Classification
- Type: 

### Priority & Severity Review
- Current Priority: ${issue.priority}
- Suggested Priority:
- Current Severity: ${issue.severity}
- Suggested Severity:
- Reasoning:

### Analysis
**Possible Root Causes:**
- ...

**Suggested Fixes:**
- ...

**Debugging Steps:**
- ...

### Jira Comment
(Write a concise, professional comment suitable for Jira)

----------------------
IMPORTANT:
- Remeber that if the issue lacks detail, clearly say so and DO NOT guess root causes
- Keep the response concise but useful
- Be practical and actionable
`;
}

@Injectable()
export class AIService {
  private apiKey: string | undefined;
  private readonly logger = new Logger(AIService.name);
  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>('GROQ_API_KEY');
    if (!this.apiKey) {
      this.logger.error(
        'GROQ_API_KEY is not defined in .env file, AI features will not work',
      );
    }
  }

  async getAIResponse(issue: IssueDto) {
    if (!this.apiKey) {
      this.logger.error(
        'Client try to use AI features but GROQ_API_KEY is not defined in .env file',
      );
      throw new BadRequestException(
        'AI environment configurations are not defined',
      );
    }

    try {
      let response = await fetch(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'openai/gpt-oss-120b',
            temperature: 1,
            //   max_completion_tokens: 8192,
            //   top_p: 1,
            //   stream: true,
            //   reasoning_effort: 'medium',
            //   stop: null,
            messages: [
              {
                role: 'user',
                content: buildPrompt(issue),
              },
            ],
          }),
        },
      );

      const result = await response.json();
      response = result.choices[0].message;
      return response;
    } catch (err) {
      this.logger.error('Error while fetching AI response', err);
      throw new InternalServerErrorException(
        'Error while fetching AI response',
      );
    }
  }
}
