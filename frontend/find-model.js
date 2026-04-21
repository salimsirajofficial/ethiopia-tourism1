import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read .env manually to avoid dependency issues
const envPath = path.join(__dirname, ".env");
const envContent = fs.readFileSync(envPath, "utf8");
const API_KEY_MATCH = envContent.match(/VITE_GEMINI_API_KEY=(.*)/);
const API_KEY = API_KEY_MATCH ? API_KEY_MATCH[1].trim() : null;

async function listModels() {
  if (!API_KEY) {
    console.error("No API key found in .env");
    return;
  }

  const genAI = new GoogleGenerativeAI(API_KEY);
  
  try {
    // There is no direct "listModels" in the simple SDK, 
    // but we can try to hit a known model and check the error or just try a few.
    console.log("Checking models for API key...");
    
    const modelsToTry = ["gemini-2.0-flash", "gemini-2.0-flash-lite", "gemini-1.5-flash"];
    
    for (const modelName of modelsToTry) {
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hi");
            const response = await result.response;
            console.log(`- ${modelName}: SUCCESS!`);
            return; // Found a working one
        } catch (e) {
            console.log(`- ${modelName}: FAILED (${e.message})`);
        }
    }
  } catch (error) {
    console.error("General error:", error);
  }
}

listModels();
