export interface AIResponse {
  result: any;
  confidence: number;
  reasoning: string;
  fallbackUsed?: boolean;
}

export class AIService {
  // Rule-based fallback for when AI is not available
  static parseTaskSimple(description: string): AIResponse {
    const lowerDesc = description.toLowerCase();

    let priority: "LOW" | "MEDIUM" | "HIGH" = "MEDIUM";
    if (
      lowerDesc.includes("urgent") ||
      lowerDesc.includes("asap") ||
      lowerDesc.includes("important")
    ) {
      priority = "HIGH";
    } else if (
      lowerDesc.includes("when you have time") ||
      lowerDesc.includes("low priority")
    ) {
      priority = "LOW";
    }

    const wordCount = description.split(/\s+/).length;
    let estimatedHours = 1;
    if (wordCount > 50) estimatedHours = 4;
    if (wordCount > 200) estimatedHours = 8;
    if (description.includes("research") || description.includes("analyze"))
      estimatedHours *= 1.5;

    const title = description.split(/[.!?]/)[0].substring(0, 50);

    return {
      result: {
        title: title || "New Task",
        priority,
        estimatedHours,
      },
      confidence: 0.6,
      reasoning: "Rule-based parsing applied",
      fallbackUsed: true,
    };
  }

  static categorizeExpenseSimple(
    description: string,
    amount: number
  ): AIResponse {
    const lowerDesc = description.toLowerCase();
    const categories = [
      {
        keywords: ["uber", "lyft", "taxi", "train", "flight", "hotel"],
        category: "Travel",
      },
      {
        keywords: ["lunch", "dinner", "coffee", "restaurant", "food"],
        category: "Meals",
      },
      {
        keywords: ["amazon", "software", "subscription", "license"],
        category: "Software",
      },
      {
        keywords: ["office", "supplies", "printer", "desk"],
        category: "Office",
      },
      {
        keywords: ["course", "training", "book", "conference"],
        category: "Training",
      },
      {
        keywords: ["salary", "payment", "invoice", "freelance"],
        category: "Payroll",
      },
      {
        keywords: ["advertising", "marketing", "social media", "campaign"],
        category: "Marketing",
      },
    ];

    for (const { keywords, category } of categories) {
      if (keywords.some((keyword) => lowerDesc.includes(keyword))) {
        return {
          result: { category },
          confidence: 0.7,
          reasoning: `Matched keywords: ${keywords.join(", ")}`,
          fallbackUsed: true,
        };
      }
    }

    if (amount > 1000)
      return {
        result: { category: "Equipment" },
        confidence: 0.5,
        reasoning: "High amount suggests equipment purchase",
        fallbackUsed: true,
      };

    if (amount < 50)
      return {
        result: { category: "Miscellaneous" },
        confidence: 0.4,
        reasoning: "Small amount, categorizing as miscellaneous",
        fallbackUsed: true,
      };

    return {
      result: { category: "Other" },
      confidence: 0.3,
      reasoning: "No clear category match found",
      fallbackUsed: true,
    };
  }

  // Smart task parsing with AI (mock for now)
  static async parseTaskWithAI(description: string): Promise<AIResponse> {
    // In production, this would call your AI API
    // For now, we'll use the simple version
    return this.parseTaskSimple(description);
  }

  // Expense categorization with AI (mock for now)
  static async categorizeExpenseWithAI(
    description: string,
    amount: number
  ): Promise<AIResponse> {
    // In production, this would call your AI API
    return this.categorizeExpenseSimple(description, amount);
  }
}
