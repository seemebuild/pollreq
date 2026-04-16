import { createAuth } from "../auth";

// Export a static auth instance for Better Auth schema generation only.
export const auth = createAuth({} as never);
