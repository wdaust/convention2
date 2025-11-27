'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, Briefcase, ClipboardList, ArrowRight } from 'lucide-react'

type Stats = {
  volunteers: number
  departments: number
  assignments: number
}

type RecentAssignment = {
  id: string
  volunteer: {
    firstName: string
    lastName: string
  }
  department: {
    name: string
  }
  role: string | null
  createdAt: string
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({ volunteers: 0, departments: 0, assignments: 0 })
  const [recentAssignments, setRecentAssignments] = useState<RecentAssignment[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [volunteersRes, departmentsRes, assignmentsRes] = await Promise.all([
        fetch('/api/volunteers'),
        fetch('/api/departments'),
        fetch('/api/assignments'),
      ])

      const [volunteersData, departmentsData, assignmentsData] = await Promise.all([
        volunteersRes.json(),
        departmentsRes.json(),
        assignmentsRes.json(),
      ])

      setStats({
        volunteers: volunteersData.length,
        departments: departmentsData.length,
        assignments: assignmentsData.length,
      })

      setRecentAssignments(assignmentsData.slice(0, 5))
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to the Convention Work Organizer</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Volunteers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : stats.volunteers}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Registered volunteers
            </p>
            <Link href="/volunteers">
              <Button variant="link" className="p-0 h-auto mt-2">
                Manage volunteers <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : stats.departments}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Active departments
            </p>
            <Link href="/departments">
              <Button variant="link" className="p-0 h-auto mt-2">
                Manage departments <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assignments</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : stats.assignments}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Current assignments
            </p>
            <Link href="/assignments">
              <Button variant="link" className="p-0 h-auto mt-2">
                Manage assignments <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Assignments */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Assignments</CardTitle>
              <CardDescription>Latest volunteer assignments</CardDescription>
            </div>
            <Link href="/assignments">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : recentAssignments.length === 0 ? (
            <div className="text-center py-8">
              <ClipboardList className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No assignments yet</p>
              <p className="text-sm text-muted-foreground mb-4">
                Start by adding volunteers and departments, then create assignments
              </p>
              <div className="flex gap-2 justify-center flex-wrap">
                <Link href="/volunteers">
                  <Button variant="outline" size="sm">
                    <Users className="mr-2 h-4 w-4" />
                    Add Volunteers
                  </Button>
                </Link>
                <Link href="/departments">
                  <Button variant="outline" size="sm">
                    <Briefcase className="mr-2 h-4 w-4" />
                    Add Departments
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {recentAssignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="space-y-1">
                    <p className="font-medium">
                      {assignment.volunteer.firstName} {assignment.volunteer.lastName}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{assignment.department.name}</span>
                      {assignment.role && (
                        <>
                          <span>•</span>
                          <span>{assignment.role}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(assignment.createdAt)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks to get you started</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link href="/volunteers">
              <Button variant="outline" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                Add Volunteer
              </Button>
            </Link>
            <Link href="/departments">
              <Button variant="outline" className="w-full justify-start">
                <Briefcase className="mr-2 h-4 w-4" />
                Add Department
              </Button>
            </Link>
            <Link href="/assignments">
              <Button
                variant="outline"
                className="w-full justify-start"
                disabled={stats.volunteers === 0 || stats.departments === 0}
              >
                <ClipboardList className="mr-2 h-4 w-4" />
                Create Assignment
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
