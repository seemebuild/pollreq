# PollReq MVP Plan

## 1. Problem

Small businesses and builders often make product or business decisions with limited customer input. Existing feedback tools can be too expensive, too complex, or too generic for fast-moving teams.

PollReq should make it easy to ask customers focused questions, collect answers quickly, and understand what to do next.

## 2. Vision

Build the easiest way for a small business or maker to collect customer sentiment and lightweight decision-driving feedback.

## 3. Primary Users

### Indie Builders

Need quick product validation, feature prioritization, and user sentiment.

### Shop Owners

Need feedback on products, pricing, service quality, and purchase experience.

### Small Business Operators

Need a simple way to ask questions after service delivery, events, or transactions.

## 4. User Jobs To Be Done

Users hire PollReq to:

- Ask customers a targeted question quickly
- Compare preferences between 2 or more choices
- Measure satisfaction over time
- Spot trends in open-ended feedback
- Make a confident decision without overcomplicated analytics

## 5. MVP Goals

The MVP should help a user:

- Create one or more polls
- Share polls using a public link
- Collect anonymous or identified responses
- View results in a dashboard
- Read basic summaries of open-text responses

## 6. Non-Goals For V1

Avoid these in the first release unless they become essential:

- Full survey builder with advanced logic
- Deep AI reporting workflows
- Complex team roles and permissions
- Payment and billing complexity beyond a basic plan gate
- CRM and e-commerce integrations

## 7. Recommended Product Decisions For V1

To launch faster, make these calls early:

- One workspace per account
- One question per poll
- Anonymous responses by default
- Optional respondent contact fields
- Web app first, mobile-ready backend from day one
- AI summaries postponed until after beta validation
- Test-driven development for core features from the first milestone

These decisions keep the product narrow, easier to explain, and much faster to ship.

## 8. Recommended MVP Features

### A. Authentication and Workspace Basics

- Sign up and sign in
- Create one workspace or business profile
- Basic account settings

### B. Poll Creation

- Create a poll with title and description
- Choose poll type:
  - Single-choice poll
  - Multiple-choice poll
  - Rating poll
  - Open feedback prompt
- Add answer options
- Set poll status: draft, live, closed

### C. Response Collection

- Public poll page
- Mobile-friendly response form
- No login required for respondents
- Optional respondent name, email, or order reference
- Confirmation screen after submission

### D. Results Dashboard

- Total responses
- Response breakdown by option
- Simple charts
- Recent submissions feed
- Export CSV

### E. Feedback Analysis

- Display open-ended responses
- Tag feedback by theme manually at first
- Optional simple AI summary later as a phase 2 enhancement

## 9. Best First Wedge

The strongest first wedge is:

`Create a poll in under 3 minutes, share it instantly, and get a clear summary of results.`

That value proposition is simple, believable, and easy to market.

## 10. Suggested User Flow

### Poll Creator Flow

1. User signs up
2. User creates workspace
3. User creates poll
4. User publishes poll
5. User copies public link
6. User shares link via WhatsApp, email, SMS, QR code, or social channels
7. User returns to dashboard to review results

### Respondent Flow

1. Customer opens public link
2. Customer answers poll in under 30 seconds
3. Customer optionally leaves extra comment
4. Customer submits response
5. Customer sees thank-you page

## 11. Core Screens

For the MVP, design these screens first:

- Landing page
- Sign up / sign in
- User dashboard
- Create poll screen
- Poll detail/results screen
- Public poll response page
- Account/settings page

## 12. Data Model Draft

### User

- id
- name
- email
- password_hash
- created_at

### Workspace

- id
- user_id
- business_name
- business_type
- created_at

### Poll

- id
- workspace_id
- title
- description
- type
- status
- slug
- created_at
- published_at

### PollOption

- id
- poll_id
- label
- position

### Response

- id
- poll_id
- respondent_name
- respondent_email
- respondent_reference
- rating_value
- comment
- submitted_at

### ResponseOption

- id
- response_id
- poll_option_id

## 13. Analytics For V1

Keep analytics simple and actionable:

- Number of responses per poll
- Percentage split by option
- Average rating for rating polls
- Recent response timeline
- Most common keywords in comments only if easy to ship

## 14. Web vs Mobile Recommendation

### Recommendation

Build the web app first, but structure the codebase as a monorepo so mobile can plug into the same backend cleanly.

### Reason

- Public link sharing is central to the product
- Faster to design, build, and launch
- Easier onboarding for business users
- Responsive web covers both desktop and phone usage early on
- Convex makes it practical to support both web and mobile from one backend

### Mobile Later

If traction appears, a mobile app can focus on:

- Push notifications for new responses
- Quick poll creation on the go
- Simplified dashboard viewing

## 15. Suggested MVP Stack

Recommended stack:

- Monorepo: Turbo
- Web app: Next.js
- Backend and realtime data layer: Convex
- Authentication: Better Auth for the initial Next.js MVP, with Convex Auth revisited later when its Next.js support is more mature
- Mobile app: add later in the same monorepo
- Charts: Recharts or Chart.js
- Hosting: Vercel for web, Convex for backend

This setup keeps the MVP fast to build while preserving a clean path to a mobile app.

## 16. Authentication Recommendation

