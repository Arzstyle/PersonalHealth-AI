import Groq from "groq-sdk";

export const API_KEY =
  "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";
export const MODEL = "llama-3.3-70b-versatile";

const groq = new Groq({ apiKey: API_KEY, dangerouslyAllowBrowser: true });

export interface AIResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export const generateAIContent = async (
  prompt: string
): Promise<AIResponse> => {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: MODEL,
    });

    let text = completion.choices[0]?.message?.content || "";

    // Aggressively find the JSON substring
    const firstBrace = text.indexOf("{");
    const lastBrace = text.lastIndexOf("}");

    if (firstBrace !== -1 && lastBrace !== -1) {
      text = text.substring(firstBrace, lastBrace + 1);
    } else {
      // Fallback cleanup if braces aren't clear (though for JSON validation, braces are required)
      text = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
    }

    return { success: true, data: text };
  } catch (error: any) {
    return { success: false, error: error.message || "Unknown error occurred" };
  }
};
