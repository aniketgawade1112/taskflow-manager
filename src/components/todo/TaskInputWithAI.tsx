import { useState } from "react";
import { Sparkles, Wand2 } from "lucide-react";
import { Button } from "../common/Button";
import { useAI } from "../../context/AIContext";
import { AIService } from "../../utils/ai";

interface TaskInputWithAIProps {
  onTaskCreate: (task: {
    title: string;
    description?: string;
    priority?: "low" | "medium" | "high";
    estimatedHours?: number;
  }) => void;
}

export function TaskInputWithAI({ onTaskCreate }: TaskInputWithAIProps) {
  const [input, setInput] = useState("");
  const [isAIProcessing, setIsAIProcessing] = useState(false);
  const { settings } = useAI();

  const handleAIAssist = async () => {
    if (!input.trim() || !settings.taskParsing) return;

    setIsAIProcessing(true);
    try {
      const response = await AIService.parseTaskWithAI(input);

      if (response.confidence > 0.7) {
        onTaskCreate({
          title: response.result.title,
          description: `AI-enhanced: ${input}`,
          priority: response.result.priority.toLowerCase(),
          estimatedHours: response.result.estimatedHours,
        });
        setInput("");
      } else {
        // Fallback to simple creation
        onTaskCreate({
          title: input,
          description: "Added with AI assist (low confidence)",
        });
        setInput("");
      }
    } catch (error) {
      console.error("AI processing failed:", error);
      onTaskCreate({ title: input });
      setInput("");
    } finally {
      setIsAIProcessing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    if (settings.taskParsing) {
      // Try quick AI parsing
      const quickResult = AIService.parseTaskSimple(input);
      onTaskCreate({
        title: quickResult.result.title,
        priority: quickResult.result.priority.toLowerCase(),
        estimatedHours: quickResult.result.estimatedHours,
      });
    } else {
      onTaskCreate({ title: input });
    }

    setInput("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a task or describe what you need to do..."
          className="flex-1 px-4 py-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700 
                     focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400
                     transition-all duration-200"
          data-search-input
        />

        {settings.taskParsing && (
          <Button
            type="button"
            onClick={handleAIAssist}
            disabled={isAIProcessing || !input.trim()}
            variant="secondary"
            className="flex items-center gap-2 whitespace-nowrap"
          >
            {isAIProcessing ? (
              <Wand2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            Enhance
          </Button>
        )}

        <Button type="submit" disabled={!input.trim()} className="px-6">
          Add
        </Button>
      </div>

      {settings.taskParsing && (
        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
          <Sparkles className="w-3 h-3" />
          <span>
            Try: "Prepare quarterly report by Friday" or "Research competitors
            for Q2"
          </span>
        </div>
      )}

      <div className="text-xs text-gray-400 dark:text-gray-500">
        Press{" "}
        <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded border">
          Ctrl/Cmd
        </kbd>{" "}
        +
        <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded border mx-1">
          K
        </kbd>
        to quickly add tasks
      </div>
    </form>
  );
}
