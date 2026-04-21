import { Bot } from "lucide-react";
import ReactMarkdown from "react-markdown";
import Modal from "../ui/Modal";

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
  return (
    <Modal
      isOpen={!!aiSuggestion}
      onClose={() => {
        setAiSuggestion(null);
      }}
      title={`AI Suggestion for #${aiSuggestion?.id.toString().padStart(4, "0")}`}
    >
      <div className="space-y-4">
        <div className="bg-bg-deep/50 p-4 rounded-xl border border-primary/20">
          <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center mb-2">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div className="prose max-w-none text-left">
            <ReactMarkdown>{aiSuggestion?.suggestions?.content}</ReactMarkdown>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AISuggestion;
