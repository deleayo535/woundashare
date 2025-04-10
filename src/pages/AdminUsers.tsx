
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Filter, UserPlus, RefreshCcw, MoreVertical, Edit, Trash, UserCheck, UserX } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { toast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// User type definition
type UserRole = 'admin' | 'manager' | 'user';
type UserStatus = 'active' | 'inactive' | 'pending';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  dateJoined: string;
  lastActive: string;
  avatar?: string;
}

// Mock users data
const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'Demo Patient',
    email: 'user@example.com',
    role: 'user',
    status: 'active',
    dateJoined: '2023-01-15',
    lastActive: '2023-04-08'
  },
  {
    id: 'admin-1',
    name: 'Admin User',
    email: 'admin@woundashare.com',
    role: 'admin',
    status: 'active',
    dateJoined: '2022-10-01',
    lastActive: '2023-04-09'
  },
  {
    id: 'user-2',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    role: 'user',
    status: 'active',
    dateJoined: '2023-02-10',
    lastActive: '2023-04-05'
  },
  {
    id: 'user-3',
    name: 'Michael Chen',
    email: 'michael@example.com',
    role: 'manager',
    status: 'active',
    dateJoined: '2023-01-20',
    lastActive: '2023-04-07'
  },
  {
    id: 'user-4',
    name: 'Emily Davis',
    email: 'emily@example.com',
    role: 'user',
    status: 'inactive',
    dateJoined: '2023-03-05',
    lastActive: '2023-03-28'
  },
  {
    id: 'user-5',
    name: 'Robert Wilson',
    email: 'robert@example.com',
    role: 'user',
    status: 'pending',
    dateJoined: '2023-04-01',
    lastActive: '2023-04-01'
  },
];

// Fetch users from mock api
const fetchUsers = async (): Promise<User[]> => {
  // This would be an API call in a real application
  await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
  return mockUsers;
};

const AdminUsers: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<UserStatus | 'all'>('all');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');

  const { data: users, isLoading, isError, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  // Apply filters and search
  const filteredUsers = users?.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesStatus && matchesRole;
  }) || [];

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const handleRefresh = () => {
    refetch();
    toast({
      title: "Refreshing users",
      description: "User list has been refreshed",
    });
  };

  const getRoleColor = (role: UserRole) => {
    switch(role) {
      case 'admin': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'manager': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatusColor = (status: UserStatus) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'inactive': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const handleDeleteUser = (userId: string) => {
    toast({
      title: "User Deleted",
      description: `User ID ${userId} has been deleted`,
      variant: "destructive",
    });
  };

  const handleChangeStatus = (userId: string, newStatus: UserStatus) => {
    toast({
      title: "Status Updated",
      description: `User ID ${userId} status changed to ${newStatus}`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Manage Users</h1>
        <p className="text-muted-foreground mt-1">View and manage user accounts</p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                className="w-full pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-1">
                    <Filter className="h-4 w-4 mr-1" />
                    Filters
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setStatusFilter('all')}>All</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('active')}>Active</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('inactive')}>Inactive</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('pending')}>Pending</DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Filter by Role</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setRoleFilter('all')}>All</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setRoleFilter('admin')}>Admin</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setRoleFilter('manager')}>Manager</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setRoleFilter('user')}>User</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button variant="outline" onClick={handleRefresh}>
                <RefreshCcw className="h-4 w-4 mr-1" />
                Refresh
              </Button>

              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <UserPlus className="h-4 w-4 mr-1" />
                    Add User
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New User</DialogTitle>
                    <DialogDescription>
                      Create a new user account.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-1">
                        Full Name
                      </label>
                      <Input id="name" placeholder="Enter user's full name" />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-1">
                        Email
                      </label>
                      <Input id="email" type="email" placeholder="user@example.com" />
                    </div>
                    {/* Additional fields would go here */}
                  </div>
                  <DialogFooter>
                    <Button 
                      onClick={() => {
                        toast({ title: "User created", description: "New user has been created successfully" });
                      }}
                      type="submit"
                    >
                      Create User
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-pulse text-center">
                <div className="h-8 w-32 bg-gray-200 rounded-md mx-auto mb-4"></div>
                <div className="h-4 w-48 bg-gray-200 rounded-md mx-auto"></div>
              </div>
            </div>
          ) : isError ? (
            <div className="text-center py-8 text-red-500">
              <p>Error loading users. Please try again.</p>
              <Button variant="outline" onClick={() => refetch()} className="mt-2">
                Retry
              </Button>
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Last Active</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          No users found matching your criteria.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center space-x-3">
                              <Avatar>
                                <AvatarImage src={user.avatar} />
                                <AvatarFallback className="bg-primary text-primary-foreground">
                                  {getInitials(user.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{user.name}</div>
                                <div className="text-sm text-muted-foreground">{user.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getRoleColor(user.role)}>
                              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getStatusColor(user.status)}>
                              {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(user.dateJoined).toLocaleDateString()}</TableCell>
                          <TableCell>{new Date(user.lastActive).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem className="flex items-center">
                                  <Edit className="mr-2 h-4 w-4" /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  className="flex items-center text-blue-600"
                                  onClick={() => handleChangeStatus(user.id, 'active')}
                                >
                                  <UserCheck className="mr-2 h-4 w-4" /> Set Active
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="flex items-center text-amber-600"
                                  onClick={() => handleChangeStatus(user.id, 'inactive')}
                                >
                                  <UserX className="mr-2 h-4 w-4" /> Set Inactive
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  className="flex items-center text-red-600"
                                  onClick={() => handleDeleteUser(user.id)}
                                >
                                  <Trash className="mr-2 h-4 w-4" /> Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="mt-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious href="#" />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#" isActive>1</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">2</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">3</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext href="#" />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </>
          )}
        </CardContent>

        <CardFooter>
          <div className="text-sm text-muted-foreground">
            {filteredUsers.length} users {statusFilter !== 'all' ? `with ${statusFilter} status` : ''} 
            {roleFilter !== 'all' ? `${statusFilter !== 'all' ? ' and' : ' with'} ${roleFilter} role` : ''}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminUsers;
