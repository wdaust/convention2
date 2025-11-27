'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { toast } from '@/components/ui/use-toast'
import { Plus, Pencil, Trash2, ClipboardList } from 'lucide-react'

type Assignment = {
  id: string
  volunteerId: string
  departmentId: string
  role: string | null
  startTime: string | null
  endTime: string | null
  notes: string | null
  volunteer: {
    firstName: string
    lastName: string
  }
  department: {
    name: string
  }
}

type Volunteer = {
  id: string
  firstName: string
  lastName: string
}

type Department = {
  id: string
  name: string
}

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [volunteers, setVolunteers] = useState<Volunteer[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null)
  const [formData, setFormData] = useState({
    volunteerId: '',
    departmentId: '',
    role: '',
    startTime: '',
    endTime: '',
    notes: '',
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [assignmentsRes, volunteersRes, departmentsRes] = await Promise.all([
        fetch('/api/assignments'),
        fetch('/api/volunteers'),
        fetch('/api/departments'),
      ])

      const [assignmentsData, volunteersData, departmentsData] = await Promise.all([
        assignmentsRes.json(),
        volunteersRes.json(),
        departmentsRes.json(),
      ])

      setAssignments(assignmentsData)
      setVolunteers(volunteersData)
      setDepartments(departmentsData)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch data',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.volunteerId || !formData.departmentId) {
      toast({
        title: 'Error',
        description: 'Please select both a volunteer and a department',
        variant: 'destructive',
      })
      return
    }

    try {
      if (editingAssignment) {
        const response = await fetch(`/api/assignments/${editingAssignment.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })

        if (response.ok) {
          toast({
            title: 'Success',
            description: 'Assignment updated successfully',
          })
        }
      } else {
        const response = await fetch('/api/assignments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })

        if (response.ok) {
          toast({
            title: 'Success',
            description: 'Assignment created successfully',
          })
        }
      }

      setIsDialogOpen(false)
      resetForm()
      fetchData()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save assignment',
        variant: 'destructive',
      })
    }
  }

  const handleEdit = (assignment: Assignment) => {
    setEditingAssignment(assignment)
    setFormData({
      volunteerId: assignment.volunteerId,
      departmentId: assignment.departmentId,
      role: assignment.role || '',
      startTime: assignment.startTime ? new Date(assignment.startTime).toISOString().slice(0, 16) : '',
      endTime: assignment.endTime ? new Date(assignment.endTime).toISOString().slice(0, 16) : '',
      notes: assignment.notes || '',
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this assignment?')) return

    try {
      const response = await fetch(`/api/assignments/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Assignment deleted successfully',
        })
        fetchData()
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete assignment',
        variant: 'destructive',
      })
    }
  }

  const resetForm = () => {
    setFormData({
      volunteerId: '',
      departmentId: '',
      role: '',
      startTime: '',
      endTime: '',
      notes: '',
    })
    setEditingAssignment(null)
  }

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Assignments</h1>
          <p className="text-muted-foreground">Manage volunteer assignments</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) resetForm()
        }}>
          <DialogTrigger asChild>
            <Button disabled={volunteers.length === 0 || departments.length === 0}>
              <Plus className="mr-2 h-4 w-4" />
              Create Assignment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>
                  {editingAssignment ? 'Edit Assignment' : 'Create New Assignment'}
                </DialogTitle>
                <DialogDescription>
                  {editingAssignment
                    ? 'Update the assignment details below.'
                    : 'Assign a volunteer to a department.'}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="volunteer">Volunteer *</Label>
                  <Select
                    value={formData.volunteerId}
                    onValueChange={(value) => setFormData({ ...formData, volunteerId: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a volunteer" />
                    </SelectTrigger>
                    <SelectContent>
                      {volunteers.map((volunteer) => (
                        <SelectItem key={volunteer.id} value={volunteer.id}>
                          {volunteer.firstName} {volunteer.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="department">Department *</Label>
                  <Select
                    value={formData.departmentId}
                    onValueChange={(value) => setFormData({ ...formData, departmentId: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((department) => (
                        <SelectItem key={department.id} value={department.id}>
                          {department.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role">Role</Label>
                  <Input
                    id="role"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="e.g., Team Lead, Assistant"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input
                    id="startTime"
                    type="datetime-local"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    id="endTime"
                    type="datetime-local"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Input
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Any additional information"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">
                  {editingAssignment ? 'Update' : 'Create'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {(volunteers.length === 0 || departments.length === 0) && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <p className="text-sm text-yellow-800">
              You need to add at least one volunteer and one department before creating assignments.
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Assignments</CardTitle>
          <CardDescription>
            {assignments.length} {assignments.length === 1 ? 'assignment' : 'assignments'} total
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : assignments.length === 0 ? (
            <div className="text-center py-8">
              <ClipboardList className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No assignments yet</p>
              <p className="text-sm text-muted-foreground">Get started by creating your first assignment</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Volunteer</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead className="hidden md:table-cell">Role</TableHead>
                    <TableHead className="hidden lg:table-cell">Start Time</TableHead>
                    <TableHead className="hidden lg:table-cell">End Time</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assignments.map((assignment) => (
                    <TableRow key={assignment.id}>
                      <TableCell className="font-medium">
                        {assignment.volunteer.firstName} {assignment.volunteer.lastName}
                      </TableCell>
                      <TableCell>{assignment.department.name}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {assignment.role || '-'}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {formatDateTime(assignment.startTime)}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {formatDateTime(assignment.endTime)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEdit(assignment)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDelete(assignment.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
