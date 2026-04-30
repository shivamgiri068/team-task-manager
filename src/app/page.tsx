import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import Link from 'next/link'

export default async function Home() {
  const session = await getSession()

  if (session) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-white">
      <div className="max-w-3xl px-6 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-secondary mb-6">
          Team Task Manager
        </h1>
        <p className="text-xl md:text-2xl text-text-muted mb-10">
          Manage your projects, assign tasks, and track team progress all in one place with role-based access control.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/login"
            className="px-8 py-4 text-lg font-semibold rounded-xl bg-primary text-white hover:bg-primary-hover hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="px-8 py-4 text-lg font-semibold rounded-xl bg-white text-primary border-2 border-primary hover:bg-indigo-50 transition-all duration-200"
          >
            Create Account
          </Link>
        </div>
      </div>
      
      {/* Decorative background elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-3xl mix-blend-multiply"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/10 blur-3xl mix-blend-multiply"></div>
      </div>
    </div>
  )
}
