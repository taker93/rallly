import { VoteType } from "@prisma/client";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import * as React from "react";

import X from "@/components/icons/x.svg";

import VoteIcon from "./vote-icon";

export interface VoteSelectorProps {
  value?: VoteType;
  onChange?: (value: VoteType) => void;
  onFocus?: React.FocusEventHandler<HTMLButtonElement>;
  onBlur?: React.FocusEventHandler<HTMLButtonElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLButtonElement>;
  className?: string;
  capReached: boolean;
}

const orderedVoteTypes: VoteType[] = ["yes", "ifNeedBe", "no"];

const getNext = (value: VoteType, capReached: boolean) => {
  const type = orderedVoteTypes[
    (orderedVoteTypes.indexOf(value) + 1) % orderedVoteTypes.length
  ];

  if (capReached && type == "yes") {
    return orderedVoteTypes[
      (orderedVoteTypes.indexOf(value) + 2) % orderedVoteTypes.length
    ];
  }

  return type;
};

export const VoteSelector = React.forwardRef<
  HTMLButtonElement,
  VoteSelectorProps
>(function VoteSelector(
  { value, onChange, onFocus, onBlur, onKeyDown, className, capReached },
  ref,
) {

  return (
    <button
      data-testid="vote-selector"
      type="button"
      onFocus={onFocus}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      className={clsx(
        "group relative inline-flex h-9 w-full items-center justify-center overflow-hidden rounded-md border bg-white transition-all hover:ring-4 focus-visible:border-0 focus-visible:ring-2 focus-visible:ring-primary-500 disabled:bg-slate-50",
        {
          "border-red-200 bg-red-50 hover:ring-red-100/50 active:bg-red-100/50":
            value === "yes" && capReached,
          "border-green-200 bg-green-50 hover:ring-green-100/50 active:bg-green-100/50":
            value === "yes",
          "border-amber-200 bg-amber-50 hover:ring-amber-100/50 active:bg-amber-100/50":
            value === "ifNeedBe",
          "border-gray-200 bg-gray-50 hover:ring-gray-100/50 active:bg-gray-100/50":
            value === "no",
          "border-gray-200 hover:ring-gray-100/50 active:bg-gray-100/50":
            value === undefined,
        },
        className,
      )}
      onClick={() => {
        onChange?.(value ? getNext(value, capReached) : capReached ? orderedVoteTypes[1] : orderedVoteTypes[0]);
      }}
      ref={ref}
    //disabled={(capReached && value == "yes")}
    >
      <AnimatePresence initial={false}>
        <motion.span
          className="absolute flex items-center justify-center"
          transition={{ duration: 0.2 }}
          initial={{ opacity: 0, scale: 1.5, y: -45 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 45 }}
          key={value}
        >
          {capReached && value == "yes" ? <X className="text-red-500 h-5" /> : <VoteIcon type={value} />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
});
