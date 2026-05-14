import { z } from "zod";
import { SolverMetricsSchema } from "@/types/simulation";

const MessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().max(2000),
});

export const ParseRequestSchema = z.object({
  message: z.string().min(1).max(500).trim(),
  conversationHistory: z.array(MessageSchema).max(20),
  currentSystem: z.string().max(50).nullish(),
});

export const ExplainRequestSchema = z.object({
  systemType: z.enum(["spring_mass", "pendulum", "projectile", "pid", "rc_circuit"]),
  parameters: z.record(z.string(), z.number().finite()),
  solverOutput: SolverMetricsSchema,
  conversationHistory: z.array(MessageSchema).max(20),
  userQuestion: z.string().min(1).max(500).trim(),
});

export type ParseRequest = z.infer<typeof ParseRequestSchema>;
export type ExplainRequest = z.infer<typeof ExplainRequestSchema>;
