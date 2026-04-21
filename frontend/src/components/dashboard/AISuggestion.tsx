import { Bot } from "lucide-react";
import Modal from "../ui/Modal";
import TriageReport, { TriageResult } from "../dashboard/TriageReport";
import { getIssueById, saveAiSuggestion } from "@/lib/api";
import { toast } from "react-toastify";
import { Issue } from "@/lib/types";
import { IconSparkles2 } from "@tabler/icons-react";
import { useEffect, useState } from "react";

const AISuggestion = ({
  aiSuggestion,
  setAiSuggestion,
  onchange,
}: {
  aiSuggestion: {
    id: string;
    issue: Issue;
    suggestions: {
      jsonContent?: Issue["aiSuggestion"];
      content?: string;
      reasoning?: string;
      role?: string;
    };
  };
  setAiSuggestion: (aiSuggestion: null) => void;
  onchange: () => void;
}) => {
  const [aiSuggestionUpdate, setAiSuggestionUpdate] = useState(aiSuggestion);

  useEffect(() => {
    setAiSuggestionUpdate(aiSuggestion);
  }, [aiSuggestion]);

  const parseTriageResult = (content: string): TriageResult | null => {
    try {
      const stringContent = content;
      const clean = stringContent.replace(/```json|```/g, "").trim();
      return JSON.parse(clean) as TriageResult;
    } catch {
      return null;
    }
  };

  const triageResult = parseTriageResult(
    aiSuggestion?.suggestions?.content ?? "",
  );

  const handleSaveAISuggestion = async () => {
    if (triageResult?.isUnclear) {
      return;
    }
    try {
      toast.loading("Saving AI Suggestion...");
      await saveAiSuggestion(aiSuggestion?.id, triageResult);
      const issue = await getIssueById(aiSuggestion?.id);
      setAiSuggestionUpdate({
        id: issue?.issueId,
        issue: issue,
        suggestions: {
          jsonContent: issue?.aiSuggestion,
        },
      });
      toast.dismiss();
      toast.success("AI Suggestion saved successfully");
      onchange();
    } catch {
      toast.dismiss();
      toast.error("Failed to save AI Suggestion");
    }
  };

  return (
    <Modal
      isOpen={!!aiSuggestion}
      onClose={() => setAiSuggestion(null)}
      title={`AI Suggestion for #${aiSuggestion?.id.toString().padStart(4, "0")}`}
    >
      <div className="space-y-4">
        <div className="bg-bg-deep/50 p-4 rounded-xl border border-primary/20">
          <div className="flex justify-between items-center">
            <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center mb-2">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center gap-2">
              {triageResult &&
                !triageResult?.isUnclear &&
                !aiSuggestionUpdate?.suggestions?.jsonContent && (
                  <button
                    onClick={handleSaveAISuggestion}
                    className="bg-accent text-white px-2 py-2 rounded-md hover:bg-accent/80 transition-colors text-xs"
                  >
                    Save AI Suggestion
                  </button>
                )}
              {aiSuggestionUpdate?.suggestions?.jsonContent && (
                <span className="text-xs text-accent p-2 border border-accent rounded-md font-bold flex items-center gap-2">
                  Saved Suggestion{" "}
                  <IconSparkles2 className="w-4 h-4 text-accent" />
                </span>
              )}
            </div>
          </div>

          {triageResult ? (
            <TriageReport
              data={triageResult}
              issue={aiSuggestionUpdate?.issue}
            />
          ) : aiSuggestionUpdate?.suggestions?.jsonContent ? (
            <TriageReport
              data={aiSuggestionUpdate?.suggestions?.jsonContent}
              issue={aiSuggestionUpdate?.issue}
            />
          ) : (
            <span className="text-sm text-red-500">
              Failed to parse AI response. Raw content:
              <pre className="mt-2 text-xs whitespace-pre-wrap break-all">
                {aiSuggestionUpdate?.suggestions?.content}
              </pre>
            </span>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default AISuggestion;
