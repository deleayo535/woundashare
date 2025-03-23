
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { getUserReports } from '@/services/reportService';
import { useAuth } from '@/contexts/AuthContext';
import { Report } from '@/types';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [recentReports, setRecentReports] = useState<Report[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          const reports = await getUserReports(user.id);
          setRecentReports(reports.slice(0, 3));
          
          const pending = reports.filter(r => r.status === 'pending').length;
          const completed = reports.filter(r => r.status === 'completed').length;
          
          setStats({
            total: reports.length,
            pending,
            completed,
          });
        } catch (error) {
          console.error('Error fetching reports:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="space-y-4 w-full max-w-md">
          <div className="h-8 bg-gray-200 rounded animate-pulse" />
          <div className="h-32 bg-gray-200 rounded animate-pulse" />
          <div className="h-32 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name}
          </p>
        </div>
        <Button size="sm" asChild>
          <Link to="/upload-report">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Report
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="neo-panel">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{stats.total}</CardTitle>
            <CardDescription>Total Reports</CardDescription>
          </CardHeader>
        </Card>
        <Card className="neo-panel">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl flex items-center">
              {stats.pending}
              <Clock className="ml-2 h-5 w-5 text-amber-500" />
            </CardTitle>
            <CardDescription>Awaiting Review</CardDescription>
          </CardHeader>
        </Card>
        <Card className="neo-panel">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl flex items-center">
              {stats.completed}
              <CheckCircle className="ml-2 h-5 w-5 text-green-500" />
            </CardTitle>
            <CardDescription>Completed</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Reports</h2>
        {recentReports.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recentReports.map((report) => (
              <Card key={report.id} className="glass-panel overflow-hidden">
                <div className="relative h-40">
                  <img 
                    src={report.imageUrl}
                    alt={report.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      report.status === 'pending' 
                        ? 'bg-amber-100 text-amber-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {report.status === 'pending' ? 'Pending' : 'Completed'}
                    </span>
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg truncate">{report.title}</CardTitle>
                  <CardDescription>
                    {new Date(report.createdAt).toLocaleDateString()}
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
              <p className="text-muted-foreground mb-4">No reports found</p>
              <Button asChild>
                <Link to="/upload-report">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Upload Your First Report
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
        
        {recentReports.length > 0 && (
          <div className="flex justify-center mt-6">
            <Button variant="outline" asChild>
              <Link to="/my-reports">View All Reports</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
