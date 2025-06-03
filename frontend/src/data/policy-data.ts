export const policyData = {
    "enterprise-001": {
      roles: {
        "tier0": {
          allow: [
            { app: "Spotify", action: "stream" },
            { app: "YouTube", action: "play" },
            { app: "Slack", action: "message" },
            { app: "Zoom", action: "call" }
          ],
          deny: []
        },
        "tier1": {
          allow: [
            { app: "Spotify", action: "stream" }
          ],
          deny: [
            { app: "YouTube", action: "play" }
          ]
        }
      }
    }
  };
  