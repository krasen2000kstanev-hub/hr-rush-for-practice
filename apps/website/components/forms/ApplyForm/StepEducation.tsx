"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { TextField, SelectField } from "@/components/forms/fields";
import { UNIVERSITIES, OTHER_UNIVERSITY_VALUE } from "@/data/universities";
import { DEGREE_OPTIONS, STUDY_YEAR_OPTIONS } from "@/data/formOptions";
import type { ApplyFormValues } from "@/lib/validation/applicationSchema";

export function StepEducation() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<ApplyFormValues>();

  const selectedUniversity = useWatch({ control, name: "university" });

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <SelectField
        label="Университет"
        required
        placeholder="Избери университет"
        error={errors.university?.message}
        {...register("university")}
      >
        {UNIVERSITIES.map((uni) => (
          <option key={uni.id} value={uni.name}>
            {uni.shortName ? `${uni.shortName} — ${uni.name}` : uni.name}
          </option>
        ))}
        <option value={OTHER_UNIVERSITY_VALUE}>Друг университет</option>
      </SelectField>

      {selectedUniversity === OTHER_UNIVERSITY_VALUE && (
        <TextField
          label="Име на университета"
          required
          placeholder="Въведи университета си"
          error={errors.customUniversity?.message}
          {...register("customUniversity")}
        />
      )}

      <TextField
        label="Специалност"
        required
        placeholder="напр. Маркетинг"
        error={errors.specialty?.message}
        {...register("specialty")}
      />

      <SelectField
        label="Курс"
        required
        placeholder="Избери курс"
        error={errors.studyYear?.message}
        {...register("studyYear")}
      >
        {STUDY_YEAR_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </SelectField>

      <SelectField
        label="Степен"
        required
        placeholder="Избери степен"
        error={errors.degree?.message}
        {...register("degree")}
      >
        {DEGREE_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </SelectField>
    </div>
  );
}
