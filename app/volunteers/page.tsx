'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { toast } from '@/components/ui/use-toast'
import { Plus, Pencil, Trash2, Users as UsersIcon } from 'lucide-react'

type Volunteer = {
  id: string
  firstName: string
  lastName: string
  email: string | null
  phone: string | null
  _count?: {
    assignments: number
  }
}

export default function VolunteersPage() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingVolunteer, setEditingVolunteer] = useState<Volunteer | null>(null)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  })

  useEffect(() => {
    fetchVolunteers()
  }, [])

  const fetchVolunteers = async () => {
    try {
      const response = await fetch('/api/volunteers')
      const data = await response.json()
      setVolunteers(data)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch volunteers',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingVolunteer) {
        const response = await fetch(`/api/volunteers/${editingVolunteer.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })

        if (response.ok) {
          toast({
            title: 'Success',
            description: 'Volunteer updated successfully',
          })
        }
      } else {
        const response = await fetch('/api/volunteers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })

        if (response.ok) {
          toast({
            title: 'Success',
            description: 'Volunteer added successfully',
          })
        }
      }

      setIsDialogOpen(false)
      setFormData({ firstName: '', lastName: '', email: '', phone: '' })
      setEditingVolunteer(null)
      fetchVolunteers()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save volunteer',
        variant: 'destructive',
      })
    }
  }

  const handleEdit = (volunteer: Volunteer) => {
    setEditingVolunteer(volunteer)
    setFormData({
      firstName: volunteer.firstName,
      lastName: volunteer.lastName,
      email: volunteer.email || '',
      phone: volunteer.phone || '',
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this volunteer?')) return

    try {
      const response = await fetch(`/api/volunteers/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Volunteer deleted successfully',
        })
        fetchVolunteers()
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete volunteer',
        variant: 'destructive',
      })
    }
  }

  const resetForm = () => {
    setFormData({ firstName: '', lastName: '', email: '', phone: '' })
    setEditingVolunteer(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Volunteers</h1>
          <p className="text-muted-foreground">Manage convention volunteers</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) resetForm()
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Volunteer
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>
                  {editingVolunteer ? 'Edit Volunteer' : 'Add New Volunteer'}
                </DialogTitle>
                <DialogDescription>
                  {editingVolunteer
                    ? 'Update the volunteer information below.'
                    : 'Add a new volunteer to the system.'}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="John"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="Smith"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john.smith@example.com"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">
                  {editingVolunteer ? 'Update' : 'Add'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Volunteers</CardTitle>
          <CardDescription>
            {volunteers.length} {volunteers.length === 1 ? 'volunteer' : 'volunteers'} total
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : volunteers.length === 0 ? (
            <div className="text-center py-8">
              <UsersIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No volunteers yet</p>
              <p className="text-sm text-muted-foreground">Get started by adding your first volunteer</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden md:table-cell">Email</TableHead>
                    <TableHead className="hidden lg:table-cell">Phone</TableHead>
                    <TableHead className="hidden sm:table-cell">Assignments</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {volunteers.map((volunteer) => (
                    <TableRow key={volunteer.id}>
                      <TableCell className="font-medium">
                        {volunteer.firstName} {volunteer.lastName}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {volunteer.email || '-'}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {volunteer.phone || '-'}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {volunteer._count?.assignments || 0}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEdit(volunteer)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDelete(volunteer.id)}
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
