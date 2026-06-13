# PollReq Task List

This task list turns the current MVP plan into a practical execution backlog.

Priority guide:

- `P0` = critical for MVP foundation or launch
- `P1` = important for MVP completeness
- `P2` = useful after the core MVP is working

## P0

- [x] Set up the Turbo monorepo structure
- [x] Scaffold `apps/web` with Next.js
- [x] Add Convex to the monorepo and configure the backend workspace
- [x] Choose the initial authentication approach
- [x] Wire up the initial authentication approach
- [x] Set up the testing stack for TDD from day one
- [x] Add CI checks for linting, typechecking, and tests
- [x] Define the Convex schema for users, workspaces, polls, options, and responses
- [x] Implement auth-protected workspace access rules
- [x] Build the landing page shell
- [ ] Build sign up and sign in flows
- [x] Build workspace onboarding
- [x] Build the initial poll draft editor for one-question polls
- [x] Build poll creation for one-question polls with persistence
- [x] Support single-choice, multiple-choice, rating, and open feedback poll types in the draft editor
- [x] Build poll draft, publish, and close states
- [x] Generate public poll links
- [x] Build the public poll response page
- [ ] Allow anonymous responses by default
- [ ] Support optional respondent name, email, and reference fields
- [ ] Store responses in Convex
- [ ] Build the creator dashboard
- [x] Build the initial authenticated dashboard shell
- [ ] Show total responses, response breakdowns, and recent submissions
- [x] Add unit coverage for workspace onboarding and dashboard authorization states
- [ ] Add end-to-end coverage for sign in, poll creation, publishing, and response submission
- [x] Add unit tests for shared poll rules and the poll draft editor

## P1

- [ ] Add results charts for poll analytics
- [ ] Add poll detail/results view
- [ ] Add CSV export for poll responses
- [ ] Add account settings page
- [ ] Add basic business profile settings
- [x] Add validation and publish-readiness states for the initial poll editor
- [ ] Add validation and error states for all remaining core forms
- [ ] Add mobile-responsive polish to the public poll flow
- [ ] Add regression tests for all bugs fixed during MVP build
- [x] Extract shared types and helpers into `packages/shared`
- [ ] Add a starter shared UI package only if reuse becomes clear

## P2

- [ ] Add QR code sharing for public polls
- [ ] Add poll templates for builders and local businesses
- [ ] Add manual tagging for open-ended feedback themes
- [ ] Explore simple AI summaries after beta feedback
- [ ] Explore an `apps/mobile` client when the web MVP is stable
- [ ] Evaluate whether Convex Auth has matured enough to revisit later

## Suggested First Sequence

1. Complete the monorepo, auth, Convex, and testing foundation
2. Build and test the web auth and workspace setup flow
3. Build and test poll creation and publishing
4. Build and test the public response experience
5. Build and test the dashboard and analytics
