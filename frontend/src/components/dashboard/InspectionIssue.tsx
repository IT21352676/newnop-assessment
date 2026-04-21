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
  addOptionalFields,
  getAllIssuePriority,
  getAllIssueSeverity,
  getAllIssueStatus,
  getIssueById,
  getOptionalFieldCount,
  removeIssue,
  removeOptionalField,
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
import StatusConfirm from "./UpdateStatus";

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
  const [initialIssue, setInitialIssue] = useState<Issue>(selectedIssue);
  const [issuePriorities, setIssuePriorities] = useState<IssuePriority[]>([]);
  const [issueStatuses, setIssueStatuses] = useState<IssueStatus[]>([]);
  const [issueSeverities, setIssueSeverities] = useState<IssueSeverity[]>([]);
  const [loading, setLoading] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [optionalFieldCount, setOptionalFieldCount] = useState<number>(0);

  const reFetchIssue = async () => {
    const issue = await getIssueById(selectedIssue.issueId);
    setInitialIssue(issue);
    setIssue(issue);
  };

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

    const fetchOptionalFieldCount = async () => {
      const optionalFieldCount = await getOptionalFieldCount();
      setOptionalFieldCount(optionalFieldCount);
    };

    fetchIssuePriorities();
    fetchIssueSeverities();
    fetchIssueStatuses();
    fetchOptionalFieldCount();
  }, []);

  useEffect(() => {
    setIssue(selectedIssue);
    setInitialIssue(selectedIssue);
  }, [selectedIssue]);
  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      await removeIssue(id);
      if (selectedIssue?.issueId === id) setSelectedIssue(null);
      toast.success("Issue deleted successfully");
      reFetchIssue();
      onChange();
    } catch (err: any) {
      toast.error(err.response.data.message);
    } finally {
      setLoading(false);
      setConfirmDeleteOpen(false);
    }
  };

  const handleAddOptionalFieldButton = () => {
    if (issue?.optionalFields?.length >= optionalFieldCount) {
      toast.error(`Maximum ${optionalFieldCount} optional fields allowed`);
      return;
    }
    setIssue({
      ...issue,
      optionalFields: [...issue?.optionalFields, { name: "", value: "" }],
    });
  };

  const handleOptionalFieldDelete = async (
    index: number,
    optionalField: { id?: string; name: string; value: string },
  ) => {
    if (!optionalField.id) {
      setIssue({
        ...issue,
        optionalFields: issue?.optionalFields?.filter((_, i) => i !== index),
      });
    } else {
      try {
        setLoading(true);
        await removeOptionalField(selectedIssue.issueId, optionalField.id);
        toast.success("Issue updated successfully");
        reFetchIssue();
        onChange();
      } catch (err: any) {
        toast.error(
          err.response
            ? err.response.data.message
              ? err.response.data.message
              : err.response
            : "Something went wrong",
        );
      } finally {
        setLoading(false);
      }
    }
  };
  const filteredOptionalFields = issue?.optionalFields?.filter(
    (field) =>
      field.name !== "" &&
      field.value !== "" &&
      !initialIssue?.optionalFields?.includes(field),
  );

  const handleUpdateIssue = async () => {
    try {
      setLoading(true);
      await updateIssue(issue);
      await addOptionalFields(issue.issueId, filteredOptionalFields);
      toast.success("Issue updated successfully");
      reFetchIssue();
      onChange();
    } catch (err: any) {
      toast.error(
        err.response
          ? err.response.data.message
            ? err.response.data.message
            : err.response
          : "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  };

  const isUpdateButtonDisabled = (): boolean => {
    return (
      loading ||
      (issue?.title === initialIssue?.title &&
        issue?.description === initialIssue?.description &&
        filteredOptionalFields?.length === 0)
    );
  };

  const [confirmStatusOpen, setConfirmStatusOpen] = useState(false);
  const [statusUpdatingIssue, setStatusUpdatingIssue] = useState<{
    id: string;
    issue: Issue;
    currentStatus: IssueStatus;
    newStatus: IssueStatus;
  }>();

  return (
    <Modal
      isOpen={!!selectedIssue}
      onClose={() => setSelectedIssue(null)}
      title="Issue Inspection"
    >
      {selectedIssue && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row  bg-card p-4 rounded-xl align-center justify-between gap-4">
            <div className="flex flex-col gap-2 justify-between border border-dashed border-primary/20 p-4 rounded-lg">
              <span className="font-bold uppercase tracking-wide text-[12px]">
                Status
              </span>
              <div className="flex justify-center gap-2 animate-pulse">
                <Badge
                  className={`flex items-center gap-1 ${issueStatusMap[issue?.status]?.color} text-[10px]`}
                >
                  {issueStatusMap[issue?.status]?.icon}{" "}
                  {issue?.status?.replace("_", " ")}
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
                  setStatusUpdatingIssue({
                    id: issue.issueId,
                    issue: issue,
                    currentStatus: issue.status,
                    newStatus: e.target.value as IssueStatus,
                  });
                  setConfirmStatusOpen(true);
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
            </div>{" "}
            <StatusConfirm
              setConfirmStatusOpen={setConfirmStatusOpen}
              confirmStatusOpen={confirmStatusOpen}
              statusUpdatingIssue={statusUpdatingIssue}
              onUpdate={() => {
                onChange();
                reFetchIssue();
                setSelectedIssue(null);
              }}
            />
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
                    toast.error(
                      err.response
                        ? err.response.data.message
                          ? err.response.data.message
                          : err.response
                        : "Something went wrong",
                    );
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
                    toast.error(
                      err.response
                        ? err.response.data.message
                          ? err.response.data.message
                          : err.response
                        : "Something went wrong",
                    );
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
                className="text-lg font-bold text-primary/50  leading-tight w-full h-10 p-2 rounded-md focus:outline-none border border-primary/20  placeholder:text-muted outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/30 transition-all"
                onChange={(e) => setIssue({ ...issue, title: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-muted mb-2 px-1">
                Technical Disposition
              </label>
              <textarea
                value={issue?.description || ""}
                className="text-primary/50 text-sm leading-relaxed whitespace-pre-wrap text-start w-full h-24 p-2 rounded-md border border-primary/20 resize-none placeholder:text-muted outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/30 transition-all"
                onChange={(e) =>
                  setIssue({ ...issue, description: e.target.value })
                }
              />
            </div>
            <div className="grid w-full gap-2">
              {issue?.optionalFields?.map((field, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Name"
                    className="pl-2 pr-2 py-2 h-10 rounded-md border border-primary/20 bg-card/80 text-sm text-primary/50 placeholder:text-muted outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/30 transition-all w-full"
                    value={field.name}
                    onChange={(e) => {
                      const newFields = [...issue?.optionalFields];
                      newFields[index].name = e.target.value;
                      setIssue({ ...issue, optionalFields: newFields });
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Value"
                    className="pl-2 pr-2 py-2 h-10 rounded-md border border-primary/20 bg-card/80 text-sm text-primary/50 placeholder:text-muted outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/30 transition-all w-full"
                    value={field.value}
                    onChange={(e) => {
                      const newFields = [...issue.optionalFields];
                      newFields[index].value = e.target.value;
                      setIssue({ ...issue, optionalFields: newFields });
                    }}
                  />
                  <button
                    onClick={() => handleOptionalFieldDelete(index, field)}
                    className="p-2.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 font-bold hover:bg-red-500/20 transition-all flex justify-center gap-2"
                    title="Purge Data"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              <button
                onClick={handleAddOptionalFieldButton}
                className="w-full border border-accent p-2 rounded-md block text-[11px] font-bold uppercase tracking-widest text-accent bg-accent/30 px-1 leading-relaxed whitespace-pre-wrap focus:outline-none hover:bg-accent/50"
              >
                + Add Optional Field
              </button>
            </div>
            <div className="flex w-full justify-end">
              <button
                className="btn-primary w-30"
                disabled={isUpdateButtonDisabled()}
                onClick={async () => {
                  await handleUpdateIssue();
                }}
              >
                Update
              </button>
            </div>
          </div>
          <button
            onClick={() => setConfirmDeleteOpen(true)}
            className="w-full p-2.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 font-bold hover:bg-red-500/20 transition-all flex justify-center gap-2"
            title="Purge Data"
          >
            <label className="block text-[12px] font-bold uppercase tracking-widestpx-1">
              Delete Issue
            </label>
            <Trash2 className="w-4 h-4" />
          </button>
          <div className="flex w-full justify-between items-center">
            <div className="flex gap-2 align-center">
              <IconClock className="w-4 h-4" />
              <p className="text-ink-primary text-xs font-mono">
                {format(new Date(selectedIssue.createdAt), "yyyy-MM-dd HH:mm")}
              </p>
            </div>
            <div className="flex gap-2 align-center">
              <User className="w-4 h-4" />
              <p className="text-ink-primary text-xs font-mono">
                {selectedIssue.author.userId}
              </p>
            </div>

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
