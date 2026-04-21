import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  createIssue,
  getAllIssuePriority,
  getAllIssueSeverity,
} from "../../lib/api";
import {
  Issue,
  IssuePriority,
  IssueSeverity,
  IssueStatus,
} from "../../lib/types";
import Modal from "../ui/Modal";

const CreateIssue = ({
  isOpen,
  onClose,
  status,
}: {
  isOpen: boolean;
  onClose: () => void;
  status?: IssueStatus;
}) => {
  const [issue, setIssue] = useState<Partial<Issue>>({});
  const [issuePriorities, setIssuePriorities] = useState<IssuePriority[]>([]);
  const [issueSeverities, setIssueSeverities] = useState<IssueSeverity[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchIssuePriorities = async () => {
      const issuePriorities = await getAllIssuePriority();
      setIssuePriorities(issuePriorities);
    };

    const fetchIssueSeverities = async () => {
      const issueSeverities = await getAllIssueSeverity();
      setIssueSeverities(issueSeverities);
    };
    fetchIssuePriorities();
    fetchIssueSeverities();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !issue.title ||
      !issue.description ||
      !issue.priority ||
      !issue.severity
    ) {
      return toast.error("Please fill all the fields");
    }
    const newIssue = {
      ...issue,
      status: status ? status : IssueStatus.Open,
    } as Issue;
    try {
      setLoading(true);
      await createIssue(newIssue);
      toast.success("Issue created successfully");
      setIssue({});
      onClose();
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

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Initialize Issue">
      <form onSubmit={handleCreate} className="space-y-5">
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-widest text-muted mb-2 px-1">
            Issue Identifier / Title
          </label>
          <input
            required
            className="pl-3 pr-4 py-2 h-10 rounded-md border border-primary/20 bg-card/20 text-sm text-primary placeholder:text-muted outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/30 transition-all w-full"
            placeholder="e.g. Authentication token expiry failure"
            value={issue?.title}
            onChange={(e) => setIssue({ ...issue, title: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-widest text-muted mb-2 px-1">
            Technical Disposition
          </label>
          <textarea
            rows={4}
            className="min-h-[120px] pl-3 pr-4 py-2 h-10 rounded-md border border-primary/20 bg-card/20 text-sm text-primary placeholder:text-muted outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/30 transition-all w-full"
            placeholder="Observed behaviors, stack traces, or reproduction vectors..."
            value={issue?.description}
            onChange={(e) =>
              setIssue({ ...issue, description: e.target.value })
            }
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest text-muted mb-2 px-1">
              Prioritization
            </label>
            <select
              className="pl-3 pr-4 py-2 h-10 rounded-md border border-primary/20 bg-card/20 text-sm text-muted placeholder:text-muted outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/30 transition-all w-full"
              value={issue?.priority || ""}
              onChange={(e) =>
                setIssue({
                  ...issue,
                  priority: e.target.value as IssuePriority,
                })
              }
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
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest text-muted mb-2 px-1">
              Severity Class
            </label>
            <select
              className="pl-3 pr-4 py-2 h-10 rounded-md border border-primary/20 bg-card/20 text-sm text-muted placeholder:text-muted outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/30 transition-all w-full"
              value={issue?.severity || ""}
              onChange={(e) =>
                setIssue({
                  ...issue,
                  severity: e.target.value as IssueSeverity,
                })
              }
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
        <div className="pt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary flex-1 py-3 uppercase text-xs font-bold tracking-widest"
          >
            Abort
          </button>
          <button
            type="submit"
            className="btn-primary flex-1 py-3 uppercase text-xs font-bold tracking-widest"
          >
            Initialize
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateIssue;
