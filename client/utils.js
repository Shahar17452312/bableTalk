import { GoogleGenerativeAI } from "@google/generative-ai";

 const askGemini=async(question)=>{
    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = "give a proper message for this last message "+question+". write 6 words max no matter what";

    const result = await model.generateContent(prompt);

    return result.response.text()
}

export default askGemini