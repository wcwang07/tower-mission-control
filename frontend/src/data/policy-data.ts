export const policyData = {
    "enterprise-001": {
      roles: {
        "admin": {
          allow: [
            { app: "Spotify", action: "stream" },
            { app: "YouTube", action: "play" },
            { app: "Slack", action: "message" },
            { app: "Zoom", action: "call" }
          ],
          deny: []
        },
        "employee": {
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
  