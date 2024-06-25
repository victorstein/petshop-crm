/* eslint-disable react/jsx-no-target-blank */
import type { FC } from 'react'
import { useAi } from '../ai/hooks'
import { WelcomePropmt } from '../ai/promts'

const Index: FC = () => {
  const { response, isLoading } = useAi(WelcomePropmt)
  return (
    <>{isLoading ? 'AI is generating content, please wait...' : response}</>
  )
}

export default Index
