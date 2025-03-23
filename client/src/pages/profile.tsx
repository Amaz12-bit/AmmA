import { useState } from "react";
import { useTranslation } from "@/i18n";
import { useAuth } from "@/hooks/use-auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Language } from "@/types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { AlertTriangle } from "lucide-react";

// Form schemas
const personalInfoSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phoneNumber: z.string().min(1, { message: "Phone number is required" }),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, { message: "Current password is required" }),
  newPassword: z.string().min(8, { message: "Password must be at least 8 characters" }),
  confirmPassword: z.string().min(8, { message: "Confirm password is required" }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const preferencesSchema = z.object({
  preferredLanguage: z.enum(["en", "sw"]),
});

type PersonalInfoValues = z.infer<typeof personalInfoSchema>;
type PasswordValues = z.infer<typeof passwordSchema>;
type PreferencesValues = z.infer<typeof preferencesSchema>;

const Profile = () => {
  const { t, language, changeLanguage } = useTranslation();
  const { user, loading, updateUser } = useAuth();
  const [isUpdatingInfo, setIsUpdatingInfo] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isUpdatingPreferences, setIsUpdatingPreferences] = useState(false);

  // Personal info form
  const personalInfoForm = useForm<PersonalInfoValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
    },
  });

  // Password form
  const passwordForm = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Preferences form
  const preferencesForm = useForm<PreferencesValues>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      preferredLanguage: (user?.preferredLanguage as Language) || language,
    },
  });

  // Update user profile
  const handleUpdateInfo = async (data: PersonalInfoValues) => {
    setIsUpdatingInfo(true);
    try {
      const success = await updateUser(data);
      if (success) {
        // Form values are automatically updated when user is updated
      }
    } finally {
      setIsUpdatingInfo(false);
    }
  };

  // Update password
  const handleUpdatePassword = async (data: PasswordValues) => {
    setIsUpdatingPassword(true);
    try {
      // This is just a placeholder, actual implementation would need to 
      // call an API endpoint to update the password
      console.log("Password update:", data);
      // Reset form after submission
      passwordForm.reset({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  // Update preferences
  const handleUpdatePreferences = async (data: PreferencesValues) => {
    setIsUpdatingPreferences(true);
    try {
      const success = await updateUser({
        preferredLanguage: data.preferredLanguage,
      });
      
      if (success) {
        // Update local language setting
        changeLanguage(data.preferredLanguage);
      }
    } finally {
      setIsUpdatingPreferences(false);
    }
  };

  // Update form values when user data changes
  if (user && !loading && user.firstName !== personalInfoForm.getValues().firstName) {
    personalInfoForm.reset({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
    });
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center mb-6">
          <Skeleton className="h-20 w-20 rounded-full" />
          <div className="ml-4">
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-32 mb-2" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-24" />
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Profile header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div className="flex items-center">
          <div className="relative group">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user?.profilePicture} />
              <AvatarFallback className="bg-primary text-white text-xl">
                {user ? getInitials(user.firstName, user.lastName) : ""}
              </AvatarFallback>
            </Avatar>
            <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition-opacity">
              <input 
                type="file" 
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const formData = new FormData();
                    formData.append('profilePicture', file);
                    await updateUser({ profilePicture: formData });
                  }
                }}
              />
              <span className="text-sm">Change</span>
            </label>
          </div>
          <div className="ml-4">
            <h1 className="text-2xl font-bold font-heading text-neutral-800">
              {user?.firstName} {user?.lastName}
            </h1>
            <p className="text-neutral-500">
              {user?.email}
            </p>
          </div>
        </div>
      </div>

      {/* Profile tabs */}
      <Tabs defaultValue="personal-info" className="space-y-6">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="personal-info">
            {t("profile.personalInformation")}
          </TabsTrigger>
          <TabsTrigger value="security">
            {t("profile.security")}
          </TabsTrigger>
          <TabsTrigger value="preferences">
            {t("profile.preferences")}
          </TabsTrigger>
        </TabsList>

        {/* Personal Information */}
        <TabsContent value="personal-info">
          <Card>
            <CardHeader>
              <CardTitle>{t("profile.personalInformation")}</CardTitle>
              <CardDescription>
                {t("profile.personalInfoDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...personalInfoForm}>
                <form 
                  onSubmit={personalInfoForm.handleSubmit(handleUpdateInfo)} 
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={personalInfoForm.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("profile.firstName")}</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              disabled={isUpdatingInfo}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={personalInfoForm.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("profile.lastName")}</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              disabled={isUpdatingInfo}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={personalInfoForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("profile.email")}</FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            {...field} 
                            disabled={isUpdatingInfo}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={personalInfoForm.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("profile.phoneNumber")}</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            disabled={isUpdatingInfo}
                          />
                        </FormControl>
                        <FormDescription>
                          {t("profile.phoneNumberDescription")}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-end">
                    <Button 
                      type="submit" 
                      disabled={isUpdatingInfo || !personalInfoForm.formState.isDirty}
                    >
                      {isUpdatingInfo ? t("common.saving") : t("common.save")}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>{t("profile.changePassword")}</CardTitle>
              <CardDescription>
                {t("profile.passwordDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...passwordForm}>
                <form 
                  onSubmit={passwordForm.handleSubmit(handleUpdatePassword)} 
                  className="space-y-6"
                >
                  <FormField
                    control={passwordForm.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("profile.currentPassword")}</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            {...field} 
                            disabled={isUpdatingPassword}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={passwordForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("profile.newPassword")}</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              {...field} 
                              disabled={isUpdatingPassword}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={passwordForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("profile.confirmPassword")}</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              {...field} 
                              disabled={isUpdatingPassword}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="bg-yellow-50 p-3 rounded-md border border-yellow-200 flex items-start space-x-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-yellow-700">
                      <p className="font-medium">{t("profile.passwordWarningTitle")}</p>
                      <p className="mt-1">{t("profile.passwordWarningDescription")}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      type="submit" 
                      disabled={isUpdatingPassword || !passwordForm.formState.isDirty}
                    >
                      {isUpdatingPassword ? t("common.updating") : t("profile.updatePassword")}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences */}
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>{t("profile.preferences")}</CardTitle>
              <CardDescription>
                {t("profile.preferencesDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...preferencesForm}>
                <form 
                  onSubmit={preferencesForm.handleSubmit(handleUpdatePreferences)} 
                  className="space-y-6"
                >
                  <FormField
                    control={preferencesForm.control}
                    name="preferredLanguage"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>{t("profile.language")}</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem 
                                value="en" 
                                id="lang-en" 
                                disabled={isUpdatingPreferences}
                              />
                              <Label htmlFor="lang-en">{t("profile.english")}</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem 
                                value="sw" 
                                id="lang-sw" 
                                disabled={isUpdatingPreferences}
                              />
                              <Label htmlFor="lang-sw">{t("profile.swahili")}</Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormDescription>
                          {t("profile.languageDescription")}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-end">
                    <Button 
                      type="submit" 
                      disabled={isUpdatingPreferences || !preferencesForm.formState.isDirty}
                    >
                      {isUpdatingPreferences ? t("common.saving") : t("common.saveChanges")}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
