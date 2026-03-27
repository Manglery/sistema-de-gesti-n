import '@/lib/errorReporter';
import { enableMapSet } from "immer";
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import { Toaster } from "@/components/ui/sonner";
import '@/index.css';
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
    element: <HomePage />, 
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
function AppInitializer({ children }: { children: React.ReactNode }) {
  // Page protection is now handled within AppLayout via redirects
  return <>{children}</>;
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