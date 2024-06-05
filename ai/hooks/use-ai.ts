import { useState, useEffect } from 'react'
import { runPrompt } from '../../integrations/firebase'

export function useAi(initialPrompt: string): {
    response: string
    isLoading: boolean
    error: Error | null
    setPrompt: React.Dispatch<React.SetStateAction<string>>
} {
    const [prompt, setPrompt] = useState(initialPrompt)
    const [response, setResponse] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
        const fetchResponse = async (): Promise<void> => {
            if (prompt.trim() === '') return

            try {
                setIsLoading(true)
                const result = await runPrompt(prompt)
                setResponse(result)
                setError(null)
            } catch (err) {
                setError(err as Error)
                setResponse('')
            } finally {
                setIsLoading(false)
            }
        }
        void fetchResponse()
    }, [prompt])

    return { response, isLoading, error, setPrompt }
}
