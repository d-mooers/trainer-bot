import { z } from "zod"

export const ActivityLevel = {
  Sedentary: "sedentary",
  LightlyActive: "lightlyActive",
  ModeratelyActive: "moderatelyActive",
  VeryActive: "veryActive",
  ExtraActive: "extraActive",
} as const

export const DietType = {
  Balanced: "balanced",
  HighProtein: "highProtein",
  LowCarb: "lowCarb",
  PlantBased: "plantBased",
  Unregulated: "unregulated",
} as const

export const FitnessGoalType = {
  StrengthGain: "strengthGain",
  Hyperthrophy: "hyperthrophy",
  FatLoss: "fatLoss",
  Endurance: "endurance",
  AthleticPerformance: "athleticPerformance",
  Mobility: "mobility",
  OverallHealth: "overallHealth",
} as const

export const ExerciseType = {
  Machines: "machines",
  FreeWeights: "freeWeights",
  BodyWeight: "bodyWeight",
  Running: "running",
  Swimming: "swimming",
  Cycling: "cycling",
  Yoga: "yoga",
} as const

export const PreferenceType = {
  Love: "love",
  Prefer: "prefer",
  Dislike: "dislike",
  Neutral: "neutral",
  Hate: "Hate",
} as const

export const fitnessSurveySchema = z.object({
  age: z
    .number()
    .min(18, "You must be 18 or older")
    .max(120, "You must be 120 or younger")
    .refine((data) => data > 0, "You must be 18 or older"),
  height: z.string().refine((data) => data !== "", "You must enter a height"),
  weight: z.string().refine((data) => data !== "", "You must enter a weight"),
  sex: z.string().refine((data) => data !== "", "You must enter a sex"),
  activityLevel: z.nativeEnum(ActivityLevel),
  dietType: z.nativeEnum(DietType),
  fitnessGoalType: z.nativeEnum(FitnessGoalType),
  daysPerWeek: z
    .number()
    .min(1, "You must exercise at least once a week")
    .max(7, "You can't exercise more than 7 days a week"),
  durationOfWorkoutSeconds: z
    .number()
    .min(0, "You can't exercise for negative time")
    .max(24 * 60 * 60),
  exercisePreferences: z.object(
    Object.fromEntries(
      Object.keys(ExerciseType).map((k) => [
        k,
        z.nativeEnum(PreferenceType).default(PreferenceType.Neutral),
      ])
    )
  ),
})

export type FitnessSurvey = z.infer<typeof fitnessSurveySchema>

export const fitnessSurveyDefaultValues: Partial<FitnessSurvey> = {
  age: 18,
  height: "",
  weight: "",
  activityLevel: ActivityLevel.Sedentary,
  dietType: DietType.Balanced,
  fitnessGoalType: FitnessGoalType.StrengthGain,
  daysPerWeek: 3,
  durationOfWorkoutSeconds: 60 * 60,
  exercisePreferences: Object.fromEntries(
    Object.keys(ExerciseType).map((k) => [k, PreferenceType.Neutral])
  ),
}
