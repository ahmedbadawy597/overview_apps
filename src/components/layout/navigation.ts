import { KeyRound, LayoutGrid, type LucideIcon } from "lucide-react"
import type { Permission } from "@/services/auth/roles"

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  end?: boolean
  permission?: Permission
}

export const MAIN_NAV: NavItem[] = [
  {
    to: "/apps",
    label: "التطبيقات",
    icon: LayoutGrid,
    end: true,
    permission: "manageApps",
  },
  {
    to: "/apps/credentials",
    label: "تقرير بيانات الوصول",
    icon: KeyRound,
    permission: "manageApps",
  },
]

export const PAGE_TITLES: Record<string, string> = {
  "/": "التطبيقات",
  "/apps": "التطبيقات",
  "/apps/new": "إضافة تطبيق",
  "/apps/credentials": "تقرير بيانات الوصول",
}
