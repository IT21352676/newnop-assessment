import React, { JSX } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import {
  IconAnalyze,
  IconApiOff,
  IconBarrierBlock,
  IconBaselineDensityMedium,
  IconBaselineDensitySmall,
  IconCircleOpenArrowLeft,
  IconCircleOpenArrowRight,
  IconCoffeeOff,
  IconEqual,
  IconMinus,
  IconPlugConnectedX,
  IconProgress,
  IconServerOff,
  IconSquareRoundedCheck,
  IconSquareRoundedX,
} from "@tabler/icons-react";
import { IssuePriority, IssueSeverity, IssueStatus } from "./types";

export const issueStatusMap: Partial<
  Record<
    IssueStatus,
    {
      icon: JSX.Element;
      color: string;
      bgColor: string;
      borderColor: string;
      hoverBgColor: string;
    }
  >
> = {
  [IssueStatus.Open]: {
    icon: <IconCircleOpenArrowRight />,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    hoverBgColor: "hover:bg-blue-500/20",
    borderColor: "border-blue-500/20",
  },
  [IssueStatus.InProgress]: {
    icon: <IconProgress />,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    hoverBgColor: "hover:bg-yellow-500/20",
    borderColor: "border-yellow-500/20",
  },
  [IssueStatus.InReview]: {
    icon: <IconAnalyze />,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    hoverBgColor: "hover:bg-purple-500/20",
    borderColor: "border-purple-500/20",
  },
  [IssueStatus.Resolved]: {
    icon: <IconSquareRoundedCheck />,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    hoverBgColor: "hover:bg-green-500/20",
    borderColor: "border-green-500/20",
  },
  [IssueStatus.Closed]: {
    icon: <IconSquareRoundedX />,
    color: "text-gray-500",
    bgColor: "bg-gray-500/10",
    hoverBgColor: "hover:bg-gray-500/20",
    borderColor: "border-gray-500/20",
  },
  [IssueStatus.Reopened]: {
    icon: <IconCircleOpenArrowLeft />,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    hoverBgColor: "hover:bg-orange-500/20",
    borderColor: "border-orange-500/20",
  },
  [IssueStatus.Blocked]: {
    icon: <IconBarrierBlock />,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    hoverBgColor: "hover:bg-red-500/20",
    borderColor: "border-red-500/20",
  },
};

export const issuePriorityMap: Partial<
  Record<IssuePriority, { icon: JSX.Element; color: string }>
> = {
  [IssuePriority.Low]: {
    icon: <IconMinus className="w-3 h-3" />,
    color: "text-lime-500",
  },
  [IssuePriority.Medium]: {
    icon: <IconEqual className="w-3 h-3" />,
    color: "text-yellow-500",
  },
  [IssuePriority.High]: {
    icon: <IconBaselineDensityMedium className="w-3 h-3" />,
    color: "text-orange-500",
  },
  [IssuePriority.Critical]: {
    icon: <IconBaselineDensitySmall className="w-3 h-3" />,
    color: "text-red-600",
  },
};

export const issueSeverityMap: Partial<
  Record<IssueSeverity, { icon: JSX.Element; color: string }>
> = {
  [IssueSeverity.Blocker]: {
    icon: <IconPlugConnectedX className="w-3 h-3" />,
    color: "text-rose-500",
  },
  [IssueSeverity.Critical]: {
    icon: <IconServerOff className="w-3 h-3" />,
    color: "text-purple-500",
  },
  [IssueSeverity.Major]: {
    icon: <IconApiOff className="w-3 h-3" />,
    color: "text-blue-500",
  },
  [IssueSeverity.Minor]: {
    icon: <IconCoffeeOff className="w-3 h-3" />,
    color: "text-slate-500",
  },
};
