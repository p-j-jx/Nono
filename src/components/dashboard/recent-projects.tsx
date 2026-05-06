"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Clock } from "lucide-react"

type RecentProject = {
  id: string
  name: string
  viewedAt: number
}

export function RecentProjects() {
  const [recent, setRecent] = useState<RecentProject[]>([])

  useEffect(() => {
    try {
      const stored = JSON.parse(
        localStorage.getItem("recentProjects") || "[]"
      ) as RecentProject[]
      setRecent(stored.slice(0, 5))
    } catch {
      // ignore
    }
  }, [])

  if (recent.length === 0) return null

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-4">最近查看</h2>
      <div className="flex flex-wrap gap-2">
        {recent.map((project) => (
          <Link key={project.id} href={`/dashboard/${project.id}`}>
            <Card className="transition-all duration-300 hover:shadow-md hover:border-primary/20 cursor-pointer group/card">
              <CardContent className="py-2.5 px-4">
                <div className="flex items-center gap-2">
                  <Clock className="size-3.5 text-muted-foreground shrink-0" />
                  <span className="text-sm font-medium group-hover/card:text-primary transition-colors truncate max-w-[200px]">
                    {project.name}
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
