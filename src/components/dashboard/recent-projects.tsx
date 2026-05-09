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
    <div>
      <h2 className="text-sm font-semibold mb-3">最近查看</h2>
      <div className="flex flex-wrap gap-2">
        {recent.map((project) => (
          <Link key={project.id} href={`/dashboard/${project.id}`}>
            <Card className="transition-all duration-200 hover:shadow-sm hover:border-primary/20 cursor-pointer group/card" size="sm">
              <CardContent className="py-2 px-3">
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-primary/10 p-1">
                    <Clock className="size-3 text-primary" />
                  </div>
                  <span className="text-xs font-medium group-hover/card:text-primary transition-colors truncate max-w-[180px]">
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
