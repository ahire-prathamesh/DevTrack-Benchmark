# Agent Operating Rules

## Authority

Follow this order when rules overlap:

1. `.specify/memory/constitution.md`
2. Spec Kit requirements/specifications
3. `DESIGN.md`
4. `AGENTS.md`
5. Relevant Agent Skills
6. Current task

Do not override higher-level rules.

## Before Implementation

- Understand the requirement and existing behavior before changing code.
- Do not invent requirements, business logic, data, metrics, or API behavior.
- Inspect relevant existing code before modifying it.
- Make the smallest appropriate change.
- Do not modify unrelated code.
- Do not add dependencies without clear justification.

## Design

- Follow `DESIGN.md`.
- Understand users, tasks, workflows, information architecture, and states before visual implementation.
- Reuse existing components and design tokens.
- Do not introduce decorative UI without a functional or product justification.
- Preserve accessibility and responsive behavior.

## Skills

Use a relevant Skill when the task requires specialized UI/UX, design-system, implementation, review, or accessibility work.

Do not invoke unnecessary Skills.

## MCP Usage

Use MCP tools only when they materially help the current task.

- GitHub: repository, issue, pull-request, and GitHub information.
- Playwright: browser workflows and automated E2E validation.
- Chrome DevTools: live browser inspection, debugging, and performance investigation.
- Serena: semantic repository/code navigation when materially useful.
- Context7: only when current or version-specific external library documentation is materially required.

Do not use Context7 or other MCPs when the required information is already available in the project context.

## Validation

Before considering work complete:

- Run relevant automated tests.
- Validate affected browser workflows with Playwright when applicable.
- Check accessibility when UI is affected.
- Review responsive behavior when UI is affected.
- Review AI-generated code before committing.
- Report verification evidence rather than only saying that the work looks good.

## Change Discipline

- Keep changes small, traceable, and reviewable.
- Preserve existing behavior unless the requirement explicitly changes it.
- Follow the project's Git and testing requirements.
- Never commit secrets or local credentials.

## Definition of Done

Work is complete only when the implementation, relevant tests, browser behavior, accessibility, and applicable design requirements have been verified.
