import React from "react";
import { render, RenderOptions } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// Mock Clerk provider for testing
const MockClerkProvider = ({ children }: { children: React.ReactNode }) => {
  // Mock the Clerk provider without actually initializing it
  return <div data-testid="mock-clerk-provider">{children}</div>;
};

// Create a custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return (
    <MockClerkProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </MockClerkProvider>
  );
};

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from "@testing-library/react";
export { customRender as render };
