import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { FileQuestion, Loader2, ShieldAlert } from "lucide-react"
import { createHashRouter, Link, Navigate, Outlet, RouterProvider } from "react-router-dom"
import { EmptyState } from "@/components/common/EmptyState"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Button } from "@/components/ui/button"
import { DirectionProvider } from "@/components/ui/direction"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { AppFormPage } from "@/pages/AppFormPage"
import { AppsPage } from "@/pages/AppsPage"
import { CredentialsReportPage } from "@/pages/CredentialsReportPage"
import { LoginPage } from "@/pages/LoginPage"
import { AuthProvider, useAuth } from "@/services/auth/AuthProvider"

/** Apps workspace — assistant job title or system admin only. */
function RequireAppsAccess() {
  const { canManageApps, signOut } = useAuth()
  if (!canManageApps) {
    return (
      <div className="mx-auto grid max-w-lg gap-4 px-4 py-16 text-center">
        <ShieldAlert className="mx-auto size-10 text-amber-700" aria-hidden />
        <h1 className="font-heading text-xl font-bold text-foreground">لا تملك صلاحية هذا النظام</h1>
        <p className="text-[14px] leading-7 text-muted-foreground">
          منصة التطبيقات والمتابعة الفنية متاحة لحسابات المساعد أو مدير النظام فقط.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => {
              signOut()
            }}
          >
            تسجيل الخروج
          </Button>
        </div>
      </div>
    )
  }
  return <Outlet />
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: true },
    mutations: { retry: 0 },
  },
})

function AppShell() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center gap-2 bg-background text-muted-foreground">
        <Loader2 className="size-5 animate-spin" aria-hidden />
        جارٍ التحميل…
      </div>
    )
  }

  if (!user) return <LoginPage />

  return <Outlet />
}

function NotFoundPage() {
  return (
    <EmptyState
      icon={FileQuestion}
      title="الصفحة غير موجودة"
      description="الرابط الذي فتحته غير صحيح أو أن الصفحة نُقلت."
      action={
        <Button asChild variant="outline">
          <Link to="/apps">العودة إلى التطبيقات</Link>
        </Button>
      }
    />
  )
}

const router = createHashRouter([
  {
    element: <AppShell />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          {
            element: <RequireAppsAccess />,
            children: [
              { index: true, element: <Navigate to="/apps" replace /> },
              { path: "apps", element: <AppsPage /> },
              { path: "apps/new", element: <AppFormPage /> },
              { path: "apps/credentials", element: <CredentialsReportPage /> },
              { path: "apps/:id/edit", element: <AppFormPage /> },
              { path: "*", element: <NotFoundPage /> },
            ],
          },
        ],
      },
    ],
  },
])

export default function App() {
  return (
    <DirectionProvider dir="rtl">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider delayDuration={250}>
          <AuthProvider>
            <RouterProvider router={router} />
          </AuthProvider>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </DirectionProvider>
  )
}
