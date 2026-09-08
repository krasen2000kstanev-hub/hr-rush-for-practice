"use client";

import { useRef } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import Link from "next/link";
import { UploadCloud, FileCheck2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ApplyFormValues } from "@/lib/validation/applicationSchema";

export function StepFinal() {
  const {
    control,
    register,
    setValue,
    formState: { errors },
  } = useFormContext<ApplyFormValues>();
  const inputRef = useRef<HTMLInputElement>(null);
  const cvFile = useWatch({ control, name: "cvFile" });

  return (
    <div className="flex flex-col gap-7">
      <Controller
        control={control}
        name="cvFile"
        render={({ field }) => (
          <div>
            <p className="text-sm font-semibold text-navy-800">
              Автобиография (CV)<span className="ml-0.5 text-coral-500">*</span>
            </p>
            <div
              role="button"
              tabIndex={0}
              onClick={() => inputRef.current?.click()}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
              }}
              className={cn(
                "mt-3 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors",
                errors.cvFile ? "border-coral-300 bg-coral-50/40" : "border-navy-200 bg-navy-50/50 hover:border-cyan-400"
              )}
            >
              {cvFile ? (
                <>
                  <FileCheck2 className="h-8 w-8 text-cyan-500" />
                  <p className="text-sm font-semibold text-navy-800">{cvFile.name}</p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      field.onChange(null);
                      if (inputRef.current) inputRef.current.value = "";
                    }}
                    className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-coral-500 hover:underline"
                  >
                    <X className="h-3 w-3" /> Премахни файла
                  </button>
                </>
              ) : (
                <>
                  <UploadCloud className="h-8 w-8 text-navy-400" />
                  <p className="text-sm font-semibold text-navy-700">
                    Качи CV файл или го провлачи тук
                  </p>
                  <p className="text-xs text-navy-500">PDF, DOC или DOCX — до 5 MB</p>
                </>
              )}
              <input
                ref={inputRef}
                type="file"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                className="sr-only"
                onChange={(e) => field.onChange(e.target.files?.[0] ?? null)}
              />
            </div>
            {errors.cvFile && (
              <p className="mt-2 text-xs font-medium text-coral-600">
                {errors.cvFile.message as string}
              </p>
            )}
          </div>
        )}
      />

      {/* Honeypot field — hidden from real users, only bots tend to fill every input. */}
      <div className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="companyWebsite">Уебсайт на компанията</label>
        <input
          id="companyWebsite"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("companyWebsite")}
        />
      </div>

      <Controller
        control={control}
        name="gdprConsent"
        render={({ field }) => (
          <div>
            <label className="flex items-start gap-3 rounded-xl border border-navy-200 bg-navy-50/50 p-4">
              <input
                type="checkbox"
                checked={field.value === true}
                onChange={(e) => field.onChange(e.target.checked)}
                className="mt-0.5 h-5 w-5 shrink-0 rounded border-navy-300 text-cyan-500 focus:ring-cyan-400"
              />
              <span className="text-sm leading-relaxed text-navy-700">
                Съгласен/а съм с{" "}
                <Link href="/privacy-policy" target="_blank" className="font-semibold text-cyan-600 underline">
                  Политиката за поверителност
                </Link>{" "}
                и обработването на личните ми данни във връзка с участието ми в HR:RUSH FOR PRACTICE.
              </span>
            </label>
            {errors.gdprConsent && (
              <p className="mt-2 text-xs font-medium text-coral-600">
                {errors.gdprConsent.message as string}
              </p>
            )}
          </div>
        )}
      />
    </div>
  );
}
