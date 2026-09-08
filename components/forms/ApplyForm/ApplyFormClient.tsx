"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StepPersonalInfo } from "./StepPersonalInfo";
import { StepEducation } from "./StepEducation";
import { StepPreferences } from "./StepPreferences";
import { StepFinal } from "./StepFinal";
import {
  applyFormSchema,
  STEP_FIELDS,
  type ApplyFormValues,
} from "@/lib/validation/applicationSchema";
import { trackEvent } from "@/components/analytics/track";

const STEP_TITLES = ["За теб", "Образование", "Какво търсиш", "CV и финализиране"];

const DEFAULT_VALUES: ApplyFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  university: "",
  customUniversity: "",
  specialty: "",
  studyYear: "",
  degree: "bachelor",
  experienceLevel: "none",
  careerInterests: [],
  otherCareerInterest: "",
  opportunityPreferences: [],
  expectations: "",
  developmentGoals: "",
  linkedinUrl: "",
  cvFile: null,
  gdprConsent: false as unknown as true,
  companyWebsite: "",
};

type SubmitState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "error"; message: string }
  | { status: "duplicate"; message: string };

export function ApplyFormClient() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitState, setSubmitState] = useState<SubmitState>({ status: "idle" });
  const hasTrackedStart = useRef(false);

  const methods = useForm<ApplyFormValues>({
    resolver: zodResolver(applyFormSchema),
    defaultValues: DEFAULT_VALUES,
    mode: "onBlur",
  });

  const { trigger, handleSubmit } = methods;

  const goNext = useCallback(async () => {
    const fields = STEP_FIELDS[step];
    const valid = await trigger(fields as unknown as (keyof ApplyFormValues)[]);
    if (!valid) return;

    if (step === 0 && !hasTrackedStart.current) {
      hasTrackedStart.current = true;
      trackEvent("application_started");
    }

    setStep((s) => Math.min(s + 1, STEP_TITLES.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step, trigger]);

  const goBack = useCallback(() => {
    setStep((s) => Math.max(s - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const onSubmit = handleSubmit(async (values) => {
    setSubmitState({ status: "submitting" });

    try {
      const formData = new FormData();
      formData.append("firstName", values.firstName);
      formData.append("lastName", values.lastName);
      formData.append("email", values.email);
      formData.append("phone", values.phone);
      formData.append("university", values.university);
      formData.append("customUniversity", values.customUniversity ?? "");
      formData.append("specialty", values.specialty);
      formData.append("studyYear", values.studyYear);
      formData.append("degree", values.degree);
      formData.append("experienceLevel", values.experienceLevel);
      values.careerInterests.forEach((v) => formData.append("careerInterests", v));
      formData.append("otherCareerInterest", values.otherCareerInterest ?? "");
      values.opportunityPreferences.forEach((v) => formData.append("opportunityPreferences", v));
      formData.append("expectations", values.expectations);
      formData.append("developmentGoals", values.developmentGoals);
      formData.append("linkedinUrl", values.linkedinUrl ?? "");
      formData.append("gdprConsent", String(values.gdprConsent));
      formData.append("companyWebsite", values.companyWebsite ?? "");
      if (values.cvFile) formData.append("cvFile", values.cvFile);

      const response = await fetch("/api/apply", { method: "POST", body: formData });
      const data = (await response.json().catch(() => ({}))) as { error?: string; code?: string };

      if (response.status === 409) {
        setSubmitState({
          status: "duplicate",
          message:
            data.error ||
            "Изглежда вече си кандидатствал/а с този имейл. Ако искаш да актуализираш информацията си, свържи се с нас.",
        });
        return;
      }

      if (response.status === 429) {
        setSubmitState({
          status: "error",
          message: "Прекалено много опити. Моля, опитай отново след няколко минути.",
        });
        return;
      }

      if (!response.ok) {
        setSubmitState({
          status: "error",
          message: data.error || "Възникна грешка. Моля, опитай отново.",
        });
        return;
      }

      trackEvent("application_submitted");
      router.push("/apply/success");
    } catch {
      setSubmitState({
        status: "error",
        message: "Възникна грешка с връзката. Моля, провери интернет връзката си и опитай пак.",
      });
    }
  });

  const isSubmitting = submitState.status === "submitting";
  const progressPercent = ((step + 1) / STEP_TITLES.length) * 100;

  return (
    <FormProvider {...methods}>
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm font-semibold text-navy-500">
            <span>
              Стъпка {step + 1} от {STEP_TITLES.length}
            </span>
            <span className="text-navy-900">{STEP_TITLES[step]}</span>
          </div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-navy-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-400 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (step === STEP_TITLES.length - 1) {
              onSubmit();
            } else {
              goNext();
            }
          }}
          className="rounded-3xl border border-navy-100 bg-white p-6 shadow-card sm:p-9"
          noValidate
        >
          {step === 0 && <StepPersonalInfo />}
          {step === 1 && <StepEducation />}
          {step === 2 && <StepPreferences />}
          {step === 3 && <StepFinal />}

          {(submitState.status === "error" || submitState.status === "duplicate") && (
            <div className="mt-6 flex items-start gap-3 rounded-xl border border-coral-200 bg-coral-50 p-4 text-sm text-coral-700">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <p>{submitState.message}</p>
            </div>
          )}

          <div className="mt-8 flex items-center justify-between gap-4">
            {step > 0 ? (
              <Button type="button" variant="ghost" size="md" onClick={goBack} disabled={isSubmitting}>
                <ArrowLeft className="h-4 w-4" /> Назад
              </Button>
            ) : (
              <span />
            )}

            {step < STEP_TITLES.length - 1 ? (
              <Button type="submit" size="md">
                Напред <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button type="submit" size="md" loading={isSubmitting} disabled={isSubmitting}>
                {isSubmitting ? "Изпращаме кандидатурата ти..." : "Изпрати кандидатурата"}
              </Button>
            )}
          </div>
        </form>
      </div>
    </FormProvider>
  );
}
