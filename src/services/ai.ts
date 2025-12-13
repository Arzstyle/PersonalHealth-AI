import Groq from "groq-sdk";

export const API_KEY = import.meta.env.VITE_GROQ_API_KEY || "";
export const MODEL = "llama-3.3-70b-versatile";

const groq = new Groq({ apiKey: API_KEY, dangerouslyAllowBrowser: true });

export interface AIResponse {
  success: boolean;
  data?: any;
  error?: string;
}

function extractFirstJson(text: string): string {
  // Find first opening brace
  const startIndex = text.indexOf("{");
  if (startIndex === -1) return text.trim();

  let braceCount = 0;
  let inString = false;
  let endIndex = -1;

  for (let i = startIndex; i < text.length; i++) {
    const char = text[i];

    // Toggle string state, handling escaped quotes
    if (char === '"' && text[i - 1] !== "\\") {
      inString = !inString;
    }

    if (!inString) {
      if (char === "{") {
        braceCount++;
      } else if (char === "}") {
        braceCount--;
        if (braceCount === 0) {
          endIndex = i;
          break;
        }
      }
    }
  }

  if (endIndex !== -1) {
    return text.substring(startIndex, endIndex + 1);
  }

  // If we couldn't find a balanced closing brace, fall back to simple trim or lastIndexOf
  // But usually, returning from start to string end is a safer best-effort if truncation happened
  return text.substring(startIndex).trim();
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

    // Remove markdown code blocks first
    text = text.replace(/```json/g, "").replace(/```/g, "");

    // Use smart extraction
    const cleanData = extractFirstJson(text);

    return { success: true, data: cleanData };
  } catch (error: any) {
    console.error("Groq AI Error:", error);
    return { success: false, error: error.message || "Unknown error occurred" };
  }
};
