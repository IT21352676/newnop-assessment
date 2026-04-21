import { updateIssue } from "@/lib/api";
import { issueStatusMap } from "@/lib/utils";
import { IconArrowNarrowRightDashed } from "@tabler/icons-react";
import { useState } from "react";
import { toast } from "react-toastify";
import { Issue, IssueStatus } from "../../lib/types";
import Modal from "../ui/Modal";

const StatusConfirm = ({
  confirmStatusOpen,
  setConfirmStatusOpen,
  statusUpdatingIssue,
  setStatusUpdatingIssue,
  selectedIssue,
  setSelectedIssue,
  onUpdate,
}: {
  onUpdate?: () => void;
  confirmStatusOpen: boolean;
  setConfirmStatusOpen: (open: boolean) => void;
  statusUpdatingIssue: {
    id: string;
    issue: Issue;
    currentStatus: IssueStatus;
    newStatus: IssueStatus;
  };
  setStatusUpdatingIssue?: (
    value: React.SetStateAction<{
      id: string;
      issue: Issue;
      currentStatus: IssueStatus;
      newStatus: IssueStatus;
    }>,
  ) => void;
  selectedIssue?: Issue;
  setSelectedIssue?: (issue: Issue | null) => void;
}) => {
  const [loading, setLoading] = useState(false);
  const handleUpdateStatus = async () => {
    setLoading(true);
    if (statusUpdatingIssue.issue) {
      try {
        await updateIssue({
          ...statusUpdatingIssue.issue,
          status: statusUpdatingIssue.newStatus,
          issueId: statusUpdatingIssue.id,
        });
        toast.success(`Issue updated successfully`);
        if (selectedIssue?.issueId === statusUpdatingIssue.id)
          setSelectedIssue(null);
        onUpdate();
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
        setConfirmStatusOpen(false);
        setStatusUpdatingIssue(null);
      }
    }
  };
  return (
    <Modal
      isOpen={confirmStatusOpen}
      onClose={() => {
        setConfirmStatusOpen(false);
        setStatusUpdatingIssue(null);
      }}
      title="Confirm Status Update"
    >
      <div className="space-y-6">
        <div className="flex flex-col items-center gap-3 py-2">
          <div className="flex items-center gap-2">
            <span
              className={`flex ${issueStatusMap[statusUpdatingIssue?.currentStatus]?.color} gap-2 font-bold uppercase tracking-[0.15em] text-[14px] items-center`}
            >
              {issueStatusMap[statusUpdatingIssue?.currentStatus]?.icon}
              {statusUpdatingIssue?.currentStatus?.replace("_", " ")}
            </span>
            <IconArrowNarrowRightDashed className="w-10 h-10 text-primary animate-bounce-right" />
            <span
              className={`flex ${issueStatusMap[statusUpdatingIssue?.newStatus]?.color} gap-2 font-bold uppercase tracking-[0.15em] text-[14px] items-center`}
            >
              {issueStatusMap[statusUpdatingIssue?.newStatus]?.icon}

              {statusUpdatingIssue?.newStatus?.replace("_", " ")}
            </span>
            {/* {issueStatusMap[statusUpdatingIssue.newStatus].label} */}
          </div>
          <p className="text-ink-primary text-sm text-center">
            Are you sure you want to change status of{" "}
            <span className="font-bold text-accent">
              #{statusUpdatingIssue?.id?.toString().padStart(4, "0")}
            </span>{" "}
            ?
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setConfirmStatusOpen(false)}
            className="flex-1 btn-secondary text-sm"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={async () => await handleUpdateStatus()}
            disabled={loading}
            className={`flex-1 px-4 py-2.5 rounded-lg ${issueStatusMap[statusUpdatingIssue?.newStatus]?.color} ${issueStatusMap[statusUpdatingIssue?.newStatus]?.bgColor} border ${issueStatusMap[statusUpdatingIssue?.newStatus]?.borderColor} font-bold text-sm ${issueStatusMap[statusUpdatingIssue?.newStatus]?.hoverBgColor} transition-all disabled:opacity-50 capitalize`}
          >
            {loading
              ? "Updating..."
              : `Update to ${statusUpdatingIssue?.newStatus?.replace("_", " ").toLowerCase()}`}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default StatusConfirm;
