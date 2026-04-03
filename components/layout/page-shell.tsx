import { cn } from "@/utils/helpers";

interface PageShellProps {
  children: React.ReactNode;
  className?: string;
}

export function PageShell({ children, className }: PageShellProps) {
  return (
    <main
      className={cn("relative min-h-screen overflow-x-clip pb-24", className)}
    >
      <div className="pointer-events-none absolute inset-0 -z-10 page-atmosphere" />
      <div className="pointer-events-none absolute inset-0 -z-10 page-grid" />
      {children}
    </main>
  );
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export function PageHeader({ title, subtitle, icon, action }: PageHeaderProps) {
  return (
    <header className="mb-10 md:mb-14">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-3">
            {icon ? <span className="text-(--primary)">{icon}</span> : null}
            <h1 className="text-balance text-3xl font-black tracking-tight text-(--text-primary) md:text-5xl">
              {title}
            </h1>
          </div>
          {subtitle ? (
            <p className="max-w-2xl text-pretty text-sm text-(--text-tertiary) md:text-base">
              {subtitle}
            </p>
          ) : null}
        </div>
        {action ? <div>{action}</div> : null}
      </div>
    </header>
  );
}
