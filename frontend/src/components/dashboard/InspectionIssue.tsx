import React, { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import {
  Issue,
  IssuePriority,
  IssueSeverity,
  IssueStatus,
} from "../../lib/types";
import { Trash2, User } from "lucide-react";
import { format } from "date-fns";
import {
  getAllIssuePriority,
  getAllIssueSeverity,
  getAllIssueStatus,
  removeIssue,
  updateIssue,
} from "../../lib/api";
import { toast } from "react-toastify";
import Badge from "../ui/Badge";
import {
  issuePriorityMap,
  issueSeverityMap,
  issueStatusMap,
} from "../../lib/utils";
import { IconClock } from "@tabler/icons-react";
import DeleteConfirm from "./DeleteIssue";

const InspectionIssue = ({
  selectedIssue,
  setSelectedIssue,
  onChange,
}: {
  selectedIssue: Issue;
  setSelectedIssue: (issue: Issue | null) => void;
  onChange: () => void;
}) => {
  const [issue, setIssue] = useState<Issue>(selectedIssue);
  const [issuePriorities, setIssuePriorities] = useState<IssuePriority[]>([]);
  const [issueStatuses, setIssueStatuses] = useState<IssueStatus[]>([]);
  const [issueSeverities, setIssueSeverities] = useState<IssueSeverity[]>([]);
  const [loading, setLoading] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  useEffect(() => {
    const fetchIssuePriorities = async () => {
      const issuePriorities = await getAllIssuePriority();
      setIssuePriorities(issuePriorities);
    };

    const fetchIssueSeverities = async () => {
      const issueSeverities = await getAllIssueSeverity();
      setIssueSeverities(issueSeverities);
    };

    const fetchIssueStatuses = async () => {
      const issueStatuses = await getAllIssueStatus();
      setIssueStatuses(issueStatuses);
    };
    fetchIssuePriorities();
    fetchIssueSeverities();
    fetchIssueStatuses();
  }, []);

  useEffect(() => {
    setIssue(selectedIssue);
  }, [selectedIssue]);
  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      await removeIssue(id);
      if (selectedIssue?.issueId === id) setSelectedIssue(null);
      toast.success("Issue deleted successfully");
      onChange();
    } catch (err: any) {
      toast.error(err.response.data.message);
    } finally {
      setLoading(false);
      setConfirmDeleteOpen(false);
    }
  };

  console.log(loading);

  return (
    <Modal
      isOpen={!!selectedIssue}
      onClose={() => setSelectedIssue(null)}
      title="Issue Inspection"
    >
      {selectedIssue && (
        <div className="space-y-6">
          <div className="flex bg-card p-4 rounded-xl align-center justify-between">
            <div className="flex flex-col gap-2 justify-between border border-dashed border-primary/20 p-4 rounded-lg">
              <span className="font-bold uppercase tracking-wide text-[12px]">
                Status
              </span>
              <div className="flex justify-center gap-2 animate-pulse">
                <Badge
                  className={`flex items-center gap-1 ${issueStatusMap[issue?.status]?.color} text-[10px]`}
                >
                  {issueStatusMap[issue?.status]?.icon}{" "}
                  {issue?.status.replace("_", " ")}
                </Badge>
              </div>
              <span className="text-[10px] text-muted mt-4">Change Status</span>
              <select
                className="border border-primary/20 p-2 rounded-md w-full focus:outline-none text-[10px]"
                value={issue?.status || ""}
                onChange={async (e) => {
                  setIssue({
                    ...issue,
                    status: e.target.value as IssueStatus,
                  });
                  try {
                    setLoading(true);
                    await updateIssue({
                      ...issue,
                      status: e.target.value as IssueStatus,
                    });
                    toast.success("Issue updated successfully");
                    onChange();
                  } catch (err: any) {
                    toast.error(err.response.data.message);
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                <option value="" disabled className="bg-surface text-muted">
                  Select Status
                </option>
                {issueStatuses.map((status, index) => (
                  <option
                    key={index}
                    value={status}
                    className="bg-surface text-primary"
                  >
                    {status.replace("_", " ")}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2 justify-between border border-dashed border-primary/20 p-4 rounded-lg">
              <span className="font-bold uppercase tracking-wide text-[12px]">
                Priority
              </span>
              <div className="flex justify-center animate-pulse">
                <Badge
                  className={`flex items-center gap-1 ${issuePriorityMap[issue?.priority]?.color} border border-border-custom text-[10px] w-fit`}
                >
                  {issuePriorityMap[issue?.priority]?.icon} {issue?.priority}
                </Badge>
              </div>
              <span className="text-[10px] text-muted mt-4">
                Change Priority
              </span>
              <select
                className="border border-primary/20 p-2 rounded-md w-full focus:outline-none text-[10px]"
                value={issue?.priority || ""}
                onChange={async (e) => {
                  setIssue({
                    ...issue,
                    priority: e.target.value as IssuePriority,
                  });
                  try {
                    setLoading(true);
                    await updateIssue({
                      ...issue,
                      priority: e.target.value as IssuePriority,
                    });
                    toast.success("Issue updated successfully");
                    onChange();
                  } catch (err: any) {
                    toast.error(err.response.data.message);
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                <option value="" disabled className="bg-surface text-muted">
                  Select Priority
                </option>
                {issuePriorities.map((priority, index) => (
                  <option
                    key={index}
                    value={priority}
                    className="bg-surface text-primary"
                  >
                    {priority}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2 justify-between border border-dashed border-primary/20 p-4 rounded-lg">
              <span className="font-bold uppercase tracking-wide text-[12px]">
                Severity
              </span>
              <div className="flex justify-center gap-2 animate-pulse">
                <Badge
                  className={`flex items-center gap-1 ${issueSeverityMap[issue?.severity]?.color} border border-border-custom text-[10px]`}
                >
                  {issueSeverityMap[issue?.severity]?.icon} {issue?.severity}
                </Badge>
              </div>
              <span className="text-[10px] text-muted mt-4">
                Change Severity
              </span>
              <select
                className="border border-primary/20 p-2 rounded-md w-full focus:outline-none text-[10px]"
                value={issue?.severity || ""}
                onChange={async (e) => {
                  setIssue({
                    ...issue,
                    severity: e.target.value as IssueSeverity,
                  });
                  try {
                    setLoading(true);
                    await updateIssue({
                      ...issue,
                      severity: e.target.value as IssueSeverity,
                    });
                    toast.success("Issue updated successfully");
                    onChange();
                  } catch (err: any) {
                    toast.error(err.response.data.message);
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                <option value="" disabled className="bg-surface text-muted">
                  Select Severity
                </option>
                {issueSeverities.map((severity, index) => (
                  <option
                    key={index}
                    value={severity}
                    className="bg-surface text-primary"
                  >
                    {severity}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 bg-card p-4 rounded-xl gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-muted mb-2 px-1">
                Issue Identifier / Title
              </label>
              <input
                value={issue?.title || ""}
                type="text"
                className="text-lg font-bold text-primary  leading-tight w-full h-10 p-2 rounded-md focus:outline-none border border-primary/20"
                onChange={(e) => setIssue({ ...issue, title: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-muted mb-2 px-1">
                Technical Disposition
              </label>
              <textarea
                value={issue?.description || ""}
                className="text-primary/50 text-sm leading-relaxed whitespace-pre-wrap text-start w-full h-24 p-2 rounded-md border border-primary/20 resize-none focus:outline-none"
                onChange={(e) =>
                  setIssue({ ...issue, description: e.target.value })
                }
              />
            </div>
            <div className="flex w-full justify-end">
              <button
                className="btn-primary w-30"
                disabled={
                  loading ||
                  (issue?.title === selectedIssue.title &&
                    issue?.description === selectedIssue.description)
                }
                onClick={async () => {
                  try {
                    setLoading(true);
                    await updateIssue(issue);
                    toast.success("Issue updated successfully");
                    setSelectedIssue(null);
                    onChange();
                  } catch (err: any) {
                    toast.error(err.response.data.message);
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                Update
              </button>
            </div>
          </div>
          <div className="flex w-full justify-between items-center">
            <div className="flex gap-5">
              <div className="flex gap-2 align-center">
                <IconClock className="w-4 h-4" />
                <p className="text-ink-primary text-xs font-mono">
                  {format(
                    new Date(selectedIssue.createdAt),
                    "yyyy-MM-dd HH:mm",
                  )}
                </p>
              </div>
              <div className="flex gap-2 align-center">
                <User className="w-4 h-4" />
                <p className="text-ink-primary text-xs font-mono">
                  {selectedIssue.author.userId}
                </p>
              </div>
            </div>
            <button
              onClick={() => setConfirmDeleteOpen(true)}
              className="px-4 py-2.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 font-bold hover:bg-red-500/20 transition-all"
              title="Purge Data"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <DeleteConfirm
              confirmDeleteOpen={confirmDeleteOpen}
              setConfirmDeleteOpen={setConfirmDeleteOpen}
              selectedIssue={selectedIssue}
              handleDelete={handleDelete}
              loading={loading}
            />
          </div>
        </div>
      )}
    </Modal>
  );
};

export default InspectionIssue;
