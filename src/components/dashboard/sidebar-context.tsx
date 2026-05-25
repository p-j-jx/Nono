"use client"

import { createContext, useContext, useState, useCallback, useSyncExternalStore } from "react"

const COLLAPSED_KEY = "dashboard-sidebar-collapsed"
const COLLAPSED_CHANGE_EVENT = "sidebar-collapsed-change"

type SidebarContextType = {
  /** Mobile drawer open state */
  open: boolean
  toggle: () => void
  close: () => void
  /** Desktop collapsed state (icons only) */
  collapsed: boolean
  toggleCollapsed: () => void
}

const SidebarContext = createContext<SidebarContextType>({
  open: false,
  toggle: () => {},
  close: () => {},
  collapsed: false,
  toggleCollapsed: () => {},
})

// Subscribe to both cross-tab "storage" events and same-tab custom events
function subscribeCollapsed(callback: () => void) {
  window.addEventListener("storage", callback)
  window.addEventListener(COLLAPSED_CHANGE_EVENT, callback)
  return () => {
    window.removeEventListener("storage", callback)
    window.removeEventListener(COLLAPSED_CHANGE_EVENT, callback)
  }
}

function getCollapsedSnapshot() {
  return localStorage.getItem(COLLAPSED_KEY) === "1"
}

// SSR fallback — default to expanded so hydration matches initial client render
function getCollapsedServerSnapshot() {
  return false
}

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const collapsed = useSyncExternalStore(
    subscribeCollapsed,
    getCollapsedSnapshot,
    getCollapsedServerSnapshot
  )

  const toggle = useCallback(() => setOpen((v) => !v), [])
  const close = useCallback(() => setOpen(false), [])
  const toggleCollapsed = useCallback(() => {
    const current = localStorage.getItem(COLLAPSED_KEY) === "1"
    localStorage.setItem(COLLAPSED_KEY, current ? "0" : "1")
    // Custom event so other components using useSyncExternalStore in the same tab also re-render
    window.dispatchEvent(new Event(COLLAPSED_CHANGE_EVENT))
  }, [])

  return (
    <SidebarContext.Provider value={{ open, toggle, close, collapsed, toggleCollapsed }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  return useContext(SidebarContext)
}
