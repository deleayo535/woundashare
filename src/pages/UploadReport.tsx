
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Upload, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
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
import { toast } from '@/components/ui/use-toast';
import { createReport, uploadImage } from '@/services/reportService';
import { useAuth } from '@/contexts/AuthContext';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const formSchema = z.object({
  title: z.string().min(5, { message: 'Title must be at least 5 characters' }),
  description: z.string().min(20, { message: 'Description must be at least 20 characters' }),
  location: z.string().min(3, { message: 'Please specify the location on your body' }),
  painLevel: z.number().min(0).max(10),
  image: z
    .instanceof(FileList)
    .refine((files) => files.length > 0, 'Please upload an image')
    .transform(files => files[0])
    .refine(
      (file) => file.size <= MAX_FILE_SIZE,
      `Max file size is 5MB`
    )
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      `Only .jpg, .jpeg, .png and .webp formats are supported`
    ),
});

type FormData = z.infer<typeof formSchema>;

const UploadReport: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      location: '',
      painLevel: 5,
    },
  });
  
  const handleImageChange = (files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      
      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: 'File too large',
          description: 'Please select an image under 5MB',
          variant: 'destructive',
        });
        return;
      }
      
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        toast({
          title: 'Invalid file type',
          description: 'Please select a valid image (JPG, PNG or WebP)',
          variant: 'destructive',
        });
        return;
      }
      
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      form.setValue('image', files, { shouldValidate: true });
    }
  };
  
  const onSubmit = async (data: FormData) => {
    if (!user) return;
    
    try {
      toast({
        title: 'Uploading report',
        description: 'Please wait while we process your report...',
      });
      
      // Upload image first
      const imageUrl = await uploadImage(data.image);
      
      // Create report
      const report = await createReport({
        userId: user.id,
        userName: user.name,
        title: data.title,
        description: data.description,
        imageUrl,
        location: data.location,
        painLevel: data.painLevel,
      });
      
      toast({
        title: 'Report submitted',
        description: 'Your wound report has been successfully submitted',
      });
      
      navigate(`/reports/${report.id}`);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit your report. Please try again.',
        variant: 'destructive',
      });
      console.error(error);
    }
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Upload Report</h1>
      </div>
      
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>New Wound Report</CardTitle>
          <CardDescription>
            Upload an image of your wound and provide details for medical assessment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Cut on left hand" {...field} />
                        </FormControl>
                        <FormDescription>
                          A brief title describing your injury
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe how you got injured and any symptoms you're experiencing..." 
                            className="min-h-[120px]" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Include how the injury occurred and any symptoms
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Body Location</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Right forearm, left ankle" {...field} />
                        </FormControl>
                        <FormDescription>
                          Where on your body is the wound located?
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="painLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pain Level (0-10)</FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            <Slider
                              min={0}
                              max={10}
                              step={1}
                              defaultValue={[field.value]}
                              onValueChange={(value) => field.onChange(value[0])}
                            />
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>No Pain (0)</span>
                              <span>Moderate (5)</span>
                              <span>Severe (10)</span>
                            </div>
                          </div>
                        </FormControl>
                        <FormDescription>
                          Current value: <strong>{field.value}</strong>
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div>
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field: { value, onChange, ...fieldProps } }) => (
                      <FormItem>
                        <FormLabel>Wound Image</FormLabel>
                        <FormControl>
                          <div className="space-y-4">
                            <div 
                              className={`image-upload-zone ${previewUrl ? 'border-primary' : ''}`}
                              onClick={() => document.getElementById('image-upload')?.click()}
                            >
                              {previewUrl ? (
                                <div className="relative aspect-square w-full max-w-md mx-auto overflow-hidden rounded-md">
                                  <img 
                                    src={previewUrl} 
                                    alt="Wound preview" 
                                    className="object-cover w-full h-full"
                                  />
                                </div>
                              ) : (
                                <div className="text-center cursor-pointer">
                                  <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                                  <p className="mt-2 text-sm font-medium">
                                    Click to upload an image
                                  </p>
                                  <p className="mt-1 text-xs text-muted-foreground">
                                    JPG, PNG or WebP (max. 5MB)
                                  </p>
                                </div>
                              )}
                              <input
                                id="image-upload"
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                className="sr-only"
                                onChange={(e) => handleImageChange(e.target.files)}
                                {...fieldProps}
                              />
                            </div>
                            
                            {previewUrl && (
                              <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => {
                                  setPreviewUrl(null);
                                  form.setValue('image', undefined as any, { shouldValidate: true });
                                }}
                                className="w-full"
                              >
                                Remove Image
                              </Button>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? 'Submitting...' : 'Submit Report'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadReport;
