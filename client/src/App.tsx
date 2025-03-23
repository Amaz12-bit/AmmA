import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Login from "@/pages/login";
import Register from "@/pages/register";
import Chamas from "@/pages/chamas";
import ChamaDetail from "@/pages/chama-detail";
import CreateChama from "@/pages/create-chama";
import Transactions from "@/pages/transactions";
import Investments from "@/pages/investments";
import Meetings from "@/pages/meetings";
import Profile from "@/pages/profile";
import AppLayout from "@/components/layout/AppLayout";
import { useAuth } from "@/hooks/use-auth";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

// Protected route component
const ProtectedRoute = ({ component: Component, ...rest }: any) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Skeleton className="w-full h-96" />;
  }

  if (!user) {
    return <Redirect to="/login" />;
  }

  return <Component {...rest} />;
};

function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/" component={() => <Redirect to="/dashboard" />} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      
      {/* Protected routes */}
      <Route path="/dashboard">
        <ProtectedRoute component={Dashboard} />
      </Route>
      <Route path="/chamas">
        <ProtectedRoute component={Chamas} />
      </Route>
      <Route path="/chamas/create">
        <ProtectedRoute component={CreateChama} />
      </Route>
      <Route path="/chamas/:id">
        {(params) => <ProtectedRoute component={ChamaDetail} id={params.id} />}
      </Route>
      <Route path="/transactions">
        <ProtectedRoute component={Transactions} />
      </Route>
      <Route path="/investments">
        <ProtectedRoute component={Investments} />
      </Route>
      <Route path="/meetings">
        <ProtectedRoute component={Meetings} />
      </Route>
      <Route path="/profile">
        <ProtectedRoute component={Profile} />
      </Route>
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppLayout>
        <Suspense fallback={<Skeleton className="w-full h-96" />}>
          <Router />
        </Suspense>
      </AppLayout>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
