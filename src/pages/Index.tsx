
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { FileImage, ArrowRight, Info, Users, Shield, Upload } from 'lucide-react';
import LanguageSelector from '@/components/LanguageSelector';

const Index = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/30">
      <div className="absolute top-4 right-4">
        <LanguageSelector />
      </div>
      
      <div className="max-w-5xl w-full space-y-12">
        {/* Hero Section */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-6xl mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            {t('index.hero.title', 'WoundaShare')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('index.hero.subtitle', 'Securely share and track wound healing progress with healthcare professionals')}
          </p>
          
          <div className="mt-8 flex justify-center gap-4">
            <Button asChild size="lg">
              <Link to="/register">
                {t('auth.signup')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild size="lg">
              <Link to="/login">
                {t('auth.login')}
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Features Section */}
        <div>
          <h2 className="text-2xl font-bold text-center mb-8">
            {t('index.features.title', 'Key Features')}
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="mb-2 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Upload className="h-6 w-6" />
                </div>
                <CardTitle>{t('index.features.upload.title', 'Easy Uploads')}</CardTitle>
                <CardDescription>
                  {t('index.features.upload.description', 'Quickly upload images of wounds for assessment and tracking')}
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="mb-2 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Shield className="h-6 w-6" />
                </div>
                <CardTitle>{t('index.features.security.title', 'Secure Sharing')}</CardTitle>
                <CardDescription>
                  {t('index.features.security.description', 'Encrypted data transmission and storage for patient confidentiality')}
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="mb-2 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Users className="h-6 w-6" />
                </div>
                <CardTitle>{t('index.features.collaboration.title', 'Team Collaboration')}</CardTitle>
                <CardDescription>
                  {t('index.features.collaboration.description', 'Allow multiple healthcare professionals to review and comment')}
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
        
        {/* CTA Section */}
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="pt-6 pb-6 flex flex-col md:flex-row justify-between items-center">
            <div>
              <h3 className="text-xl font-bold mb-2">
                {t('index.cta.title', 'Ready to get started?')}
              </h3>
              <p>
                {t('index.cta.subtitle', 'Create your account now to begin documenting wound care')}
              </p>
            </div>
            <Button variant="secondary" className="mt-4 md:mt-0" asChild>
              <Link to="/register">
                {t('index.cta.button', 'Sign Up Now')}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
