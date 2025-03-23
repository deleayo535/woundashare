
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { 
  ArrowLeft, 
  Clock, 
  CheckCircle, 
  Plus, 
  Trash,
  Calendar 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { getReport, addPrescription } from '@/services/reportService';
import { Report, Medication } from '@/types';

const medicationSchema = z.object({
  name: z.string().min(2, { message: 'Medication name is required' }),
  dosage: z.string().min(1, { message: 'Dosage is required' }),
  frequency: z.string().min(1, { message: 'Frequency is required' }),
  duration: z.string().min(1, { message: 'Duration is required' }),
});

const formSchema = z.object({
  diagnosis: z.string().min(10, { message: 'Diagnosis must be at least 10 characters' }),
  treatment: z.string().min(20, { message: 'Treatment must be at least 20 characters' }),
  medications: z.array(medicationSchema).min(1, { message: 'At least one medication is required' }),
  followUpDate: z.string().optional(),
  doctorNotes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const AdminReportDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      diagnosis: '',
      treatment: '',
      medications: [{ name: '', dosage: '', frequency: '', duration: '' }],
      followUpDate: '',
      doctorNotes: '',
    },
  });
  
  useEffect(() => {
    const fetchReport = async () => {
      if (id) {
        try {
          const data = await getReport(id);
          if (!data) {
            navigate('/admin', { replace: true });
            return;
          }
          
          setReport(data);
          
          // If report already has a prescription, pre-fill the form
          if (data.prescription) {
            form.reset({
              diagnosis: data.prescription.diagnosis,
              treatment: data.prescription.treatment,
              medications: data.prescription.medications,
              followUpDate: data.prescription.followUpDate ? 
                new Date(data.prescription.followUpDate).toISOString().split('T')[0] : '',
              doctorNotes: data.prescription.doctorNotes || '',
            });
          }
        } catch (error) {
          console.error('Error fetching report:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchReport();
  }, [id, navigate, form]);
  
  const addMedication = () => {
    const medications = form.getValues('medications');
    form.setValue('medications', [
      ...medications,
      { name: '', dosage: '', frequency: '', duration: '' }
    ]);
  };
  
  const removeMedication = (index: number) => {
    const medications = form.getValues('medications');
    if (medications.length <= 1) {
      toast({
        title: 'Cannot remove',
        description: 'At least one medication is required',
        variant: 'destructive',
      });
      return;
    }
    
    const updated = medications.filter((_, i) => i !== index);
    form.setValue('medications', updated);
  };
  
  const onSubmit = async (data: FormData) => {
    if (!report || !id) return;
    
    try {
      toast({
        title: 'Submitting prescription',
        description: 'Please wait...',
      });
      
      await addPrescription(id, {
        diagnosis: data.diagnosis,
        treatment: data.treatment,
        medications: data.medications,
        followUpDate: data.followUpDate ? new Date(data.followUpDate).toISOString() : undefined,
        doctorNotes: data.doctorNotes,
      });
      
      toast({
        title: 'Prescription submitted',
        description: 'The patient can now view their prescription',
      });
      
      navigate('/admin');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit prescription. Please try again.',
        variant: 'destructive',
      });
      console.error(error);
    }
  };
  
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
        <h1 className="text-2xl font-bold tracking-tight">Review Report</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">{report.title}</CardTitle>
                <CardDescription>
                  <span className="font-medium">Patient:</span> {report.userName} | 
                  <span className="ml-2">Submitted on {new Date(report.createdAt).toLocaleDateString()}</span>
                </CardDescription>
              </div>
              <Badge className="capitalize" variant={report.status === 'pending' ? 'secondary' : 'default'}>
                {report.status === 'pending' ? (
                  <><Clock className="mr-1 h-3 w-3" /> Pending</>
                ) : (
                  <><CheckCircle className="mr-1 h-3 w-3" /> Completed</>
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
        
        <Card>
          <CardHeader>
            <CardTitle>
              {report.prescription ? 'Edit Prescription' : 'Create Prescription'}
            </CardTitle>
            <CardDescription>
              {report.prescription 
                ? 'Update the prescription details for this patient' 
                : 'Provide medical assessment and recommendations'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="diagnosis"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Diagnosis</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Mild bacterial infection" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="treatment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Treatment Plan</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Detailed treatment instructions..." 
                          className="min-h-[100px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <FormLabel className="text-base">Medications</FormLabel>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={addMedication}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Medication
                    </Button>
                  </div>
                  
                  {form.formState.errors.medications?.message && (
                    <p className="text-sm font-medium text-destructive mt-1 mb-2">
                      {form.formState.errors.medications.message}
                    </p>
                  )}
                  
                  {form.getValues('medications').map((_, index) => (
                    <div key={index} className="p-3 border rounded-md mb-3">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">Medication #{index + 1}</h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMedication(index)}
                        >
                          <Trash className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <FormField
                          control={form.control}
                          name={`medications.${index}.name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs">Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Medication name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`medications.${index}.dosage`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs">Dosage</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. 500mg" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`medications.${index}.frequency`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs">Frequency</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. Twice daily" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`medications.${index}.duration`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs">Duration</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. 7 days" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                
                <Separator />
                
                <FormField
                  control={form.control}
                  name="followUpDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Follow-up Date (Optional)</FormLabel>
                      <div className="flex">
                        <div className="relative flex-1">
                          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <FormControl>
                            <Input 
                              type="date" 
                              className="pl-9" 
                              {...field} 
                            />
                          </FormControl>
                        </div>
                        {field.value && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="ml-2"
                            onClick={() => form.setValue('followUpDate', '')}
                          >
                            <Trash className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                      </div>
                      <FormDescription>
                        Recommended date for patient follow-up
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="doctorNotes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Notes (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Any additional notes for the patient..." 
                          className="min-h-[80px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        These notes will be visible to the patient
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? 'Submitting...' : 'Submit Prescription'}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminReportDetail;
