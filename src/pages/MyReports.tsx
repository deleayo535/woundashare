
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  PlusCircle, 
  Clock, 
  CheckCircle,
  SortAsc,
  SortDesc,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { getUserReports } from '@/services/reportService';
import { useAuth } from '@/contexts/AuthContext';
import { Report } from '@/types';

type SortOrder = 'newest' | 'oldest';
type FilterStatus = 'all' | 'pending' | 'completed';

const MyReports: React.FC = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  
  useEffect(() => {
    const fetchReports = async () => {
      if (user) {
        try {
          const data = await getUserReports(user.id);
          setReports(data);
        } catch (error) {
          console.error('Error fetching reports:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchReports();
  }, [user]);
  
  const filteredAndSortedReports = React.useMemo(() => {
    // First filter by status
    let filtered = [...reports];
    if (statusFilter !== 'all') {
      filtered = filtered.filter(report => report.status === statusFilter);
    }
    
    // Then filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        report =>
          report.title.toLowerCase().includes(query) ||
          report.description.toLowerCase().includes(query) ||
          report.location.toLowerCase().includes(query)
      );
    }
    
    // Then sort
    return filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
  }, [reports, searchQuery, sortOrder, statusFilter]);
  
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse" />
        <div className="h-12 bg-gray-200 rounded w-full animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-64 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">My Reports</h1>
        <Button size="sm" asChild>
          <Link to="/upload-report">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Report
          </Link>
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search reports..."
            className="pl-9"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                {statusFilter === 'all' ? 'All Status' : 
                  statusFilter === 'pending' ? 'Pending' : 'Completed'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuRadioGroup value={statusFilter} onValueChange={(value) => setStatusFilter(value as FilterStatus)}>
                <DropdownMenuRadioItem value="all">All Status</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="pending">Pending Only</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="completed">Completed Only</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                {sortOrder === 'newest' ? (
                  <SortDesc className="mr-2 h-4 w-4" />
                ) : (
                  <SortAsc className="mr-2 h-4 w-4" />
                )}
                {sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuRadioGroup value={sortOrder} onValueChange={(value) => setSortOrder(value as SortOrder)}>
                <DropdownMenuRadioItem value="newest">Newest First</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="oldest">Oldest First</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {filteredAndSortedReports.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAndSortedReports.map((report) => (
            <Card key={report.id} className="glass-panel overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-40">
                <img 
                  src={report.imageUrl}
                  alt={report.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Badge variant={report.status === 'pending' ? 'secondary' : 'default'}>
                    {report.status === 'pending' ? (
                      <><Clock className="mr-1 h-3 w-3" /> Pending</>
                    ) : (
                      <><CheckCircle className="mr-1 h-3 w-3" /> Completed</>
                    )}
                  </Badge>
                </div>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg truncate">{report.title}</CardTitle>
                <CardDescription className="flex justify-between items-center">
                  <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                  <Badge variant="outline">{report.location}</Badge>
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {report.description}
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="secondary" size="sm" className="w-full" asChild>
                  <Link to={`/reports/${report.id}`}>
                    View Details
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-muted/50">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-1">No reports found</p>
            {searchQuery || statusFilter !== 'all' ? (
              <p className="text-sm text-muted-foreground mb-4">Try adjusting your search or filters</p>
            ) : (
              <p className="text-sm text-muted-foreground mb-4">You haven't submitted any reports yet</p>
            )}
            <Button asChild>
              <Link to="/upload-report">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create New Report
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MyReports;
