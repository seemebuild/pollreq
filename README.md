# PollReq

PollReq is a lightweight customer feedback platform for builders, shop owners, and small business operators who want fast, clear insight from the people they serve.

The goal is to launch an MVP quickly, help users collect feedback through simple polls and responses, and turn that feedback into decisions they can act on.

## Product Direction

PollReq helps small teams answer questions like:

- Which feature should we build next?
- Which product option do customers prefer?
- How satisfied are customers after a purchase or service?
- What themes keep showing up in customer feedback?

## MVP Focus

The first version should optimize for speed and usefulness:

- Create and share polls quickly
- Collect responses with almost no friction
- View clear summaries and trends
- Keep the product simple enough to launch fast and iterate
- Treat test-driven development as a core delivery practice

## Core Users

- Indie app builders
- Shop owners
- Small service businesses
- Early-stage startup teams

## Success Criteria

The MVP is successful if a user can:

1. Sign up and create a poll in minutes
2. Share a link with customers
3. Receive responses without customer login
4. See a simple dashboard of results
5. Use insights to decide what to improve next

## Planning Docs

- [MVP plan](./docs/mvp-plan.md)

## Suggested Build Strategy

Use a Turbo monorepo from day one, with Convex as the shared backend for both the web and mobile products.

Why:

- Shared backend logic across platforms
- Cleaner path to add mobile without re-architecting
- Easier code sharing for types, UI primitives, and product logic
- Better long-term fit for a web plus mobile product

## Engineering Principles

- Test-driven development is a major priority
- Write tests before or alongside production code for core product flows
- Protect critical paths with automated tests from the start
- Keep shared abstractions small until they are clearly needed

## Immediate Next Steps

1. Confirm the MVP scope in the planning doc
2. Scaffold the Turbo monorepo and Convex backend
3. Lock the auth approach for the web MVP
4. Design low-fidelity screens for the web MVP
5. Build authentication, polls, responses, and analytics with tests leading the work
