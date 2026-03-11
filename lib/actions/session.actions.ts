'use server'

import VoiceSession from "@/db/models/voiceSession.model"
import { connectToDB } from "@/db/mongoose"
import { StartSessionResult } from "@/types"
import { getCurrentBillingPeriodStart } from "../subscriptions.constants"


export const startVoiceSession  = async (clerkId:string, bookId:string): Promise<StartSessionResult> => {
  try {
    await connectToDB()
    const session = await VoiceSession.create({
      clerkId,bookId,startedAt:new Date(),
      billingPeriodStart: getCurrentBillingPeriodStart(),
      durationSeconds:0
    })
    return{
      success:true,
      sessionId:session._id.toString()
    }
  } catch (error) {
    console.error('Error starting a session')
    return{
      success: false,
      error: "Voice session failed. Try again"

    }
  }
}

// endVoiceSession updates an existing voice session with end time and total duration
export const endVoiceSession = async (
  sessionId: string,
  durationSeconds: number
): Promise<{ success: boolean; error?: string }> => {
  try {
    await connectToDB()
    const update = {
      endedAt: new Date(),
      durationSeconds,
    }
    const result = await VoiceSession.findByIdAndUpdate(sessionId, update, { new: true })
    if (!result) {
      return { success: false, error: 'Session not found' }
    }
    return { success: true }
  } catch (error) {
    console.error('Error ending voice session', error)
    return { success: false, error: 'Failed to end voice session' }
  }
}