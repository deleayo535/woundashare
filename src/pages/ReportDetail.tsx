
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Clock, CheckCircle, CalendarClock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { getReport } from '@/services/reportService';
import { useAuth } from '@/contexts/AuthContext';
import { Report } from '@/types';

const ReportDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchReport = async () => {
      if (id && user) {
        try {
          const data = await getReport(id);
          if (!data) {
            navigate('/my-reports', { replace: true });
            return;
          }
          
          // Check if report belongs to this user
          if (data.userId !== user.id) {
            navigate('/my-reports', { replace: true });
            return;
          }
          
          setReport(data);
        } catch (error) {
          console.error('Error fetching report:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchReport();
  }, [id, user, navigate]);
  
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64 bg-gray-200 rounded animate-pulse" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
            <div className="h-32 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }
  
  if (!report) return null;
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Report Details</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 glass-panel">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">{report.title}</CardTitle>
                <CardDescription>
                  Submitted on {new Date(report.createdAt).toLocaleDateString()}
                </CardDescription>
              </div>
              <Badge className="capitalize" variant={report.status === 'pending' ? 'secondary' : 'default'}>
                {report.status === 'pending' ? (
                  <><Clock className="mr-1 h-3 w-3" /> Awaiting Review</>
                ) : (
                  <><CheckCircle className="mr-1 h-3 w-3" /> Reviewed</>
                )}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="aspect-video rounded-md overflow-hidden bg-black">
              <img 
                src={report.imageUrl} 
                alt={report.title} 
                className="object-contain w-full h-full"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">Description</h3>
                <p className="text-muted-foreground whitespace-pre-line">
                  {report.description}
                </p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Wound Location</h3>
                  <p className="text-muted-foreground">{report.location}</p>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Pain Level</h3>
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="h-2.5 rounded-full bg-primary" 
                        style={{ width: `${report.painLevel * 10}%` }}
                      ></div>
                    </div>
                    <span className="ml-2 text-muted-foreground">
                      {report.painLevel}/10
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-6">
          {report.prescription ? (
            <Card className="neo-panel">
              <CardHeader>
                <CardTitle>Medical Assessment</CardTitle>
                <CardDescription>
                  Completed on {new Date(report.prescription.createdAt).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium">Diagnosis</h3>
                  <p className="mt-1">{report.prescription.diagnosis}</p>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-sm font-medium">Treatment Plan</h3>
                  <p className="mt-1 whitespace-pre-line">{report.prescription.treatment}</p>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-sm font-medium">Medications</h3>
                  <ul className="mt-2 space-y-2">
                    {report.prescription.medications.map((med, index) => (
                      <li key={index} className="bg-muted/50 p-2 rounded text-sm">
                        <div className="font-medium">{med.name}</div>
                        <div className="text-muted-foreground text-xs mt-1">
                          {med.dosage}, {med.frequency}, for {med.duration}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {report.prescription.followUpDate && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="text-sm font-medium flex items-center">
                        <CalendarClock className="mr-1 h-4 w-4" />
                        Follow-up Appointment
                      </h3>
                      <p className="mt-1 font-medium">
                        {new Date(report.prescription.followUpDate).toLocaleDateString()}
                      </p>
                    </div>
                  </>
                )}
                
                {report.prescription.doctorNotes && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="text-sm font-medium">Additional Notes</h3>
                      <p className="mt-1 text-muted-foreground text-sm whitespace-pre-line">
                        {report.prescription.doctorNotes}
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent className="text-center py-6">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Your report is currently being reviewed by our medical team.
                </p>
                <p className="text-muted-foreground text-sm mt-2">
                  You will be notified once a prescription is available.
                </p>
              </CardContent>
            </Card>
          )}
          
          <Button asChild variant="outline" className="w-full">
            <Link to="/my-reports">
              View All Reports
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReportDetail;
