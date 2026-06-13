import { anyApi } from "convex/server";
import type { FunctionReference } from "convex/server";

type WorkspaceApi = {
  workspaces: {
    getViewerWorkspace: FunctionReference<"query">;
    createWorkspace: FunctionReference<"mutation">;
  };
  polls: {
    listWorkspacePolls: FunctionReference<"query">;
    getPublicPollBySlug: FunctionReference<"query">;
    createPollDraft: FunctionReference<"mutation">;
    publishPoll: FunctionReference<"mutation">;
    closePoll: FunctionReference<"mutation">;
  };
};

export const api = anyApi as unknown as WorkspaceApi;
