"use client"

// React and Next.js imports
import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

// Custom hooks and context
import { useToast } from "@/hooks/use-toast" // Assuming this is a custom hook or from shadcn/ui
import { useAuth } from "@/components/auth-context"

// Define the validation schema for the login form using Zod
const formSchema = z.object({
  // Username can be either an email (admin) or matricule (student).
  // Minimum length validation is kept simple; backend handles specific format validation.
  username: z.string().min(1, { message: "Ce champ est requis." }),
  // Password requires a minimum length. Complex regex validation is avoided on the frontend.
  password: z.string().min(1, { // Consider increasing min length (e.g., min(8)) for security
    message: "Le mot de passe est requis.",
  }),
})

// Define TypeScript interfaces for expected API responses

// Structure for a successful login response
interface ApiLoginSuccessResponse {
  token: string;
  user: {
    id: string | number;
    role: 'student' | 'admin';
    name?: string;
    email?: string;
    matricule?: string;
  };
  message?: string; // Optional success message from backend
}

// Structure for an error response from the API
interface ApiErrorResponse {
  message?: string;
}

// Define the main Login Page component
export default function LoginPage() {
  const router = useRouter() // Hook for programmatic navigation
  const { toast } = useToast() // Hook to display toast notifications
  const { login } = useAuth(); // Hook to access the login function from AuthContext
  const [isLoading, setIsLoading] = useState(false) // State to manage loading status during API calls
  const [activeTab, setActiveTab] = useState<'etudiant' | 'admin'>('etudiant'); // State to track the active tab ('etudiant' or 'admin')
  const [formError, setFormError] = useState<string | null>(null); // State to store and display form-level errors (e.g., invalid credentials)

  // Initialize react-hook-form with the Zod schema resolver
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  // Helper function to determine the user role based on the currently active tab
  const getRoleFromTab = useCallback((tabValue: 'etudiant' | 'admin'): 'student' | 'admin' => {
    return tabValue === 'etudiant' ? 'student' : 'admin'
  }, []); // useCallback ensures the function identity is stable unless dependencies change (none here)

  // Handler for form submission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    // Clear any previous form errors when a new submission starts
    setFormError(null); // Clear previous form errors on new submission
    console.log("Login form submitted with values:", values);
    const role = getRoleFromTab(activeTab);
    console.log("Determined role:", role);

    // Construct payload based on the role
    const payload = {
      ...(role === 'student' ? { matricule: values.username } : { email: values.username }),
      password: values.password,
      role: role,
    };

    // API call to the login endpoint
    try {
      // Use environment variable for the API base URL
      const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/login`;
      console.log("Attempting to login via API:", apiUrl); // Avoid logging payload in production if it contains sensitive info
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      // Attempt to parse the JSON response body
      let data: ApiLoginSuccessResponse | ApiErrorResponse = {}; // Initialize with an empty object
      try {
        // Only attempt to parse if the response has content and indicates JSON
        if (response.headers.get("content-length") !== "0" && response.headers.get("content-type")?.includes("application/json")) {
          data = await response.json();
        }
      } catch (parseError) {
        console.error("Failed to parse JSON response:", parseError);
        // Keep data as an empty object, error will be handled by response.ok check
      }

      // Handle successful login (HTTP status 2xx)
      if (response.ok) {
        // Assert the type to ApiLoginSuccessResponse based on the successful status code
        const successData = data as ApiLoginSuccessResponse;

        // Update the authentication state using the context's login function
        login(successData.token, successData.user);

        // Show a success toast notification
        toast({
          title: "Connexion réussie",
          description: successData.message || `Bienvenue, ${successData.user.name || (role === 'student' ? 'Étudiant' : 'Administrateur')}!`,
        });

        // Redirect the user to their respective dashboard based on their role
        // Note: isLoading remains true until navigation completes or fails
        router.push(successData.user.role === 'student' ? '/etudiant' : '/admin');
      } else {
        // Handle API errors (HTTP status 4xx, 5xx)
        const errorData = data as ApiErrorResponse;
        // Extract a user-friendly error message from the API response or provide a default one
        const errorMessage = errorData?.message || "Une erreur s'est produite lors de la connexion. Veuillez vérifier vos identifiants et réessayer.";
        console.warn(`Login failed. Status: ${response.status}. Response data:`, data, "Error message:", errorMessage);
        setFormError(errorMessage); // Display the error message directly within the form
        // Optionally, show a destructive toast as well:
        //   variant: "destructive",
        //   title: "Erreur de connexion",
        //   description: errorMessage,
        // });
        setIsLoading(false); // Set loading to false only on API error
      }
    } catch (error) {
      // Handle network errors or issues during the fetch operation itself
      console.error("Login API call failed (network or parsing error):", error);
      const networkErrorMsg = "Impossible de se connecter au serveur. Veuillez réessayer.";
      setFormError(networkErrorMsg); // Show a generic error message in the form
      // Show a toast notification for network errors
      toast({
        variant: "destructive",
        title: "Erreur réseau",
        description: "Impossible de se connecter au serveur. Veuillez réessayer.",
      });
      setIsLoading(false); // Ensure loading state is reset on network/fetch errors
    } // No finally block needed as isLoading is managed in success/error paths
  }


  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center">
              {/* Simple University Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
              </svg>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Système de Gestion des Frais</CardTitle>
          <CardDescription>Connectez-vous pour accéder à votre compte</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="etudiant"
            className="w-full"
            value={activeTab} // Controlled component: value is driven by state
            // When the tab changes:
            // 1. Update the activeTab state.
            // 2. Clear any existing form-level errors.
            // 3. Reset the form fields to their default values.
            onValueChange={(value) => {
               setActiveTab(value as 'etudiant' | 'admin'); // Update state
               setFormError(null); // Clear errors
               form.reset(); // Reset form fields
            }}
          >
            <TabsList className="grid w-full grid-cols-2"> {/* Tab selection header */}
              <TabsTrigger value="etudiant">Étudiant</TabsTrigger>
              <TabsTrigger value="admin">Administrateur</TabsTrigger>
            </TabsList>

            <TabsContent value="etudiant">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  {/* Username Field (Matricule for Student) */}
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Matricule</FormLabel>
                        <FormControl>
                          <Input placeholder="UN21P039SJ" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Password Field */}
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mot de passe</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Submit Button */}
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Connexion en cours..." : "Se connecter"}
                  </Button>
                  {/* Display Form-Level Error Message */}
                  {formError && (
                    <p className="text-sm font-medium text-destructive text-center pt-2">
                      {formError}
                    </p>                  )}
                </form>
              </Form>
            </TabsContent>
            <TabsContent value="admin">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  {/* Username Field (Email for Admin) */}
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="admin@univ-catho-sjd.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Password Field */}
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mot de passe</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Submit Button */}
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Connexion en cours..." : "Se connecter"}
                  </Button>
                  {/* Display Form-Level Error Message */}
                  {formError && (
                    <p className="text-sm font-medium text-destructive text-center pt-2">
                      {formError}
                    </p>
                  )}
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}