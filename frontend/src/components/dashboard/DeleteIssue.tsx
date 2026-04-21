import { Issue } from "../../lib/types";
import Modal from "../ui/Modal";
import { Trash2 } from "lucide-react";

const DeleteConfirm = ({
  confirmDeleteOpen,
  setConfirmDeleteOpen,
  selectedIssue,
  handleDelete,
  loading,
}: {
  confirmDeleteOpen: boolean;
  setConfirmDeleteOpen: (open: boolean) => void;
  selectedIssue: Issue;
  handleDelete: (id: string) => void;
  loading: boolean;
}) => {
  return (
    <Modal
      isOpen={confirmDeleteOpen}
      onClose={() => setConfirmDeleteOpen(false)}
      title="Confirm Deletion"
    >
      <div className="space-y-6">
        <div className="flex flex-col items-center gap-3 py-2">
          <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <Trash2 className="w-6 h-6 text-red-400" />
          </div>
          <p className="text-ink-primary text-sm text-center">
            Are you sure you want to permanently delete{" "}
            <span className="font-bold text-red-400">
              #{selectedIssue?.issueId?.toString().padStart(4, "0")}
            </span>{" "}
            ?
          </p>
          <p className="text-ink-muted text-xs text-center">
            This action cannot be undone.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setConfirmDeleteOpen(false)}
            className="flex-1 btn-secondary text-sm"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={() => handleDelete(selectedIssue.issueId)}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 font-bold text-sm hover:bg-red-500/20 transition-all disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Delete Issue"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirm;
