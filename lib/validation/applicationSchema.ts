import { z } from "zod";
import { OTHER_UNIVERSITY_VALUE } from "@/data/universities";
import { OTHER_CAREER_INTEREST_VALUE } from "@/data/formOptions";
import {
  ACCEPTED_CV_EXTENSIONS,
  ACCEPTED_CV_MIME_TYPES,
  MAX_CV_SIZE_BYTES,
} from "@/lib/constants";

// Loose-ish but real-world phone validation: digits, spaces, +, -, () allowed.
const phoneRegex = /^\+?[0-9\s()-]{8,20}$/;
const linkedinRegex = /^https?:\/\/(www\.)?linkedin\.com\/.+/i;

// ---------------------------------------------------------------------------
// Base (un-refined) object schemas — kept separate from their `.superRefine`
// wrapped counterparts so they can still be combined with `.merge()`
// (Zod does not allow merging ZodEffects, only plain ZodObjects).
// ---------------------------------------------------------------------------

export const personalInfoSchema = z.object({
  firstName: z.string().trim().min(2, "Моля, въведи име (поне 2 символа).").max(100),
  lastName: z.string().trim().min(2, "Моля, въведи фамилия (поне 2 символа).").max(100),
  email: z.string().trim().min(1, "Имейлът е задължителен.").email("Моля, въведи валиден имейл."),
  phone: z
    .string()
    .trim()
    .min(1, "Телефонът е задължителен.")
    .regex(phoneRegex, "Моля, въведи валиден телефонен номер."),
});

const educationBaseSchema = z.object({
  university: z.string().min(1, "Моля, избери университет."),
  customUniversity: z.string().trim().max(200).optional().default(""),
  specialty: z.string().trim().min(2, "Моля, въведи специалност.").max(200),
  studyYear: z.string().min(1, "Моля, избери курс."),
  degree: z.enum(["bachelor", "master", "phd", "other"], {
    errorMap: () => ({ message: "Моля, избери степен." }),
  }),
});

function refineCustomUniversity<T extends z.infer<typeof educationBaseSchema>>(
  data: T,
  ctx: z.RefinementCtx
) {
  if (data.university === OTHER_UNIVERSITY_VALUE && data.customUniversity.trim().length < 2) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["customUniversity"],
      message: "Моля, въведи името на университета си.",
    });
  }
}

// ---- Step 2: Образование ----
export const educationSchema = educationBaseSchema.superRefine(refineCustomUniversity);

const preferencesBaseSchema = z.object({
  experienceLevel: z.enum(["none", "under_1_year", "1_2_years", "over_2_years"], {
    errorMap: () => ({ message: "Моля, избери ниво на опит." }),
  }),
  careerInterests: z.array(z.string()).min(1, "Моля, избери поне едно направление."),
  otherCareerInterest: z.string().trim().max(200).optional().default(""),
  opportunityPreferences: z.array(z.string()).min(1, "Моля, избери поне един тип възможност."),
  expectations: z
    .string()
    .trim()
    .min(10, "Моля, сподели поне няколко думи (минимум 10 символа).")
    .max(2000),
  developmentGoals: z
    .string()
    .trim()
    .min(10, "Моля, сподели поне няколко думи (минимум 10 символа).")
    .max(2000),
  linkedinUrl: z
    .string()
    .trim()
    .optional()
    .default("")
    .refine((v) => v === "" || linkedinRegex.test(v), {
      message: "Моля, въведи валиден LinkedIn адрес (напр. https://linkedin.com/in/...).",
    }),
});

function refineOtherCareerInterest<T extends z.infer<typeof preferencesBaseSchema>>(
  data: T,
  ctx: z.RefinementCtx
) {
  if (
    data.careerInterests.includes(OTHER_CAREER_INTEREST_VALUE) &&
    data.otherCareerInterest.trim().length < 2
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["otherCareerInterest"],
      message: "Моля, опиши направлението си.",
    });
  }
}

// ---- Step 3: Какво търсиш ----
export const preferencesSchema = preferencesBaseSchema.superRefine(refineOtherCareerInterest);

// ---- Step 4: CV и финализиране ----
// The File object itself is only meaningfully validated client-side (it
// never reaches the server as a plain File — it's sent as multipart data).
export const finalStepClientSchema = z.object({
  cvFile: z
    .custom<File | null>()
    .refine((file) => file instanceof File, "Моля, прикачи автобиография (CV).")
    .refine(
      (file) => !file || file.size <= MAX_CV_SIZE_BYTES,
      "Файлът е твърде голям (максимум 5 MB)."
    )
    .refine((file) => {
      if (!file) return false;
      const okType = (ACCEPTED_CV_MIME_TYPES as readonly string[]).includes(file.type);
      const okExt = ACCEPTED_CV_EXTENSIONS.some((ext) => file.name.toLowerCase().endsWith(ext));
      return okType || okExt;
    }, "Разрешени формати: PDF, DOC, DOCX."),
  gdprConsent: z.literal(true, {
    errorMap: () => ({
      message: "Трябва да приемеш Политиката за поверителност, за да продължиш.",
    }),
  }),
  // Honeypot — must stay empty. Real users never see or fill this field.
  companyWebsite: z.string().max(0).optional().default(""),
});

// Full payload validated again, server-side, on submit (brief section 29) —
// mirrors steps 1-3 plus consent + honeypot, minus the file itself (handled
// separately as multipart form data by the API route).
export const applicationServerSchema = personalInfoSchema
  .merge(educationBaseSchema)
  .merge(preferencesBaseSchema)
  .extend({
    gdprConsent: z.literal(true, {
      errorMap: () => ({ message: "GDPR съгласието е задължително." }),
    }),
    companyWebsite: z.string().max(0).optional().default(""),
  })
  .superRefine((data, ctx) => {
    refineCustomUniversity(data, ctx);
    refineOtherCareerInterest(data, ctx);
  });

// Combined schema for the whole client-side multi-step form (used by the
// single useForm() instance in ApplyFormClient — each step only triggers
// validation for its own fields via STEP_FIELDS below, but the resolver
// itself covers everything so a final full-form check happens for free
// right before submit too).
export const applyFormSchema = personalInfoSchema
  .merge(educationBaseSchema)
  .merge(preferencesBaseSchema)
  .merge(finalStepClientSchema)
  .superRefine((data, ctx) => {
    refineCustomUniversity(data, ctx);
    refineOtherCareerInterest(data, ctx);
  });

export const STEP_FIELDS = [
  ["firstName", "lastName", "email", "phone"],
  ["university", "customUniversity", "specialty", "studyYear", "degree"],
  [
    "experienceLevel",
    "careerInterests",
    "otherCareerInterest",
    "opportunityPreferences",
    "expectations",
    "developmentGoals",
    "linkedinUrl",
  ],
  ["cvFile", "gdprConsent", "companyWebsite"],
] as const;

export type PersonalInfoValues = z.infer<typeof personalInfoSchema>;
export type EducationValues = z.infer<typeof educationSchema>;
export type PreferencesValues = z.infer<typeof preferencesSchema>;
export type FinalStepValues = z.infer<typeof finalStepClientSchema>;
export type ApplicationServerValues = z.infer<typeof applicationServerSchema>;

// The full client-side form state, merged across all 4 steps.
export type ApplyFormValues = PersonalInfoValues &
  EducationValues &
  PreferencesValues &
  Omit<FinalStepValues, "cvFile"> & { cvFile: File | null };
