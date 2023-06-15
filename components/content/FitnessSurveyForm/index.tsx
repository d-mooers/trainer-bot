"use client"

import { useRouter } from "next/router"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import {
  ActivityLevel,
  DietType,
  FitnessGoalType,
  FitnessSurvey,
  fitnessSurveyDefaultValues,
  fitnessSurveySchema,
} from "@/lib/user-info/fitness-survey"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"

import {
  MultipleChoiceInput,
  NumericalInput,
  ShortAnswerInput,
} from "./FormItems"

const formSchema = z.object({
  age: z
    .number()
    .min(18, "You must be 18 or older")
    .max(120, "You must be 120 or younger")
    .refine((data) => data > 0, "You must be 18 or older"),
  height: z.string().refine((data) => data !== "", "You must enter a height"),
  weight: z.string().refine((data) => data !== "", "You must enter a weight"),
})

export function FitnessSurveyForm() {
  const form = useForm<FitnessSurvey>({
    resolver: zodResolver(fitnessSurveySchema),
    defaultValues: fitnessSurveyDefaultValues,
  })

  function onSubmit(values: FitnessSurvey) {
    const base64Answers = Buffer.from(JSON.stringify(values)).toString("base64")
    window.open(`/api/assistant/plan?answers=${base64Answers}`)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <NumericalInput
          control={form.control}
          name="age"
          label="Age"
          description="How old are you?"
        />
        <ShortAnswerInput
          control={form.control}
          name="height"
          label="Height"
          description="How tall are you? (enter in __ ft __ in, I do not have validation set up yet)"
        />
        <ShortAnswerInput
          control={form.control}
          name="weight"
          label="Weight"
          description="How much do you weigh? (enter in __ lbs, I do not have validation set up yet)"
        />
        <MultipleChoiceInput
          control={form.control}
          name="activityLevel"
          label="Activity Level"
          options={Object.values(ActivityLevel).map((level) => ({
            label: level,
            value: level,
          }))}
        />
        <MultipleChoiceInput
          control={form.control}
          name="dietType"
          label="Diet Type (Current)"
          options={Object.values(DietType).map((level) => ({
            label: level,
            value: level,
          }))}
        />
        <NumericalInput
          control={form.control}
          name="daysPerWeek"
          label="Workout Days Per Week"
          description="How many days per week do you want to workout?"
        />

        <MultipleChoiceInput
          control={form.control}
          name="fitnessGoalType"
          label="Goal"
          description="What is your overall fitness goal?"
          options={Object.values(FitnessGoalType).map((level) => ({
            label: level,
            value: level,
          }))}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
