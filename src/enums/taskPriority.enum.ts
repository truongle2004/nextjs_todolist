export const TaskPriorityEnum = {
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
} as const;

export type TaskPriorityEnum =
  (typeof TaskPriorityEnum)[keyof typeof TaskPriorityEnum];
