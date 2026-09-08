"use client";

import { useFormContext } from "react-hook-form";
import { TextField } from "@/components/forms/fields";
import type { ApplyFormValues } from "@/lib/validation/applicationSchema";

export function StepPersonalInfo() {
  const {
    register,
    formState: { errors },
  } = useFormContext<ApplyFormValues>();

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <TextField
        label="Име"
        required
        autoComplete="given-name"
        placeholder="напр. Ана"
        error={errors.firstName?.message}
        {...register("firstName")}
      />
      <TextField
        label="Фамилия"
        required
        autoComplete="family-name"
        placeholder="напр. Иванова"
        error={errors.lastName?.message}
        {...register("lastName")}
      />
      <TextField
        label="Имейл"
        required
        type="email"
        autoComplete="email"
        placeholder="ime@example.com"
        error={errors.email?.message}
        {...register("email")}
      />
      <TextField
        label="Телефон"
        required
        type="tel"
        autoComplete="tel"
        placeholder="+359 88 000 0000"
        error={errors.phone?.message}
        {...register("phone")}
      />
    </div>
  );
}
