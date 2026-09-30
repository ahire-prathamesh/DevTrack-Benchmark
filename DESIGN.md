# Design System & UX Constitution

## 1. Purpose

Build interfaces that are professional, trustworthy, usable, accessible, responsive, maintainable, and appropriate for their users and domain.

Priorities:

- purpose over decoration
- clarity over trends
- usability over visual drama
- consistency over novelty
- information hierarchy over effects
- user outcomes over visual fashion

---

## 2. Understand Before Designing

Before designing or implementing UI, understand:

- product purpose
- users and roles
- primary and secondary tasks
- workflows
- permissions
- important information
- frequent actions
- dangerous actions
- decisions users make
- system states
- errors and recovery paths

Do not invent requirements, business rules, data, metrics, or workflows.

---

## 3. Information Architecture First

Establish before visual styling:

- navigation hierarchy
- page hierarchy
- content hierarchy
- task hierarchy
- action hierarchy
- information priority
- system states

Do not begin with colors, cards, gradients, animation, or visual effects.

---

## 4. Task Completion

Optimize for:

- findability
- readability
- predictability
- scanability
- efficiency
- error prevention
- recovery
- confidence
- consistency

Frequently performed tasks should require minimal unnecessary interaction.

Do not hide important functionality or add interaction merely for visual sophistication.

---

## 5. Information Density

Use density according to the task.

Operational and enterprise interfaces may require compact, information-rich layouts.

Dashboards, tables, monitoring systems, and administrative interfaces should prioritize useful information over excessive whitespace or decorative cards.

Do not force every piece of information into a card.

---

## 6. Visual Design

Use deliberate:

- visual hierarchy
- typography
- color
- spacing
- borders
- radius
- elevation
- iconography
- grid
- alignment

Visual choices must support comprehension and task completion.

Do not use fashionable visual patterns without product justification.

---

## 7. Design System

Use consistent project-level:

- color tokens
- semantic colors
- typography tokens
- spacing scale
- density rules
- component variants
- control sizes
- interaction states
- breakpoints
- motion rules

Prefer existing project components and tokens over creating new patterns.

Common quality rules must remain separate from project-specific visual language.

---

## 8. Components

Components must have a clear purpose.

Avoid unnecessary:

- cards
- pills
- badges
- shadows
- rounded containers
- decorative backgrounds
- visual effects

Reuse existing components when they satisfy the requirement.

---

## 9. Forms

Forms should provide:

- clear labels
- appropriate defaults
- logical grouping
- useful validation
- understandable errors
- clear required/optional states
- predictable submission behavior

Errors should explain what went wrong, where, and how to recover.

---

## 10. Tables & Data

For information-heavy applications, tables are often preferable to decorative cards.

Consider:

- column hierarchy
- sorting
- filtering
- search
- pagination
- sticky headers
- row actions
- status
- loading
- empty states
- errors
- bulk actions
- export
- responsive behavior
- readable density

Choose behavior based on actual user tasks.

---

## 11. Dashboards

A dashboard should help users understand:

- what is happening
- what changed
- what requires attention
- what is abnormal
- what action is required
- what can be investigated further

Do not add charts or KPI cards without a meaningful purpose.

---

## 12. Real-World States

Design explicitly for:

- first use
- returning users
- loading
- empty
- success
- warning
- error
- offline
- permission denied
- unauthorized
- expired session
- partial data
- failed API
- slow API
- long-running operation
- validation failure
- destructive action
- confirmation
- unsaved changes
- no results
- large datasets

---

## 13. Responsive Design

Responsive behavior must be intentional.

Consider:

- desktop
- laptop
- tablet
- mobile where applicable

Determine what should:

- remain visible
- collapse
- stack
- scroll
- become a drawer
- become an alternate action

Do not simply shrink desktop layouts.

---

## 14. Accessibility

Accessibility is a core requirement.

Consider:

- WCAG requirements
- contrast
- keyboard navigation
- visible focus
- semantic structure
- screen-reader behavior
- readable text
- touch targets
- error communication
- color independence
- zoom
- responsive behavior
- reduced motion

Do not rely on color alone to communicate meaning.

---

## 15. Motion

Motion must have a functional purpose.

Prefer motion that is:

- subtle
- predictable
- brief
- useful

Respect reduced-motion preferences.

Do not add animation merely because it looks impressive.

---

## 16. Enterprise & Domain UX

Design for the actual domain.

Consider:

- user expertise
- operational frequency
- information volume
- risk of mistakes
- permissions
- workflow complexity
- business terminology
- decision-making needs

Do not force consumer or marketing-site patterns onto enterprise applications.

---

## 17. Anti-Vibe-Code Review

Look for:

- generic SaaS layouts
- unnecessary gradients
- excessive cards
- excessive rounded corners
- glassmorphism without purpose
- decorative animation
- fake metrics
- fake content
- giant typography
- meaningless icons
- generic marketing copy
- repetitive layouts
- unnecessary pills
- unnecessary shadows
- decorative backgrounds

These are not automatically forbidden.

Ask:

1. Is the pattern present?
2. What purpose does it serve?
3. Is that purpose justified by the product?
4. Should it remain?

---

## 18. Design Review

A design review must evaluate:

- UX
- information architecture
- visual hierarchy
- interaction states
- content
- consistency
- accessibility
- responsive behavior
- error handling
- performance
- domain fit
- enterprise trust
- maintainability
- anti-vibe-code patterns

Do not conclude only with "looks good".

Provide concrete findings and evidence.

---

## 19. Human-Centered Design

Consider:

- first-time users
- experienced users
- users with different technical literacy
- accessibility needs
- high-frequency workflows
- error recovery
- real operational conditions

Optimize for successful task completion, not visual novelty.

---

## 20. Definition of Design Done

UI/UX is not complete until applicable requirements have been checked for:

- user/task fit
- information architecture
- visual hierarchy
- component consistency
- system states
- accessibility
- responsive behavior
- browser behavior
- content quality
- domain fit
- maintainability
- anti-vibe-code quality

Automated checks, AI review, and human judgment are complementary. None alone is sufficient.
