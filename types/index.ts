import { $Enums } from "@prisma/client";

export type TaskStatus   = $Enums.TaskStatus;
export type TaskPriority = $Enums.TaskPriority;

export type Task = {
  id:          string;
  title:       string;
  description: string | null;
  status:      TaskStatus;
  priority:    TaskPriority;
  dueDate:     Date | null;
  createdAt:   Date;
  updatedAt:   Date;
};