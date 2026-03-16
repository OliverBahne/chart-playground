import type { ReactNode } from 'react'

interface AppLayoutProps {
  sidebar: ReactNode
  preview: ReactNode
}

export function AppLayout({ sidebar, preview }: AppLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-canvas">
      <main className="flex-1 overflow-auto">
        {preview}
      </main>
      <aside className="w-[400px] shrink-0 border-l border-border bg-sidebar-background overflow-hidden flex flex-col">
        {sidebar}
      </aside>
    </div>
  )
}
