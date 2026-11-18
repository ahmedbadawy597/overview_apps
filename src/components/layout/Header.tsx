import { ChevronLeft, Menu } from "lucide-react"
import { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Logo } from "@/components/brand/Logo"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { PAGE_TITLES } from "./navigation"
import { RoleBadge, UserMenu } from "./UserMenu"

interface Crumb {
  label: string
  to?: string
}

export function useBreadcrumbs(): Crumb[] {
  const { pathname } = useLocation()
  const home: Crumb = { label: "التطبيقات", to: "/apps" }
  if (pathname === "/" || pathname === "/apps") return [{ label: "التطبيقات" }]
  if (pathname === "/apps/new") return [home, { label: "إضافة تطبيق" }]
  if (pathname === "/apps/credentials") return [home, { label: "تقرير بيانات الوصول" }]
  const appEdit = pathname.match(/^\/apps\/([^/]+)\/edit$/)
  if (appEdit) return [home, { label: "تعديل التطبيق" }]
  return [home, { label: PAGE_TITLES[pathname] ?? "صفحة غير موجودة" }]
}

interface HeaderProps {
  onOpenMobileNav: () => void
}

export function Header({ onOpenMobileNav }: HeaderProps) {
  const crumbs = useBreadcrumbs()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-[var(--header-height)] items-center gap-3 border-b px-4 transition-[background-color,box-shadow,border-color] duration-300 ease-out sm:px-6 lg:px-8 print:hidden",
        scrolled
          ? "border-transparent bg-background/80 shadow-header backdrop-blur-md backdrop-saturate-150"
          : "border-line-soft bg-background",
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className="text-[#3d4945] hover:bg-surface lg:hidden"
        onClick={onOpenMobileNav}
        aria-label="فتح القائمة"
      >
        <Menu className="size-5" />
      </Button>

      <Link to="/apps" className="flex-none lg:hidden" aria-label="التطبيقات">
        <Logo size={36} />
      </Link>

      <nav aria-label="مسار الصفحة" className="min-w-0 flex-1">
        <ol className="flex min-w-0 items-center gap-1.5 text-[13px]">
          {crumbs.map((crumb, i) => {
            const last = i === crumbs.length - 1
            return (
              <li key={i} className={last ? "flex min-w-0 items-center gap-1.5" : "hidden items-center gap-1.5 xl:flex"}>
                {crumb.to && !last ? (
                  <Link to={crumb.to} className="whitespace-nowrap text-muted-foreground transition-colors hover:text-brand">
                    {crumb.label}
                  </Link>
                ) : (
                  <span aria-current="page" className="font-heading truncate text-[16px] leading-relaxed font-bold text-foreground">
                    {crumb.label}
                  </span>
                )}
                {!last && <ChevronLeft className="size-3.5 flex-none text-faint" aria-hidden />}
              </li>
            )
          })}
        </ol>
      </nav>

      <div className="flex flex-none items-center gap-1.5 sm:gap-2">
        <RoleBadge />
        <UserMenu />
      </div>
    </header>
  )
}
