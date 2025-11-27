import type { Metadata } from "next"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import Link from "next/link"
import { Users, Briefcase, ClipboardList, Home } from "lucide-react"

export const metadata: Metadata = {
  title: "Convention Work Organizer",
  description: "Organize work and volunteers for Jehovah's Witnesses conventions",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <div className="min-h-screen flex flex-col">
          {/* Header */}
          <header className="border-b bg-white sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <Link href="/" className="flex items-center space-x-2">
                  <ClipboardList className="h-6 w-6 text-primary" />
                  <span className="text-xl font-semibold">Convention Work Organizer</span>
                </Link>
              </div>
            </div>
          </header>

          <div className="flex-1 flex">
            {/* Sidebar Navigation */}
            <nav className="w-64 border-r bg-white hidden md:block">
              <div className="p-4 space-y-2">
                <Link
                  href="/"
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors"
                >
                  <Home className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  href="/volunteers"
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors"
                >
                  <Users className="h-5 w-5" />
                  <span>Volunteers</span>
                </Link>
                <Link
                  href="/departments"
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors"
                >
                  <Briefcase className="h-5 w-5" />
                  <span>Departments</span>
                </Link>
                <Link
                  href="/assignments"
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors"
                >
                  <ClipboardList className="h-5 w-5" />
                  <span>Assignments</span>
                </Link>
              </div>
            </nav>

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-white z-50">
              <div className="flex justify-around p-2">
                <Link
                  href="/"
                  className="flex flex-col items-center px-3 py-2 rounded-lg hover:bg-accent"
                >
                  <Home className="h-5 w-5" />
                  <span className="text-xs mt-1">Home</span>
                </Link>
                <Link
                  href="/volunteers"
                  className="flex flex-col items-center px-3 py-2 rounded-lg hover:bg-accent"
                >
                  <Users className="h-5 w-5" />
                  <span className="text-xs mt-1">Volunteers</span>
                </Link>
                <Link
                  href="/departments"
                  className="flex flex-col items-center px-3 py-2 rounded-lg hover:bg-accent"
                >
                  <Briefcase className="h-5 w-5" />
                  <span className="text-xs mt-1">Departments</span>
                </Link>
                <Link
                  href="/assignments"
                  className="flex flex-col items-center px-3 py-2 rounded-lg hover:bg-accent"
                >
                  <ClipboardList className="h-5 w-5" />
                  <span className="text-xs mt-1">Assignments</span>
                </Link>
              </div>
            </nav>

            {/* Main Content */}
            <main className="flex-1 bg-gray-50 overflow-auto pb-20 md:pb-0">
              <div className="container mx-auto px-4 py-6">
                {children}
              </div>
            </main>
          </div>
        </div>
        <Toaster />
      </body>
    </html>
  )
}
