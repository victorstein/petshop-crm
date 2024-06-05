import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getVertexAI, getGenerativeModel } from 'firebase/vertexai-preview'

// Initialize Firebase
export const firebase = initializeApp({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
})

// Database
export const db = getFirestore(firebase)

// AI related
const vertexAI = getVertexAI(firebase)
const model = getGenerativeModel(vertexAI, { model: 'gemini-1.5-flash' })

export async function runPrompt(prompt: string): Promise<string> {
  const result = await model.generateContent(prompt)
  const response = result.response
  return response.text()
}
