
import { GoogleGenAI, Type } from "@google/genai";
import { BriefingResponse } from "../types";

export const generateSmartBriefing = async (topic: string): Promise<BriefingResponse> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("مفتاح API غير متوفر");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    أنت محلل أعمال وتقنية خبير لصحيفة "Entrepreneur NASHRA".
    قم بإنشاء تقرير موجز وتحليلي حول الموضوع التالي: "${topic}".
    يجب أن يكون التقرير باللغة العربية الفصحى المهنية.
    
    المخرجات المطلوبة بتنسيق JSON:
    1. title: عنوان جذاب للتقرير.
    2. summary: ملخص تنفيذي (حوالي 50 كلمة).
    3. keyPoints: قائمة من 3-5 نقاط رئيسية أو إحصائيات متوقعة.
    4. outlook: نظرة مستقبلية قصيرة (20 كلمة).
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            summary: { type: Type.STRING },
            keyPoints: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            outlook: { type: Type.STRING }
          },
          required: ["title", "summary", "keyPoints", "outlook"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("لم يتم استلام رد من النموذج");

    const data = JSON.parse(text) as BriefingResponse;
    return data;

  } catch (error) {
    console.error("Error generating briefing:", error);
    throw new Error("حدث خطأ أثناء توليد التحليل. يرجى المحاولة لاحقاً.");
  }
};

export const summarizeArticle = async (title: string, content: string): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("مفتاح API غير متوفر");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    أنت مساعد ذكي لصحيفة "Entrepreneur NASHRA". 
    قم بتلخيص المقال التالي بأسلوب نقاط مختصرة وجذابة (بحد أقصى 3 نقاط).
    اجعل الملخص مفيداً لرواد الأعمال والتقنيين.
    المقال بعنوان: "${title}"
    المحتوى: "${content.substring(0, 2000)}"
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    const text = response.text;
    if (!text) throw new Error("فشل توليد الملخص");
    return text;
  } catch (error) {
    console.error("Summarization error:", error);
    throw new Error("عذراً، فشل توليد الملخص الذكي.");
  }
};
