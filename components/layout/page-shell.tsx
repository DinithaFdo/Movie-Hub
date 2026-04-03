import { cn } from "@/utils/helpers";

interface PageShellProps {
  children: React.ReactNode;
  className?: string;
}

export function PageShell({ children, className }: PageShellProps) {
  return (
    <main
      className={cn("relative min-h-screen overflow-x-clip bg-[#0D0D0F] pt-32 pb-24", className)}
    >
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-[#1A1A1D]/30 to-transparent" />
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
            {icon ? <span className="text-[#D4FF3E]">{icon}</span> : null}
            <h1 className="text-balance text-4xl font-black tracking-tight text-white md:text-5xl lg:text-6xl">
              {title}
            </h1>
          </div>
          {subtitle ? (
            <p className="max-w-xl mt-4 text-pretty text-sm font-medium text-[#8A8A8E] md:text-lg">
              {subtitle}
            </p>
          ) : null}
        </div>
        {action ? <div>{action}</div> : null}
      </div>
    </header>
  );
}
