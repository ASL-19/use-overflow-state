import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Testing Library only cleans up automatically with Vitest globals enabled
afterEach(() => {
  cleanup();
});
