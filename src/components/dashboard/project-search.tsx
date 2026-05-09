"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export function ProjectSearch() {
  return (
    <div className="relative hidden sm:block">
      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
      <Input
        placeholder="搜索项目..."
        className="h-9 w-48 lg:w-64 pl-9 rounded-lg bg-background"
        onChange={(e) => {
          const q = e.target.value.toLowerCase()
          document.querySelectorAll<HTMLAnchorElement>('[data-project-card]').forEach((el) => {
            const name = el.dataset.projectName?.toLowerCase() || ""
            el.style.display = name.includes(q) ? "" : "none"
          })
        }}
      />
    </div>
  )
}
