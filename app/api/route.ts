import { isAxiosError } from "axios"
import { config as dconfig } from "dotenv"
import { Configuration, OpenAIApi } from "openai"

dconfig()

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(config)

const questionFormat = {
  type: "object",
  properties: {
    question: {
      type: "string",
      required: true,
    },
    format: {
      type: "string",
      oneOf: [
        "short-answer",
        "long-answer",
        "multiple-choice",
        "true-false",
        "numeric",
      ],
      required: true,
    },
    options: {
      type: "array",
      required: `format === 'multiple-choice'`,
      items: {
        type: "object",
        properties: {
          id: {
            type: "string",
            required: true,
          },
          label: {
            type: "string",
            required: true,
          },
          additionalInfo: {
            type: "string",
            required: false,
            description:
              "Any additional information that the user should know about this option",
          },
        },
      },
    },
  },
}

const responseFormat = {
  type: "object",
  properties: {
    toClient: {
      type: "string",
      required: true,
      description:
        "The message that the client will see.  The clien is the one who is having the workout made for them.",
    },
    toTrainer: {
      type: "array",
      items: questionFormat,
      required: false,
      description:
        "Any questions that the trainer should ask their client in order to provide sufficient information for the assistant to create their workout plan",
    },
  },
}

const exerciseFormat = {
  type: "object",
  properties: {
    name: {
      type: "string",
      // required: true
    },
    description: {
      type: "string",
      // required: true
    },
    reps: {
      type: "number",
      // required: true
    },
    sets: {
      type: "number",
      // required: true
    },
    rest: {
      type: "number",
      // required: true,
      description: "Time in seconds between sets",
    },
  },
}

const planFormatAgain = {
  type: "object",
  properties: {
    plan: {
      type: "object",
      properties: {
        day: {
          type: "string",
        },
      },
    },
  },
}

const planFormat = {
  type: "object",
  properties: {
    plan: {
      type: "array",
      items: {
        type: "object",
        properties: {
          day: {
            type: "string",
            // required: true
          },
          focus: {
            type: "string",
            // required: true,
            description: "The muscle group(s) that the workout is focused on",
          },
          exercises: {
            type: "array",
            items: exerciseFormat,
          },
        },
      },
    },
  },
}

type QuestionFormat = {
  question: string
  format:
    | "short-answer"
    | "long-answer"
    | "multiple-choice"
    | "true-false"
    | "numeric"
    | "multi-input"
} & {
  format: "multiple-choice"
  options: {
    value: string
    description?: string
  }[]
}

type ResponseFormat = {
  toClient: string
  questions?: QuestionFormat[]
}

const userInfo = {
  age: 23,
  height: "5ft 6in",
  weight: "170lbs",
  activity_level: "moderate",
  diet: "high protein",
  general_focus: "hypertrophy",
  workout_preferences: {
    days_per_week: 5,
    total_workout_duration_seconds: 60 * 60,
    machines: "okay",
    free_weights: "preferred",
    running: "not preferred",
    swimming: "no",
    cycling: "okay",
  },
  current_maxes: {
    bench: 225,
    squat: 405,
    deadlift: 455,
  },
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const answersBase64 = searchParams.get("answers")
  if (!answersBase64) {
    return new Response(
      JSON.stringify({
        message: "Please provide answers as a base64 encoded string",
      }),
      {
        status: 400,
        headers: {
          "content-type": "application/json",
        },
      }
    )
  }
  const answers: typeof userInfo = JSON.parse(
    Buffer.from(answersBase64, "base64").toString("utf-8")
  )
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo-0613",
    messages: [
      {
        role: "system",
        content: `Assistant is a world-renowned personal trainer and chef.  Assistant makes excellent workout plans tailored specifically to user needs.`,
      },
      {
        role: "assistant",
        content:
          "I am here to make you a specic workout plan, but I need some of your info first! Please provide your info as a JSON",
      },
      {
        role: "user",
        content: JSON.stringify(answers),
      },
      {
        role: "user",
        content: `Use function call to generate my workout plan`,
      },
    ],
    functions: [
      {
        name: "create_weekly_workout_plan",
        description:
          "Accepts a json object that describes the workout plan for the week, and adds it to the user profile",
        parameters: planFormat,
      },
    ],
    temperature: 1,
  })
  const message = JSON.parse(
    completion.data.choices[0].message?.content ?? "{}"
  )
  const functionCall = completion.data.choices[0].message?.function_call
  const functionName = functionCall?.name
  const functionParameters = JSON.parse(functionCall?.arguments ?? "{}")

  return new Response(
    JSON.stringify({
      message,
      functionName,
      functionParameters,
    }),
    {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    }
  )
}
