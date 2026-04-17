import { anyApi } from "convex/server";
import type { FunctionReference } from "convex/server";

type WorkspaceApi = {
  workspaces: {
    getViewerWorkspace: FunctionReference<"query">;
    createWorkspace: FunctionReference<"mutation">;
  };
};

export const api = anyApi as unknown as WorkspaceApi;
