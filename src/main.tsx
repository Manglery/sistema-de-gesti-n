import '@/lib/errorReporter';
import { enableMapSet } from "immer";
enableMapSet();
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import '@/index.css'
import { HomePage } from '@/pages/HomePage'
import { InventoryPage } from '@/pages/InventoryPage'
import { WarehousesPage } from '@/pages/WarehousesPage'
import { NewOrderPage } from '@/pages/NewOrderPage'
import { DispatchPage } from '@/pages/DispatchPage'
import { ReportsPage } from '@/pages/ReportsPage'
import { MovementsPage } from '@/pages/MovementsPage'
import { ReturnsPage } from '@/pages/ReturnsPage'
import { PurchasesPage } from '@/pages/PurchasesPage'
import { UsersPage } from '@/pages/UsersPage'
import { SupportPage } from '@/pages/SupportPage'
const queryClient = new QueryClient();
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/inventory",
    element: <InventoryPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/warehouses",
    element: <WarehousesPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/new",
    element: <NewOrderPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/dispatch",
    element: <DispatchPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/reports",
    element: <ReportsPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/movements",
    element: <MovementsPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/returns",
    element: <ReturnsPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/purchases",
    element: <PurchasesPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/users",
    element: <UsersPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/support",
    element: <SupportPage />,
    errorElement: <RouteErrorBoundary />,
  },
]);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <RouterProvider router={router} />
      </ErrorBoundary>
    </QueryClientProvider>
  </StrictMode>,
)