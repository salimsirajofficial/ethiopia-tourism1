import { GoogleGenerativeAI } from "@google/generative-ai";

const DEFAULT_GEMINI_MODEL = "gemini-flash-lite-latest";
const FALLBACK_GEMINI_MODELS = ["gemini-2.0-flash-lite", "gemini-1.5-flash", "gemini-2.0-flash"];

export const sendMessageToGemini = async (history, message) => {
  // Use VITE_ prefix to ensure it's loaded in the browser context
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  const configuredModel = import.meta.env.VITE_GEMINI_MODEL?.trim();

  if (!API_KEY || API_KEY.trim() === "" || API_KEY.includes("your_actual_key")) {
    return {
      role: "model",
      parts: [{ text: "It seems your Gemini API key is not configured. Please add VITE_GEMINI_API_KEY to your .env file and restart the dev server!" }]
    };
  }

  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const modelNames = [...new Set([configuredModel, DEFAULT_GEMINI_MODEL, ...FALLBACK_GEMINI_MODELS].filter(Boolean))];

    // Formatting history for standard Gemini Requirements
    // 1. History cannot start with a model message (it must start with a user message).
    // 2. Roles must strictly alternate between 'user' and 'model'.
    const validHistory = history
      .filter((msg, index) => {
        // Skip the very first message if it's from the model (the welcome message)
        if (index === 0 && msg.role === "model") return false;
        return true;
      })
      .map(msg => ({
        role: msg.role === "model" ? "model" : "user",
        parts: Array.isArray(msg.parts) ? msg.parts : [{ text: msg.message || "" }]
      }));
    
    let lastError = null;

    for (const modelName of modelNames) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: "You are a friendly and professional Ethiopia Tourism assistant. Your goal is to help users learn about Ethiopia's heritage, culture, and travel destinations. Keep responses concise and use a warm tone.",
        });

        const chat = model.startChat({
          history: validHistory,
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;

        return {
          role: "model",
          parts: [{ text: response.text() }]
        };
      } catch (error) {
        lastError = error;

        // If the model is not found or we hit a quota limit, try the next fallback model
        const isQuotaError = error.message?.includes("429") || error.message?.includes("quota");
        const isNotFoundError = error.message?.includes("not found");

        if (isQuotaError || isNotFoundError) {
          console.warn(`Model ${modelName} failed (${isQuotaError ? 'Quota' : 'Not Found'}), trying next...`);
          continue;
        }
        
        // For other critical errors, rethrow immediately
        throw error;
      }
    }

    throw lastError;
  } catch (error) {
    console.error("Gemini API Full Error:", error);

    // Provide user-friendly hints for common failure reasons
    if (error.message?.includes("429") || error.message?.includes("quota")) {
      return {
        role: "model",
        parts: [{ text: "I've reached my daily limit of responses on the free tier! Please wait a moment or try again tomorrow." }]
      };
    }

    if (error.message?.includes("not found")) {
      return {
        role: "model",
        parts: [{ text: "My chat models are currently unavailable. Please check your API configuration or try again in a moment." }]
      };
    }

    return {
      role: "model",
      parts: [{ text: "I'm having a little trouble connecting to my brain right now. Please try again in a moment!" }]
    };
  }
};
