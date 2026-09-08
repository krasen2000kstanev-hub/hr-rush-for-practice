import { cn } from "@/lib/utils";
import {
  APPLICATION_STATUS_BADGE_CLASSES,
  APPLICATION_STATUS_LABELS,
  type ApplicationStatus,
} from "@/types/application";

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        APPLICATION_STATUS_BADGE_CLASSES[status]
      )}
    >
      {APPLICATION_STATUS_LABELS[status]}
    </span>
  );
}
