import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { useState } from "react";
import { SplashScreen } from "./components/SplashScreen";
import { AdminPage } from "./pages/AdminPage";
import { HomePage } from "./pages/HomePage";
import { RedirectPage } from "./pages/RedirectPage";
import { ShortenPage } from "./pages/ShortenPage";

function RootLayout() {
  const [splashDone, setSplashDone] = useState(false);

  return (
    <>
      {!splashDone && <SplashScreen onComplete={() => setSplashDone(true)} />}
      <Outlet />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "oklch(0.14 0.02 270)",
            border: "1px solid oklch(0.78 0.18 75 / 0.3)",
            color: "oklch(0.93 0.02 85)",
          },
        }}
      />
    </>
  );
}

const rootRoute = createRootRoute({
  component: RootLayout,
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/panel",
  component: AdminPage,
});

const shortenRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/shorten",
  component: ShortenPage,
});

const redirectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/r/$code",
  component: RedirectPage,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  adminRoute,
  shortenRoute,
  redirectRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
