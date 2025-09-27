export const StatusEnum = {
  TODO: 'todo',
  IN_PROGRESS: 'in-progress',
  DONE: 'done',
} as const;

export type StatusEnum = (typeof StatusEnum)[keyof typeof StatusEnum];
