import { type ReactNode } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { NavLink } from "react-router-dom"
import { Logo } from "@/components/brand/Logo"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { useAuth } from "@/services/auth/AuthProvider"
import { MAIN_NAV, type NavItem } from "./navigation"

interface SidebarProps {
  collapsed?: boolean
  onToggleCollapsed?: () => void
  /** Called after navigating, so the mobile sheet can close. */
  onNavigate?: () => void
  className?: string
}

export function Sidebar({ collapsed = false, onToggleCollapsed, onNavigate, className }: SidebarProps) {
  const { can } = useAuth()
  const mainItems = MAIN_NAV.filter((item) => !item.permission || can(item.permission))

  return (
    <aside
      aria-label="القائمة الرئيسية"
      className={cn(
        "relative flex h-full flex-col",
        collapsed ? "w-[var(--sidebar-collapsed)] bg-[#f6f8f7]" : "w-[var(--sidebar-width)] bg-surface",
        className,
      )}
    >
      {/* Top: toggle (+ brand when expanded) */}
      <div
        className={cn(
          "flex shrink-0 flex-col",
          collapsed ? "items-center gap-3 px-2 pt-4 pb-3" : "gap-4 px-4 pt-5 pb-4",
        )}
      >
        {onToggleCollapsed && (
          <RailIconButton
            collapsed={collapsed}
            label={collapsed ? "توسيع القائمة الجانبية" : "طي القائمة الجانبية"}
            onClick={onToggleCollapsed}
            bordered
            className="text-brand"
          >
            {collapsed ? <ChevronLeft className="size-[18px]" strokeWidth={2} /> : <ChevronRight className="size-[18px]" strokeWidth={2} />}
          </RailIconButton>
        )}

        {collapsed ? (
          <div className="h-px w-8 bg-[#d7dedb]" aria-hidden />
        ) : (
          <div className="flex items-center gap-3">
            <div className="relative flex size-14 items-center justify-center rounded-xl bg-white p-1.5 shadow-card ring-1 ring-line-soft">
              <Logo size={44} />
            </div>
            <div className="grid min-w-0 flex-1 gap-0.5">
              <p className="font-heading truncate text-[16px] leading-snug font-bold text-brand">منصة التطبيقات</p>
              <p className="truncate text-[11.5px] leading-relaxed text-muted-foreground">وزارة الأوقاف المصرية</p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav
        className={cn(
          "flex min-h-0 flex-1 flex-col overflow-y-auto",
          collapsed ? "items-center gap-2 px-2 py-1" : "gap-5 px-3 py-2",
        )}
      >
        <NavSection label="المنصة" collapsed={collapsed}>
          {mainItems.map((item) => (
            <SidebarLink
              key={item.to}
              item={item}
              collapsed={collapsed}
              onNavigate={onNavigate}
            />
          ))}
        </NavSection>
      </nav>
    </aside>
  )
}

function NavSection({
  label,
  collapsed,
  children,
}: {
  label: string
  collapsed: boolean
  children: ReactNode
}) {
  return (
    <div className={cn("grid", collapsed ? "justify-items-center gap-2" : "gap-1")}>
      {!collapsed && <p className="px-2.5 pb-1 text-[11.5px] font-bold text-muted-foreground">{label}</p>}
      <ul className={cn("grid", collapsed ? "justify-items-center gap-2" : "gap-0.5")}>{children}</ul>
    </div>
  )
}

function RailIconButton({
  collapsed,
  label,
  onClick,
  children,
  bordered,
  className,
}: {
  collapsed: boolean
  label: string
  onClick: () => void
  children: ReactNode
  bordered?: boolean
  className?: string
}) {
  const button = (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "group flex size-10 items-center justify-center rounded-[12px] transition-[background-color,border-color,color,box-shadow] duration-200 ease-out outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
        bordered
          ? "border border-[#c5d0cb] bg-transparent text-brand hover:border-brand hover:bg-white"
          : "text-brand hover:bg-white/80",
        !collapsed && "w-full justify-start gap-2.5 px-2.5",
        className,
      )}
    >
      {children}
    </button>
  )

  if (!collapsed) return button
  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent side="left" sideOffset={12}>
        {label}
      </TooltipContent>
    </Tooltip>
  )
}

function SidebarLink({
  item,
  collapsed,
  onNavigate,
}: {
  item: NavItem
  collapsed: boolean
  onNavigate?: () => void
}) {
  const Icon = item.icon
  const link = (
    <NavLink
      to={item.to}
      end={item.end}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          "group relative flex items-center outline-none transition-[background-color,border-color,color,box-shadow] duration-200 ease-out focus-visible:ring-2 focus-visible:ring-ring/40",
          collapsed
            ? "size-10 justify-center rounded-[12px]"
            : "h-10 gap-2.5 rounded-xl px-2.5 text-[13.5px] font-medium",
          collapsed && !isActive && "text-brand hover:bg-white/80",
          collapsed && isActive && "border border-[#c5d0cb] bg-white text-brand shadow-xs",
          !collapsed && !isActive && "text-[#3d4945] hover:bg-surface-soft hover:text-foreground",
          !collapsed &&
            isActive &&
            "bg-surface-tint font-bold text-brand-dark shadow-xs before:absolute before:inset-y-2 before:start-0 before:w-[3px] before:rounded-full before:bg-gold",
        )
      }
      aria-label={collapsed ? item.label : undefined}
    >
      {({ isActive }) => (
        <>
          <Icon
            className={cn(
              "flex-none transition-[color,transform] duration-200 ease-out",
              collapsed ? "size-[18px]" : "size-[18px]",
              collapsed
                ? "text-brand"
                : isActive
                  ? "text-brand"
                  : "text-faint group-hover:scale-105 group-hover:text-brand",
            )}
            strokeWidth={1.75}
            aria-hidden
          />
          {!collapsed && <span className="min-w-0 flex-1 truncate">{item.label}</span>}
        </>
      )}
    </NavLink>
  )

  if (!collapsed) return <li>{link}</li>
  return (
    <li>
      <Tooltip>
        <TooltipTrigger asChild>{link}</TooltipTrigger>
        <TooltipContent side="left" sideOffset={12}>
          {item.label}
        </TooltipContent>
      </Tooltip>
    </li>
  )
}

