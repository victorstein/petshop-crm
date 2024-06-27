import { onRequest } from 'firebase-functions/v2/https'
import * as logger from 'firebase-functions/logger'

export const collectibleCardRewardGeneration = onRequest((request, response) => {
    logger.info('collectibleCardRewardGeneration', { structuredData: true })
    response.send('TODO: Implement Gemini to send image prompt and collectible card description to IGS')
})

export const collectibleCardRewardPersistence = onRequest((request, response) => {
    logger.info('collectibleCardRewardPersistence', { structuredData: true })
    response.send('TODO: Collectible assets handler (storage and db update)')
})

export const pixarProfileImageGeneration = onRequest((request, response) => {
    logger.info('pixarProfileImageGeneration', { structuredData: true })
    response.send('TODO: Trigger to call IGS for the Pixar versions of the profile image, using Gemini and Replicate')
})

export const pixarProfileImagePersistence = onRequest((request, response) => {
    logger.info('pixarProfileImagePersistence', { structuredData: true })
    response.send('TODO: Store Pixar image (storage and db update)')
})
