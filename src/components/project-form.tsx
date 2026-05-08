"use client"

import { WorkspaceForm } from "@/components/workspace"

export default function ProjectForm(props: {
  initialData?: Record<string, unknown> & { id?: string }
  projectId?: string
}) {
  return <WorkspaceForm {...(props as any)} />
}
