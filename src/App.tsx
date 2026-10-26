import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from 'sonner'
import { AuthProvider, useAuth } from '@/auth/AuthProvider'
import { RedirectIfAuthed, RequireAuth } from '@/auth/guards'
import { FullPageSpinner } from '@/components/ui/Spinner'
import { homePathForRole } from '@/lib/roles'
import LoginPage from '@/pages/LoginPage'
import RegisterPage from '@/pages/RegisterPage'
import ForgotPasswordPage from '@/pages/ForgotPasswordPage'
import ResetPasswordPage from '@/pages/ResetPasswordPage'
import VerifyEmailPage from '@/pages/VerifyEmailPage'

const StudentFoundationShell = lazy(() => import('@/pages/StudentFoundationShell'))
const WorkflowSection = lazy(() => import('@/pages/WorkflowSection'))
const FacultyDashboard = lazy(() => import('@/pages/FacultyDashboard'))
const AdminDashboard = lazy(() => import('@/pages/AdminDashboard'))
const PublicPortfolioPage = lazy(() => import('@/pages/PublicPortfolioPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

function Home() {
  const { user, profile, loading } = useAuth()
  if (loading) return <FullPageSpinner label="Loading…" />
  if (user && profile) return <Navigate to={homePathForRole(profile.role)} replace />
  return <Navigate to="/login" replace />
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '') || undefined}>
      <AuthProvider>
        <Suspense fallback={<FullPageSpinner label="Loading…" />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route element={<RedirectIfAuthed />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="/student/:username" element={<PublicPortfolioPage />} />
            <Route element={<RequireAuth allow={['student']} />}>
              <Route path="/dashboard" element={<StudentFoundationShell />} />
              <Route path="/dashboard/workflow/:code" element={<WorkflowSection />} />
            </Route>
            <Route element={<RequireAuth allow={['faculty', 'admin']} />}>
              <Route path="/faculty" element={<FacultyDashboard />} />
            </Route>
            <Route element={<RequireAuth allow={['admin']} />}>
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
        <Toaster theme="dark" position="top-right" richColors closeButton />
      </AuthProvider>
    </BrowserRouter>
  )
}
