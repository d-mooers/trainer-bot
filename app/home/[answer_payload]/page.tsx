import { Suspense } from "react"

import { generatePlan } from "@/lib/user-info/generatePlan"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

function WorkoutTablePlaceholder() {
  return (
    <div className="flex flex-col gap-4 max-w-[980px]">
      <div className="flex gap-4 mb-10">
        {new Array(3).fill(0).map((_, i) => (
          <Skeleton key={i} className="w-[200px] h-[100px]" />
        ))}
      </div>
      <Skeleton className="w-full h-[400px]" />
    </div>
  )
}

async function WorkoutTable({ base64Answers }: { base64Answers: string }) {
  const plan = await generatePlan(base64Answers)

  if (plan.length === 0) return <p>Empty plan</p>

  return (
    <div className="flex flex-col gap-4 max-w-[980px]">
      <div className="flex gap-4 mb-10">
        {plan.map((_, i) => (
          <Card>
            <CardHeader>
              <CardTitle>{plan[i].day}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                <b>Focus:</b> {plan[i].focus}
              </p>
              <p className="text-sm text-muted-foreground">
                <b>Total Exercises: </b>
                {plan[i].exercises.length}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      {plan.map((p) => (
        <div
          key={p.day}
          className="flex max-w-[980px] flex-col items-start gap-2 mb-5"
        >
          <div className="flex gap-4">
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight text-muted-foreground">
              {p.day}
            </h3>
            <Badge className="bg-muted-foreground">{p.focus}</Badge>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Exercise</TableHead>
                <TableHead>Reps</TableHead>
                <TableHead>Sets</TableHead>
                <TableHead>Rest</TableHead>
                <TableHead>Instructions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {p.exercises.map((e) => (
                <TableRow key={e.name}>
                  <TableCell>{e.name}</TableCell>
                  <TableCell>{e.reps}</TableCell>
                  <TableCell>{e.sets}</TableCell>
                  <TableCell>{e.rest}</TableCell>
                  <TableCell>{e.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ))}
    </div>
  )
}

export default function WorkoutPlanPage({
  params,
}: {
  params: { answer_payload: string }
}) {
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Your needs. Your plan.
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          Meet your customized fitness plan. Upgrade to premium to generate more
          plans, modify specific exercises, and more.
        </p>
      </div>

      <Suspense fallback={<WorkoutTablePlaceholder />}>
        <WorkoutTable base64Answers={params.answer_payload} />
      </Suspense>
    </section>
  )
}
