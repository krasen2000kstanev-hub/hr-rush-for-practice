"use client";

import { Controller, useFormContext, useWatch } from "react-hook-form";
import { TextField, TextAreaField, CheckboxChip, RadioCard } from "@/components/forms/fields";
import {
  CAREER_INTERESTS,
  OPPORTUNITY_PREFERENCES,
  OTHER_CAREER_INTEREST_VALUE,
  EXPERIENCE_OPTIONS,
} from "@/data/formOptions";
import type { ApplyFormValues } from "@/lib/validation/applicationSchema";

export function StepPreferences() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<ApplyFormValues>();

  const careerInterests = useWatch({ control, name: "careerInterests" }) ?? [];

  return (
    <div className="flex flex-col gap-7">
      <Controller
        control={control}
        name="experienceLevel"
        render={({ field }) => (
          <div>
            <p className="text-sm font-semibold text-navy-800">
              Имаш ли професионален опит?<span className="ml-0.5 text-coral-500">*</span>
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {EXPERIENCE_OPTIONS.map((opt) => (
                <RadioCard
                  key={opt.value}
                  name="experienceLevel"
                  value={opt.value}
                  label={opt.label}
                  checked={field.value === opt.value}
                  onChange={field.onChange}
                />
              ))}
            </div>
            {errors.experienceLevel && (
              <p className="mt-2 text-xs font-medium text-coral-600">
                {errors.experienceLevel.message}
              </p>
            )}
          </div>
        )}
      />

      <Controller
        control={control}
        name="careerInterests"
        render={({ field }) => (
          <div>
            <p className="text-sm font-semibold text-navy-800">
              Кариерни интереси (избери едно или повече)
              <span className="ml-0.5 text-coral-500">*</span>
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {CAREER_INTERESTS.map((opt) => {
                const checked = (field.value ?? []).includes(opt.value);
                return (
                  <CheckboxChip
                    key={opt.value}
                    name="careerInterests"
                    label={opt.label}
                    checked={checked}
                    onChange={(isChecked) => {
                      const current: string[] = field.value ?? [];
                      field.onChange(
                        isChecked
                          ? [...current, opt.value]
                          : current.filter((v) => v !== opt.value)
                      );
                    }}
                  />
                );
              })}
            </div>
            {errors.careerInterests && (
              <p className="mt-2 text-xs font-medium text-coral-600">
                {errors.careerInterests.message as string}
              </p>
            )}
          </div>
        )}
      />

      {careerInterests.includes(OTHER_CAREER_INTEREST_VALUE) && (
        <TextField
          label="Опиши направлението си"
          required
          placeholder="напр. Data Analysis"
          error={errors.otherCareerInterest?.message}
          {...register("otherCareerInterest")}
        />
      )}

      <Controller
        control={control}
        name="opportunityPreferences"
        render={({ field }) => (
          <div>
            <p className="text-sm font-semibold text-navy-800">
              Предпочитан тип възможност (избери едно или повече)
              <span className="ml-0.5 text-coral-500">*</span>
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {OPPORTUNITY_PREFERENCES.map((opt) => {
                const checked = (field.value ?? []).includes(opt.value);
                return (
                  <CheckboxChip
                    key={opt.value}
                    name="opportunityPreferences"
                    label={opt.label}
                    checked={checked}
                    onChange={(isChecked) => {
                      const current: string[] = field.value ?? [];
                      field.onChange(
                        isChecked
                          ? [...current, opt.value]
                          : current.filter((v) => v !== opt.value)
                      );
                    }}
                  />
                );
              })}
            </div>
            {errors.opportunityPreferences && (
              <p className="mt-2 text-xs font-medium text-coral-600">
                {errors.opportunityPreferences.message as string}
              </p>
            )}
          </div>
        )}
      />

      <TextAreaField
        label="Какво очакваш от HR:RUSH FOR PRACTICE?"
        required
        error={errors.expectations?.message}
        {...register("expectations")}
      />

      <TextAreaField
        label="Какво искаш да научиш или развиеш?"
        required
        error={errors.developmentGoals?.message}
        {...register("developmentGoals")}
      />

      <TextField
        label="LinkedIn профил"
        type="url"
        placeholder="https://www.linkedin.com/in/..."
        hint="Незадължително поле."
        error={errors.linkedinUrl?.message}
        {...register("linkedinUrl")}
      />
    </div>
  );
}
