import admin from 'firebase-admin'
import * as fireorm from 'fireorm'

const serviceAccount = require('./firebase-key.json')

admin.initializeApp({
  credential: serviceAccount
})

const db = admin.firestore()
fireorm.initialize(db, { validateModels: true })
