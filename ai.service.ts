import { Injectable } from '@nestjs/common';
import { Configuration, OpenAIApi } from 'openai';

@Injectable()
export class AIService {
  private openai: OpenAIApi;

  constructor() {
    this.openai = new OpenAIApi(
      new Configuration({ apiKey: process.env.OPENAI_API_KEY }),
    );
  }

  async getAIResponse(prompt: string): Promise<string> {
    const response = await this.openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    });
    return response.data.choices[0].message?.content || 'No response';
  }
}
