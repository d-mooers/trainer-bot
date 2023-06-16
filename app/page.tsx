import Link from "next/link"

import { siteConfig } from "@/config/site"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FitnessSurveyForm } from "@/components/content/FitnessSurveyForm"

export default function IndexPage() {
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Exercise plans <br className="hidden sm:inline" />
          crafted for your needs.
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          Meet your fitness goals how you want to. Fill out the form to get
          started.
        </p>
      </div>
      <div className="flex gap-4">
        <Link
          href={siteConfig.links.docs}
          target="_blank"
          rel="noreferrer"
          className={buttonVariants()}
        >
          Documentation
        </Link>
        <Link
          target="_blank"
          rel="noreferrer"
          href={siteConfig.links.github}
          className={buttonVariants({ variant: "outline" })}
        >
          GitHub
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Fitness Survey</CardTitle>
          <p className="text-sm text-muted-foreground">
            Please fill out this survey so we generate a fully personalized
            workout plan.
          </p>
        </CardHeader>
        <CardContent>
          <FitnessSurveyForm />
        </CardContent>
      </Card>
    </section>
  )
}
