import { WorkoutPlan } from "@/types/exercise"

export async function generatePlan(base64Answers: string) {
  const result = await fetch(`${process.env.HOST}/api?answers=${base64Answers}`)

  const data: { functionParameters: WorkoutPlan } = await result.json()
  return data.functionParameters.plan
}
