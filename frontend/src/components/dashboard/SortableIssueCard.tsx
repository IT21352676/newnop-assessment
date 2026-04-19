import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { format } from "date-fns";
import { Clock, User } from "lucide-react";
import React from "react";
import { Issue } from "../../lib/types";
import Badge from "../ui/Badge";
import { issuePriorityMap, issueSeverityMap } from "../../lib/utils";
import { Tooltip, TooltipTrigger, TooltipContent } from "../ui/Tooltip";

const SortableIssueCard = ({
  issue,
  onClick,
  isOverlay,
}: {
  issue: Issue;
  onClick: (issue: Issue) => void;
  isOverlay?: boolean;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: issue.issueId,
    data: {
      type: "Issue",
      issue,
    },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  if (isDragging && !isOverlay) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="w-full h-[200px] bg-card/20 border border-dashed border-border-custom rounded-xl opacity-50"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onClick(issue)}
      className={`h-[200px] group w-full bg-black/30  p-4 rounded-xl cursor-grab active:cursor-grabbing hover:border-ink-muted/30 transition-all ${isOverlay ? "shadow-2xl ring-2 ring-accent" : ""}`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-mono text-ink-muted group-hover:text-accent font-medium uppercase tracking-widest">
          #{issue.issueId.toString().padStart(4, "0")}
        </span>
        <Badge
          className={`flex items-center gap-1 ${issuePriorityMap[issue.priority].color} border border-border-custom text-[10px]`}
        >
          {issue.priority} {issuePriorityMap[issue.priority].icon}
        </Badge>
      </div>
      <h4 className="text-[16px] font-semibold text-ink-primary line-clamp-2 mb-2 leading-snug text-start mt-4">
        {issue.title}
      </h4>

      <div className="bg-card/70 rounded-md p-2 mb-4 min-h-15">
        <p className="text-[12px] text-ink-primary line-clamp-2 text-start wrap-break-word">
          {issue.description}
        </p>
      </div>
      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-1.5 overflow-hidden">
          <Badge
            className={`flex items-center gap-1 ${issueSeverityMap[issue.severity].color} border border-border-custom text-[10px]`}
          >
            {issueSeverityMap[issue.severity].icon} {issue.severity}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1">
                <User className="w-3 h-3" />
                <div className="flex justify-center items-center text-[10px] rounded-full border border-primary/20 w-6 h-6 bg-card/80">
                  {issue.author.userId.charAt(0)}
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent className="bg-accent">
              <p>{issue.author.userId}</p>
            </TooltipContent>
          </Tooltip>
          <div className="flex items-center gap-1 text-[10px] text-ink-muted whitespace-nowrap">
            <Clock className="w-3 h-3" />
            {format(new Date(issue.createdAt), "MM/dd")}
          </div>{" "}
        </div>
      </div>
    </div>
  );
};

export default SortableIssueCard;
