export type ExerciseFormat = {
  name: string
  description?: string
  reps: number
  sets: number
  rest: number // Time in seconds between sets
}

export type PlanFormat = {
  day: string
  focus: string // The muscle group(s) that the workout is focused on
  exercises: ExerciseFormat[]
}

export type WorkoutPlan = {
  plan: PlanFormat[]
}
