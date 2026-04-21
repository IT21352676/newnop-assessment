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
You are an issue triage expert. Analyze the issue and return ONLY valid JSON — no markdown, no preamble, no backticks.

ISSUE DETAILS:
Title: ${issue.title}
Description: ${issue.description}
Status: ${issue.status}
Priority: ${issue.priority}
Severity: ${issue.severity}
Additional Fields:
${optionalFieldsText}

Return this exact JSON shape:
{
  "classification": {
    "type": "string (e.g. UI / Functional)",
    "component": "string (e.g. Frontend - Update Detail Screen)"
  },
  "prioritySeverity": {
    "currentPriority": "string",
    "suggestedPriority": "string",
    "currentSeverity": "string",
    "suggestedSeverity": "string",
    "rationale": "string"
  },
  "isUnclear": true | false,
  "missingInfo": ["string"] | [],
  "rootCauses": [{ "area": "string", "cause": "string" }] | [],
  "suggestedFixes": ["string"] | [],
  "debuggingSteps": [{ "step": number, "action": "string" }] | [],
  "jiraComment": "string (plain text, professional tone)"
}

IMPORTANT RULES:
- If isUnclear is true, set rootCauses, suggestedFixes, debuggingSteps to empty arrays
- Be concise but actionable
- Return ONLY the JSON object
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
