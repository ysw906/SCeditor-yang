import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Home from "./pages/Home";
import ProjectDetail from "./pages/ProjectDetail";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import Navbar from "./components/Navbar";

// Setup strict query client so uninitialized rows (404) fail fast to defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <Navbar />
        <main>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/project/:id" component={ProjectDetail} />
            <Route path="/login" component={Login} />
            <Route path="/admin" component={Admin} />
            <Route>
              <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground font-display">
                <h1 className="text-4xl md:text-6xl uppercase tracking-tighter mb-4">404 - Not Found</h1>
                <a href="/" className="font-sans text-sm font-semibold uppercase tracking-widest hover:opacity-50 transition-opacity underline underline-offset-4">
                  Return Home
                </a>
              </div>
            </Route>
          </Switch>
        </main>
      </WouterRouter>
    </QueryClientProvider>
  );
}