As of April 14, 2026, the official Convex docs say Convex Auth exists, but it is still in beta and Next.js support is under active development.

For this project, the safest planning choice is:

- Use Better Auth for the initial Next.js web MVP
- Keep Convex as the application backend and source of business logic
- Keep the auth boundary clean so we can revisit Convex Auth later if it becomes a stronger fit

Why this recommendation:

- The web MVP is the first thing we need to ship
- Experimental auth infrastructure can slow down a TDD-first delivery pace
- We want stable auth flows before layering on mobile support

What to validate during implementation:

- Session handling between Next.js and Convex
- Protected access to workspace, poll, and analytics data
- Clean user provisioning or syncing into Convex domain models
- A path to support mobile later without rewriting the domain layer

## 17. Monorepo Architecture Recommendation

Suggested structure:

- `apps/web` for the Next.js app
- `apps/mobile` for the future mobile app
- `packages/ui` for shared UI components if needed later
- `packages/shared` for shared types, constants, and helpers
- `convex/` for schema, queries, mutations, actions, and auth configuration

### Why this structure works

- Web can launch first without blocking mobile
- Shared types reduce duplication across clients
- Convex functions stay centralized
- Future mobile work becomes an extension, not a rewrite

## 18. Testing and TDD Strategy

Testing should shape implementation, not trail behind it.

### Core TDD rule

For every important product flow, write a failing test first or at minimum in the same change before considering the feature complete.

### Priority test layers

- Unit tests for validation logic, formatting helpers, and domain rules
- Convex function tests for queries and mutations
- Integration tests for auth, poll creation, response submission, and dashboard reads
- End-to-end tests for the most important user journeys in the web app

### MVP-critical flows to cover first

- User can sign up and access a workspace
- Authenticated user can create a draft poll
- User can publish a poll and get a public link
- Respondent can submit a response successfully
- Poll results update correctly for the creator
- Unauthorized users cannot modify another workspace's data

### Practical test guidance

- Avoid overtesting cosmetic UI details early
- Focus first on business rules and user-critical workflows
- Add regression tests for every bug we fix
- Make tests part of the definition of done for each feature

## 19. Backend Responsibilities With Convex

Convex should own:

- Authentication and user identity flow
- Workspace, poll, and response data
- Poll publishing state
- Analytics queries
- Realtime dashboard updates if needed
- File or export support later if introduced

This keeps frontend apps focused on experience and presentation instead of duplicating backend logic.

## 20. Monetization Idea

Keep monetization simple early:

- Free plan with limited active polls or response cap
- Paid plan for higher response volume, exports, and richer analytics

Do not let billing delay launch.

## 21. Risks

### Risk 1: Too Broad

If the product tries to become a full survey suite too early, launch will slow down.

### Risk 2: Weak Differentiation

If it feels like a generic form tool, users may not care.

### Risk 3: Low Response Rates

Even good polls fail if sharing and completion are clunky.

### Risk 4: Premature Shared Abstractions

A monorepo helps long term, but overbuilding shared packages too early can slow the MVP down.

Start with only the shared code that clearly pays off.

### Risk 5: Weak Test Discipline Under Speed Pressure

If we say TDD matters but skip it once delivery pressure increases, quality and iteration speed will both suffer later.

The fix is to keep test coverage focused on the highest-value flows and require tests for completed features.

## 22. Differentiation Ideas

Possible ways to stand out after MVP:

- Poll templates for app builders and local businesses
- AI-generated summaries and recommended actions
- QR code mode for physical shops
- WhatsApp-first sharing
- Customer sentiment tracking over time

## 23. Launch Plan

### Phase 1: Planning

- Confirm scope
- Pick stack
- Lock the auth approach
- Sketch screens

### Phase 2: Build

- Turbo workspace setup
- Testing setup and CI baseline
- Better Auth setup for the web app
- Convex schema and core domain functions
- Next.js web app shell
- Workspace setup
- Poll CRUD
- Public response flow
- Basic analytics

### Phase 3: Beta

- Onboard 5 to 10 real users
- Watch how they create and share polls
- Measure response completion rates
- Collect feedback on confusing areas

### Phase 4: Iterate

- Improve analytics
- Add templates
- Add exports and simple AI summaries

## 24. MVP Acceptance Checklist

Before launch, confirm that:

- A new user can sign up successfully
- A poll can be created and published
- A public link works on mobile
- A respondent can submit without friction
- Results update correctly
- The creator can understand the result without help
- Core flows are covered by automated tests

## 25. Best Next Build Order

1. Turbo monorepo setup
2. Testing setup and first auth tests
3. Better Auth integration for the web app
4. Convex schema and core data functions
5. Next.js app shell and landing page
6. Create poll flow
7. Public poll page
8. Results dashboard
9. Export and polish

## 26. Open Product Questions

These are the decisions to settle next:

- Should the MVP allow only one workspace per account?
- Should respondents be fully anonymous by default?
- Should polls support one question only in V1?
- Should AI summaries wait until after beta feedback?
- Should the mobile app start with Expo when we are ready to add it?

## 27. Strong MVP Positioning

`PollReq helps small businesses and builders collect customer feedback fast, understand what matters, and make better decisions without enterprise survey complexity.`
