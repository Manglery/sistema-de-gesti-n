import '@/lib/errorReporter';
import { enableMapSet } from "immer";
import React, { useEffect, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import { Toaster } from "@/components/ui/sonner";
import '@/index.css';
import { useAuthStore } from '@/store/use-auth-store';
import { useUserStore } from '@/store/use-user-store';
import { HomePage } from '@/pages/HomePage';
import { LoginPage } from '@/pages/LoginPage';
import { InventoryPage } from '@/pages/InventoryPage';
import { WarehousesPage } from '@/pages/WarehousesPage';
import { NewOrderPage } from '@/pages/NewOrderPage';
import { DispatchPage } from '@/pages/DispatchPage';
import { ReportsPage } from '@/pages/ReportsPage';
import { MovementsPage } from '@/pages/MovementsPage';
import { ReturnsPage } from '@/pages/ReturnsPage';
import { PurchasesPage } from '@/pages/PurchasesPage';
import { UsersPage } from '@/pages/UsersPage';
import { SupportPage } from '@/pages/SupportPage';
enableMapSet();
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
const router = createBrowserRouter([
  { 
    path: "/", 
    index: true, 
    element: <LoginPage />, 
    errorElement: <RouteErrorBoundary /> 
  },
  { path: "/login", element: <LoginPage />, errorElement: <RouteErrorBoundary /> },
  { path: "/new", element: <NewOrderPage />, errorElement: <RouteErrorBoundary /> },
  { path: "/dispatch", element: <DispatchPage />, errorElement: <RouteErrorBoundary /> },
  { path: "/inventory", element: <InventoryPage />, errorElement: <RouteErrorBoundary /> },
  { path: "/warehouses", element: <WarehousesPage />, errorElement: <RouteErrorBoundary /> },
  { path: "/reports", element: <ReportsPage />, errorElement: <RouteErrorBoundary /> },
  { path: "/movements", element: <MovementsPage />, errorElement: <RouteErrorBoundary /> },
  { path: "/returns", element: <ReturnsPage />, errorElement: <RouteErrorBoundary /> },
  { path: "/purchases", element: <PurchasesPage />, errorElement: <RouteErrorBoundary /> },
  { path: "/users", element: <UsersPage />, errorElement: <RouteErrorBoundary /> },
  { path: "/support", element: <SupportPage />, errorElement: <RouteErrorBoundary /> },
]);
function AuthGuard({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  
  if (!isAuthenticated) {
    // Store intended location for redirect after login
    if (window.location.pathname !== '/login') {
      localStorage.setItem('redirectAfterLogin', window.location.pathname);
    }
    // RouterProvider will handle redirect via index route
    return null;
  }

  return <>{children}</>;
}

function AppInitializer({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      {children}
    </AuthGuard>
  );
}
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <AppInitializer>
          <RouterProvider router={router} />
        </AppInitializer>
        <Toaster position="top-right" richColors closeButton />
      </ErrorBoundary>
    </QueryClientProvider>
  </StrictMode>,
);