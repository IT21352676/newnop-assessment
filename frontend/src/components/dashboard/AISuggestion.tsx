import { Bot } from "lucide-react";
import Modal from "../ui/Modal";
import TriageReport, { TriageResult } from "../dashboard/TriageReport";

const AISuggestion = ({
  aiSuggestion,
  setAiSuggestion,
}: {
  aiSuggestion: {
    id: string;
    suggestions: { content: string; reasoning: string; role: string };
  };
  setAiSuggestion: (aiSuggestion: null) => void;
}) => {
  // content is a raw JSON string — strip markdown fences then parse
  const parseTriageResult = (content: string): TriageResult | null => {
    try {
      const clean = content.replace(/```json|```/g, "").trim();
      return JSON.parse(clean) as TriageResult;
    } catch {
      return null;
    }
  };

  const triageResult = parseTriageResult(
    aiSuggestion?.suggestions?.content ?? "",
  );

  return (
    <Modal
      isOpen={!!aiSuggestion}
      onClose={() => setAiSuggestion(null)}
      title={`AI Suggestion for #${aiSuggestion?.id.toString().padStart(4, "0")}`}
    >
      <div className="space-y-4">
        <div className="bg-bg-deep/50 p-4 rounded-xl border border-primary/20">
          <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center mb-2">
            <Bot className="w-6 h-6 text-white" />
          </div>

          {triageResult ? (
            <TriageReport data={triageResult} />
          ) : (
            <p className="text-sm text-red-500">
              Failed to parse AI response. Raw content:
              <pre className="mt-2 text-xs whitespace-pre-wrap break-all">
                {aiSuggestion?.suggestions?.content}
              </pre>
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default AISuggestion;
