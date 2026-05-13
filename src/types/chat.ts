export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  isLoading?: boolean;
}

export interface ConversationHistory {
  messages: Message[];
}
