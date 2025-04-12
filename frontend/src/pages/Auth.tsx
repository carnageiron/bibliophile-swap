
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

const Auth: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const tabParam = queryParams.get('tab');
  
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(
    tabParam === 'register' ? 'register' : 'login'
  );
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  
  const { login, register, isAuthenticated, error } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Update active tab when URL parameter changes
  useEffect(() => {
    if (tabParam === 'register') {
      setActiveTab('register');
    } else if (tabParam === 'login') {
      setActiveTab('login');
    }
  }, [tabParam]);
  
  // Redirect if user is already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
  
  // Update URL when tab changes
  const updateUrlWithTab = (tab: string) => {
    const newParams = new URLSearchParams(location.search);
    newParams.set('tab', tab);
    navigate({
      pathname: location.pathname,
      search: newParams.toString()
    }, { replace: true });
  };
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value as 'login' | 'register');
    updateUrlWithTab(value);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error for this field when user types
    if (formErrors[e.target.name]) {
      setFormErrors({
        ...formErrors,
        [e.target.name]: ''
      });
    }
    // Clear general error when user types
    if (generalError) setGeneralError(null);
  };
  
  const validateForm = () => {
    const errors: Record<string, string> = {};
    let isValid = true;
    
    // Common validations
    if (!formData.email) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
      isValid = false;
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
      isValid = false;
    }
    
    // Register-specific validations
    if (activeTab === 'register') {
      if (!formData.name) {
        errors.name = 'Name is required';
        isValid = false;
      }
      
      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
        isValid = false;
      }
    }
    
    setFormErrors(errors);
    return isValid;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setGeneralError(null);
    
    try {
      if (activeTab === 'login') {
        await login(formData.email, formData.password);
        toast({
          title: 'Login successful',
          description: 'Welcome back to Bibliophile Swap!'
        });
      } else {
        await register(formData.name, formData.email, formData.password);
        toast({
          title: 'Registration successful',
          description: 'Welcome to Bibliophile Swap!'
        });
      }
      navigate('/');
    } catch (err: any) {
      console.error('Auth error:', err);
      // Set general error message from the response or default message
      const errorMessage = err.response?.data?.message || 'An unexpected error occurred. Please try again.';
      setGeneralError(errorMessage);
      toast({
        title: activeTab === 'login' ? 'Login Failed' : 'Registration Failed',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="container max-w-md mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">Bibliophile Swap</CardTitle>
          <CardDescription className="text-center">
            {activeTab === 'login' ? 'Sign in to your account' : 'Create a new account'}
          </CardDescription>
        </CardHeader>
        
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          
          <CardContent className="pt-6">
            {generalError && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{generalError}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleSubmit}>
              <TabsContent value="register" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                    className={formErrors.name ? "border-destructive" : ""}
                  />
                  {formErrors.name && (
                    <p className="text-destructive text-sm">{formErrors.name}</p>
                  )}
                </div>
              </TabsContent>
              
              <div className="space-y-2 mt-4">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  className={formErrors.email ? "border-destructive" : ""}
                />
                {formErrors.email && (
                  <p className="text-destructive text-sm">{formErrors.email}</p>
                )}
              </div>
              
              <div className="space-y-2 mt-4">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className={formErrors.password ? "border-destructive" : ""}
                />
                {formErrors.password && (
                  <p className="text-destructive text-sm">{formErrors.password}</p>
                )}
              </div>
              
              <TabsContent value="register" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={formErrors.confirmPassword ? "border-destructive" : ""}
                  />
                  {formErrors.confirmPassword && (
                    <p className="text-destructive text-sm">{formErrors.confirmPassword}</p>
                  )}
                </div>
              </TabsContent>
              
              <Button 
                type="submit" 
                className="w-full mt-6"
                disabled={isLoading}
              >
                {isLoading 
                  ? 'Processing...' 
                  : activeTab === 'login' ? 'Sign In' : 'Sign Up'
                }
              </Button>
            </form>
          </CardContent>
        </Tabs>
        
        <CardFooter className="flex justify-center text-sm text-muted-foreground">
          {activeTab === 'login' 
            ? "Don't have an account? Register instead"
            : "Already have an account? Sign in instead"
          }
        </CardFooter>
      </Card>
    </div>
  );
};

export default Auth;
