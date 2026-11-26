# Reusable prompt: Customer support workflow application

```text
Create an original Angular customer-support workflow application with a polished, light, glossy dashboard style. Use this brief as inspiration for the general feel, but do not copy an existing product’s branding, exact layout, assets, or distinctive visual details.

DESIGN
- Use a soft, theme-tinted application background with subtle texture and glossy, readable cards.
- Include a fixed header and footer, plus a collapsible left navigation menu.
- Keep the header and footer stationary while the main content scrolls.
- Make the interface responsive and accessible, with clear focus states and reduced-motion support.
- Add a footer theme selector with three light palettes: Glacier, Mint, and Coral. Apply each palette consistently to the background, menu, header, footer, buttons, progress indicators, and status icons. Save the user’s choice locally.

SCREENS
Create a separate Angular component folder for each menu screen:
- Overview
- Workflows
- Sources
- Activity
- Current workflow
- History
- New workflow
- Team
- Settings

Keep the shared application shell in the root component. Put shared workflow and theme state in a service. Use Angular standalone components and a version compatible with the installed Node.js environment. Prefer local/system fonts so the app builds without network access.

WORKFLOW DETAILS
- Show a sample “Customer support escalation” run with a clear six-stage timeline, such as intake, information gathering, issue analysis, response drafting, quality check, and delivery.
- Let users expand each stage to see its actions, explanations, timestamps, and supporting references.
- Include a reference library that opens with a clear button and smoothly scrolls into view.
- Make completed, failed, and pending states visually distinct. Failed states should be red; steps after a failure should remain pending.
- Let users select a workflow template and subject on the New workflow screen.
- When a sample run starts, show it only under Current workflow. Animate a clear progress bar and advance through the steps at a visible interval. The sample run should complete successfully.
- Add a run to History only after it completes or fails. Let users expand a history row to inspect that run’s stages, steps, and references.
- Keep the live run indicator and percentage synchronized between the Current workflow screen and the Workflows menu.

Use realistic sample support-case content and references, such as a support playbook, case conversation, troubleshooting notes, and product status page. Label all simulated behavior as sample/demo behavior; do not imply that a real support system or backend is connected.

Before finishing, run the Angular production build and fix any errors. Report the project structure and how to start the app.
```
