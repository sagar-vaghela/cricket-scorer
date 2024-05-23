import { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { FormLabel } from "../ui/form";

interface PlayerLabelProps {
  title: string;
  subTitle?: ReactNode;
  isSelected?: boolean;
  isOpacityDown?: boolean;
  isBrightnessDown?: boolean;
}

function PlayerLabel({
  title,
  isBrightnessDown,
  isOpacityDown,
  isSelected,
  subTitle,
}: PlayerLabelProps) {
  return (
    <FormLabel
      className={cn(
        "flex w-full cursor-pointer items-center justify-between rounded bg-muted px-2 py-3 font-normal",
        {
          "bg-emerald-500 font-black text-emerald-950": isSelected,
          "opacity-75": isOpacityDown,
          "brightness-50": isBrightnessDown,
        },
      )}
    >
      {title}

      <span className="whitespace-nowrap text-sm font-semibold">
        {subTitle}
      </span>
    </FormLabel>
  );
}

export default PlayerLabel;
