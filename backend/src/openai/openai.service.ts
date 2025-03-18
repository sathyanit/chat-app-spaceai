import { Injectable } from '@nestjs/common';
import OpenAI from "openai";

@Injectable()
export class OpenAiService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY, // Ensure this is set in your .env file
    });
  }

  async generateMessage(prompt: string): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
      });

      return response.choices[0]?.message?.content || "No response from AI";
    } catch (error) {
      console.error("OpenAI API Error:", error);
      return "Error generating response";
    }
  }
}
