import { AuthConfig } from "convex/server";

export default {
  providers: [
    {
      domain: "https://equipped-stinkbug-37.clerk.accounts.dev",
      applicationID: "convex",
    },
  ],
} satisfies AuthConfig;
