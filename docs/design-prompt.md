# MASTER PROMPT — DIKAOFC & DIKAGLORYA
## Autonomous Website Audit, Complete Redesign, macOS-Inspired UI/UX, Advanced Animation, Responsive Engineering & Production Validation

### ROLE AND MISSION

Act as a senior frontend engineer, UI/UX designer, creative director, motion designer, accessibility specialist, performance engineer, SEO engineer, and QA lead working together as one autonomous development team.

Your mission is to audit, improve, redesign, implement, and verify these two websites:

1. `https://dikaofc.devs.li`
2. `https://dikaglorya.github.io`

The objective is to transform both websites into distinctive, premium, visually memorable, highly animated, macOS-inspired developer experiences with exceptional Android usability and polished desktop presentation.

This is an implementation task, not a brainstorming exercise. Inspect the actual source code, identify the most important defects, make the changes, test the implementation, correct regressions, and report verifiable results.

Do not merely explain what should change. Implement the necessary changes in the available repositories.

Do not assume that either website requires a complete rewrite. Inspect the existing implementation, determine what is worth preserving, and redesign only as much as necessary to achieve the quality target.

If a repository is inaccessible or the source code is unavailable, clearly identify the blocker. Do not claim to have modified files, run tests, or deployed changes when those actions have not occurred.

---

# 1. CORE DESIGN VISION

Create two premium personal developer websites inspired by the design principles of modern macOS and Apple software interfaces.

The experience should combine:

- Refined macOS-inspired interface design.
- Original visual identity and memorable art direction.
- Exceptional Android-first responsive layouts.
- Beautiful desktop compositions.
- Fluid, coordinated animations throughout the experience.
- Meaningful interactive elements.
- Carefully implemented depth, lighting, transparency, and layering.
- Authentic projects and credible personal branding.
- Fast loading, accessible interactions, and reliable functionality.
- Production-quality implementation rather than screenshot-only polish.

The final product must feel thoughtfully designed, cohesive, sophisticated, modern, and professionally engineered.

Avoid generic AI-generated portfolio aesthetics, repetitive templates, meaningless gradients, excessive glassmorphism, random decorative elements, and unnecessary features.

Do not confuse visual complexity with quality. Every component, animation, interaction, and visual effect must contribute to usability, communication, brand identity, or genuine visual appeal.

The desired outcome is not simply a static website that resembles a Mac application. It is an original web experience that borrows the refinement, depth, responsiveness, and interaction quality associated with macOS while remaining appropriate for a developer portfolio.

---

# 2. AUTONOMOUS EXECUTION RULES

Work independently and make reasonable design and engineering decisions without repeatedly asking the user to approve routine implementation details.

Follow this workflow:

1. Discover and inspect the available repositories.
2. Understand the existing frameworks, dependencies, architecture, content, features, and deployment targets.
3. Audit the current design and record the most important defects.
4. Establish a prioritized implementation plan.
5. Implement the shared design foundations and website-specific improvements.
6. Add polished interactions and the complete animation system.
7. Validate Android and desktop behavior continuously.
8. Run builds, tests, accessibility checks, and performance measurements where tools are available.
9. Capture and compare screenshots of the real implementation.
10. Fix the highest-impact remaining defects.
11. Verify deployment when authorized and technically possible.
12. Deliver a factual summary of changes, test results, and unresolved problems.

Do not spend the task endlessly planning, writing additional specifications, or generating redundant recommendations.

Once sufficient information is available, start implementing.

Maintain a concise internal checklist of completed, pending, blocked, and verified work. Prioritize finishing important existing tasks over introducing additional features.

Never stop at the first attractive screenshot. Review every important section, the complete page, mobile interactions, desktop interactions, and the actual production build.

## Repository and tool constraints

- Inspect the real working directory before making changes.
- Identify the correct source repository for each domain.
- Never confuse the two websites or unintentionally overwrite one with the other.
- Preserve user changes, uncommitted work, configuration, and working features.
- Do not run destructive Git operations or overwrite unrelated files.
- Never expose credentials, environment secrets, tokens, or private configuration.
- Use tools and capabilities that actually exist in the environment.
- Never fabricate subagent availability, browser access, device testing, deployment access, or test results.

### Parallel subagents

Use parallel agents when the environment genuinely supports them.

Suitable responsibilities include:
- Visual audit and creative direction.
- Android responsive engineering.
- Desktop layout engineering.
- Animation and interaction design.
- Accessibility and semantic HTML.
- Performance analysis.
- SEO and deployment configuration.
- Automated testing and visual regression review.

Use separate agents for tasks that can be completed independently. Give each agent a defined scope, clear output requirements, and explicit file ownership where necessary.

Review their changes before integration. Avoid conflicting edits, duplicated implementations, redundant dependencies, and uncontrolled spawning.

Use as many agents as technically available and beneficial, potentially 10–20 when the environment supports that scale. Do not spawn agents merely to maximize their number. If parallel agents are unavailable, perform the work sequentially.

---

# 3. INITIAL RECONNAISSANCE AND DESIGN AUDIT

Before changing the interface, inspect both existing websites and their actual codebases.

Investigate:

- Framework, build system, routing, and package manager.
- Existing component architecture and styling approach.
- Current brand identity, content, projects, and navigation.
- Installed animation libraries and existing motion conventions.
- Fonts, images, icons, and other assets.
- Theme support and responsive breakpoints.
- Existing bugs, console errors, and failed network requests.
- Accessibility and keyboard-navigation problems.
- SEO metadata, social previews, canonical URLs, and favicons.
- Hosting requirements, build commands, and deployment workflow.
- Existing tests and performance constraints.

If browser access is available, inspect both public websites at multiple viewport sizes. Compare the rendered interfaces with the implementation whenever possible.

Evaluate the following visual dimensions:

**Header and navigation**
- Height, positioning, alignment, density, spacing, and responsive behavior.
- Typography, visual hierarchy, active states, and interaction feedback.
- Mobile menu design and touch accessibility.
- Sticky positioning and potential collisions.

**Hero**
- Headline scale and line wrapping.
- Supporting text and visual composition.
- CTA placement, dimensions, labels, and hierarchy.
- Image cropping, decorative elements, and available viewport space.
- The relationship between branding and technical identity.

**Content sections**
- Vertical rhythm and consistent container widths.
- Heading hierarchy and paragraph readability.
- Project cards, images, buttons, grids, and supporting information.
- Repeated content patterns and unnecessary sections.
- Alignment, negative space, and visual balance.

**Footer**
- Navigation, social profiles, contact actions, and useful information.
- Responsive arrangement, spacing, and readability.

**Technical quality**
- Layout shifts, overflowing content, missing assets, broken links, inconsistent component behavior, and unnecessary complexity.

Identify the root causes rather than treating every symptom as an isolated CSS problem.

Determine whether individual components can be improved or whether larger portions of the layout genuinely need redesigning.

Preserve existing content and functionality unless an explicit defect or strong design justification requires a change.

---

# 4. DISTINCT BRAND IDENTITIES

Both websites must feel like members of the same design family without becoming duplicate portfolios.

## Shared design principles

Use a consistent foundation for:

- Typography.
- Spacing.
- Border and radius conventions.
- Animation timing.
- Interaction feedback.
- Accessibility.
- Responsive behavior.
- General quality standards.

## Individual identity

Evaluate each website independently.

Preserve its authentic content, domain identity, intended audience, best existing features, and established strengths.

Where relevant to the existing content, maintain the connection to DikaOfc, DikaGlorya, and ObitoGlorya. Do not invent unsupported achievements, project histories, technical credentials, or brand relationships.

Give each website its own:
- Hero composition.
- Content emphasis.
- Featured projects.
- Visual storytelling.
- Supporting graphic motifs.
- Appropriate page metadata.
- Distinctive interaction details.

Shared components are encouraged where they improve consistency, but both sites must not look like copies with only the name changed.

Do not fabricate content to make the pages appear more impressive.

---

# 5. PREMIUM macOS-INSPIRED DESIGN SYSTEM

Build an intentional, reusable design system inspired by modern macOS interface principles.

## Visual language

Use restrained combinations of:

- Native-looking typography.
- Refined borders.
- Soft, controlled shadows.
- Translucent surfaces.
- Layered panels.
- Rounded corners.
- Subtle ambient lighting.
- Clear spacing and alignment.
- Carefully controlled color contrast.
- Elegant active, hover, focus, and pressed states.

Use system font stacks where appropriate:

`-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`

Prefer existing or legitimately available fonts when there is a clear benefit. Never assume that an Apple proprietary font is installed on every device.

Use a restrained palette. A monochrome or neutral foundation with a small, intentional accent palette is preferable to excessive gradients, neon colors, or arbitrary color changes.

Do not copy Apple branding or imply official Apple affiliation. Recreate general design principles rather than relying on proprietary assets.

## Design tokens

Create centralized tokens for:

- Primary and secondary colors.
- Backgrounds and surfaces.
- Primary, secondary, and muted text.
- Accent colors.
- Typography sizes and line heights.
- Font weights and letter spacing.
- Container widths.
- Spacing scale.
- Border widths and colors.
- Border radii.
- Shadow levels.
- Blur levels.
- Animation durations and easing.
- Focus rings.
- Breakpoints and layout constraints where appropriate.

Example typography and sizing approach:

- Use `clamp()` for fluid headings.
- Establish readable body-text sizes.
- Set explicit image aspect ratios where appropriate.
- Use consistent button heights and touch targets.
- Use content-driven widths instead of arbitrary fixed pixel dimensions.

Do not blindly apply the same dimensions everywhere. Components should share a system while respecting their roles.

## Surface design

Glassmorphism may be used for selected elements such as navigation surfaces, command palettes, overlays, or floating panels.

Do not cover every section with translucent glass.

Provide suitable fallbacks when `backdrop-filter` is unavailable. Keep text readable over every background.

Avoid oversized shadows, excessive blur, unnecessary borders, and decorative window controls that serve no function.

---

# 6. RESPONSIVE DESIGN: ANDROID FIRST, DESKTOP SECOND

Responsive design is a primary acceptance requirement.

Android and desktop must be treated as first-class experiences, not one layout and its compressed copy.

The implementation must adapt through fluid layouts, responsive content ordering, appropriate typography, and interaction changes.

## A. Android mobile priority

Design and test first for narrow Android screens.

Target at least:

- 320px.
- 360px.
- 375px.
- 390px.
- 414px.
- 430px.
- 480px.

Use the actual content and viewport to determine appropriate breakpoints.

### Navigation

- Create a compact, polished mobile navbar.
- Implement a functional menu when the navigation cannot comfortably fit.
- Ensure the menu opens and closes reliably.
- Prevent accidental page scrolling or content overlap while the menu is open.
- Provide proper keyboard and screen-reader behavior.
- Add suitable backdrop and close interactions where appropriate.
- Do not make essential navigation available only through hover.

### Hero

- Arrange content in a deliberate mobile composition.
- Keep the primary heading readable and prevent awkward wrapping.
- Avoid forcing the entire hero into a fixed height.
- Prevent decorative graphics from covering text or CTA buttons.
- Keep useful content visible without excessive empty space.
- Avoid a giant introductory animation that pushes projects far down the page.
- Optimize image positioning and cropping for narrow screens.

### Cards and sections

- Stack cards and columns appropriately.
- Prevent horizontal scrolling except where a deliberately designed, accessible horizontal component is justified.
- Make project details easy to read.
- Avoid tiny buttons, crowded cards, oversized images, and inconsistent spacing.
- Preserve a clear visual hierarchy.
- Ensure forms and inputs fit the usable viewport.

### Touch interactions

- Target approximately 44–48 CSS pixels for important touch controls where practical.
- Provide sufficient spacing between adjacent targets.
- Ensure buttons give immediate pressed feedback.
- Avoid relying on hover.
- Keep scrolling natural.
- Avoid cursor-following interactions on touch devices.
- Avoid scroll-jacking and interactions that interfere with native browser gestures.

### Android browser behavior

Account for:
- Browser address-bar expansion and contraction.
- Dynamic viewport heights.
- Safe-area insets when applicable.
- Virtual keyboards.
- Portrait and landscape orientations.
- Text enlargement and browser zoom.
- Slower connections and constrained hardware.
- Memory pressure and battery consumption.

Use `100dvh` when appropriate, with appropriate fallback behavior if required.

Use safe-area CSS variables when the design genuinely needs them. Do not add arbitrary offsets that create new layout problems.

Test forms, dialogs, menus, and fixed elements while the virtual keyboard is visible.

### Performance on Android

- Limit expensive blur and backdrop effects.
- Reduce decorative particle counts.
- Avoid unnecessary continuous animations.
- Lazy-load noncritical assets.
- Optimize image sizes and font requests.
- Avoid excessive JavaScript execution during scrolling.
- Preserve responsive touch feedback.
- Keep the page usable without advanced graphics.

Where real mid-range device testing is unavailable, use browser performance tools and record the limitation honestly.

## B. Desktop priority

Target at least:

- 768px.
- 1024px.
- 1280px.
- 1440px.
- 1920px.
- 2560px.

### Desktop layout

- Use centered, responsive containers with controlled maximum widths.
- Prevent excessively stretched content.
- Use intentional multi-column layouts and asymmetric compositions where appropriate.
- Preserve readable text lengths.
- Keep section spacing consistent.
- Prevent cards and images from becoming excessively large.
- Avoid vast empty spaces that make the page feel unfinished.
- Ensure wide screens receive a genuinely considered composition.

### Desktop interactions

- Add refined hover and pointer interactions where useful.
- Support mouse, keyboard, and trackpad usage.
- Provide visible focus indicators.
- Keep click targets predictable.
- Avoid globally replacing the native cursor.
- Ensure modals and panels do not overflow short browser windows.

## C. Responsive engineering standards

Use mobile-first CSS with appropriate use of:

- CSS Grid.
- Flexbox.
- `min()`, `max()`, and `clamp()`.
- Content-driven breakpoints.
- Fluid media.
- `min-width: 0` where grid or flex children require it.
- Appropriate `max-width`.
- Container queries when they offer a clear advantage.

Avoid rigid widths, excessive device-specific overrides, duplicated media-query logic, and unexplained magic numbers.

Test actual rendering and correct reproducible defects.

Do not declare responsiveness complete merely because the main hero fits one mobile screenshot.

---

# 7. COMPLETE VISUAL REDESIGN

Audit and improve every major section on both websites.

## Header and navbar

- Improve spacing, positioning, typography, contrast, and hierarchy.
- Make navigation elements visually balanced.
- Add refined active and hover states.
- Support sticky behavior where it improves navigation.
- Ensure sticky elements do not obscure focused controls or anchor targets.
- Implement the responsive menu and test all states.

## Hero section

Make the hero an immediate and memorable introduction to the developer.

- Communicate identity, expertise, and primary focus.
- Establish a strong visual headline.
- Provide concise supporting content.
- Make the main CTA obvious.
- Use authentic visuals and meaningful graphic details.
- Introduce carefully choreographed animation.
- Ensure the hero remains effective on narrow mobile screens.
- Avoid using oversized empty space simply to appear cinematic.

## Projects

Create premium project presentations with:

- Meaningful titles.
- Concise descriptions.
- Real technology information.
- Authentic screenshots or appropriate visual assets.
- Working repository links.
- Working live-demo links where available.
- Clear project status when relevant.
- Useful hover, focus, touch, and reveal animations.

Use varied visual compositions when the content justifies them. Do not make every project card identical if distinct presentation improves comprehension.

Never invent projects, fake metrics, fake customers, fake testimonials, or fabricated project outcomes.

## Skills and technical information

Present actual technologies and experience clearly.

Avoid arbitrary percentage bars or unsupported expertise scores.

Use structured lists, categorized technology collections, project-linked expertise, or other honest representations.

## About and storytelling sections

Communicate the developer's identity in a clear, credible, memorable way.

Use editorial typography, deliberate whitespace, and restrained visual accents.

Keep sections concise and purposeful. Remove duplication and empty marketing language.

## Contact and social links

- Verify all actual destinations.
- Provide clear contact actions.
- Keep links understandable.
- Provide feedback for copy actions.
- Prevent buttons from pretending to work when they do not.
- Preserve appropriate user privacy.

## Footer

Use a visually coherent ending that includes useful navigation and contact information where appropriate.

Ensure the footer remains balanced and readable across viewport sizes.

---

# 8. FULL-SITE ANIMATION AND MOTION SYSTEM

Create a coherent animation system for the entire experience.

The website must not feel static, but not every element should move continuously.

Motion should communicate hierarchy, causality, state, depth, and interaction.

The goal is sophisticated, coordinated animation inspired by polished desktop software, modern interactive portfolios, and high-quality motion design.

## A. Motion architecture

First inspect the existing framework and animation dependencies.

Use the existing animation tools when appropriate. Do not introduce several competing animation libraries.

Prefer:
- CSS transitions for straightforward state changes.
- CSS keyframes for simple, self-contained motion.
- The existing animation library for complex sequences.
- Intersection Observer for viewport-triggered effects when appropriate.
- The Web Animations API when it provides a clear advantage.

Use additional libraries only when the visual or technical benefits justify their bundle size, complexity, and maintenance burden.

Define reusable motion tokens:

- Fast interaction feedback.
- Standard transitions.
- Panel entrance and exit.
- Stagger intervals.
- Section reveal timing.
- Reduced-motion alternatives.
- Consistent easing curves.

Keep durations short for direct interactions and use longer timing only where deliberate cinematic pacing genuinely adds value.

Avoid building a large motion system with duplicated, inconsistent per-component settings.

## B. Initial page entrance

Create polished entrance sequences for:

- Navigation.
- Hero text.
- Supporting text.
- CTA buttons.
- Main visual elements.
- Important decorative accents.

Use controlled opacity transitions, transforms, clip-path reveals, line-based heading animation, or staggered content entrances where appropriate.

Keep the primary message visible quickly.

Never force users to wait through a long introduction before interacting.

Avoid fake boot sequences, pointless splash screens, long loading gates, and decorative progress bars that misrepresent real activity.

Prevent layout shifts during animations.

## C. Typography animation

Use tasteful text reveals where they improve the hero or section presentation.

Possible effects include:

- Line-by-line heading reveals.
- Word-level stagger.
- Masked line transitions.
- Subtle letter-spacing transitions.
- Animated accent words.
- Controlled section-title entrances.

Preserve semantic text in the document.

Ensure text remains readable by assistive technology and does not disappear permanently if JavaScript fails.

Do not animate every paragraph character by character.

## D. Scroll-triggered motion

Use section reveals to establish visual rhythm.

Potential effects:
- Fades.
- Subtle vertical or horizontal transforms.
- Staggered card entrances.
- Image reveals.
- Decorative line growth.
- Section-divider transitions.
- Carefully restrained parallax.

Use viewport thresholds and one-time reveals where appropriate.

Avoid replaying expensive effects repeatedly during scrolling.

Do not hide essential content behind an animation that might never run.

Avoid scroll-jacking and forced scroll timing.

Keep normal browser scrolling intact.

## E. macOS-inspired interface transitions

Create refined motion for useful elements such as:

- Navigation surfaces.
- Dropdowns and popovers.
- Dialogs and project details.
- Theme switching.
- Segmented controls.
- Mobile menus.
- Floating tooltips.
- Command palette.
- Interactive card surfaces.

Use scale, opacity, transforms, and carefully chosen easing.

Where technically appropriate, use shared-element transitions for moving between related visual elements.

Avoid flashing, sudden resizing, flicker, or positioning errors.

## F. Button micro-interactions

Add deliberate feedback for interactive controls.

**Hover**
- Subtle color changes.
- Border or shadow transitions.
- Slight elevation.
- Minimal scale changes.

**Press**
- Immediate visual response.
- Small, controlled transform changes.
- Clear active state.

**Focus**
- Strong, visible keyboard focus.
- Consistent outlines or focus rings.
- Sufficient contrast.

**Success and error**
- Feedback for copying, submitting, switching settings, and other real actions.
- Clear confirmation and error states.
- No false success messages.

Do not add magnetic effects to every button.

Only use magnetic or pointer-following effects when they improve the desktop experience and do not interfere with the controls.

## G. Project-card animation

Use refined transitions for:
- Image scaling.
- Card elevation.
- Border changes.
- Image masks.
- Overlay content.
- Technology labels.
- Project-detail previews.

Keep the text readable throughout.

Use pointer-specific effects only when appropriate for a fine pointer.

Provide equivalent touch interaction on Android.

Avoid tilting every card aggressively or causing layout shifts through hover transforms.

## H. Navigation and route transitions

Animate navigation menus and route transitions when supported by the current architecture.

Ensure:
- Browser history works normally.
- Direct URLs load correctly.
- Refreshes work.
- Anchor links remain valid.
- Back and forward navigation behave predictably.
- Scrolling is not unexpectedly reset.
- Focus remains appropriate after dialogs and route changes.
- Reduced-motion settings are respected.

Do not force full-page animations where simple transitions would produce a better experience.

## I. Ambient motion

Use a small number of slow ambient elements when they support the visual design.

Examples include:
- Softly animated lighting.
- Subtle background gradients.
- Slowly drifting decorative shapes.
- Gentle depth transitions.
- Restrained background patterns.
- Low-frequency ambient movement.

Do not put an animation on every background element.

Avoid perpetual high-frequency movement, excessive particles, constant blur rendering, and visually noisy effects.

## J. Animation without layout shifts

- Reserve space for content before it animates.
- Avoid animating layout-heavy properties when opacity and transforms are sufficient.
- Ensure animated elements do not unexpectedly change document flow.
- Prevent sticky headers from colliding with revealed content.
- Avoid overlapping transformed elements that block interactions.
- Verify animations after viewport resizing.
- Avoid entrance effects that leave elements permanently invisible when scripts fail.

## K. Reduced motion

Respect `prefers-reduced-motion: reduce`.

Provide alternatives that:
- Remove nonessential motion.
- Minimize parallax and scaling.
- Stop decorative continuous animation.
- Keep content immediately accessible.
- Preserve feedback and all functionality.
- Avoid unnecessary flashing, shaking, or aggressive movement.

The website must remain fully usable with motion effects disabled.

---

# 9. ADVANCED INTERACTIVE EXPERIENCES

Advanced features are encouraged when they improve the final product, but they must not compromise performance, maintainability, or the core portfolio experience.

Select features based on the existing architecture and actual content.

## A. Interactive 3D hero

Consider a distinctive interactive visual related to programming, software engineering, digital creation, or the developer's identity.

Potential approaches:
- Layered CSS perspective.
- Controlled 3D transforms.
- A lightweight scene.
- A restrained interactive object.
- Depth-based decorative layers.
- A carefully art-directed 3D composition.

Use WebGL, Three.js, or React Three Fiber only if the existing stack supports them and the visual improvement justifies the cost.

Do not introduce a 3D framework simply to satisfy an aesthetic requirement.

When using 3D:
- Make the scene responsive.
- Limit geometry, textures, shaders, and particles.
- Avoid unnecessary physics.
- Stop or reduce rendering when the scene is hidden where feasible.
- Handle initialization and cleanup correctly.
- Avoid leaking GPU resources.
- Provide a static fallback.
- Keep primary text outside the canvas where practical.
- Ensure the hero stays readable and usable if WebGL fails.

Use lightweight CSS depth effects on Android when full 3D would materially damage performance.

## B. Cursor-reactive lighting

On compatible desktop devices, consider subtle pointer-responsive lighting on selected surfaces.

Requirements:
- Detect input capability rather than relying only on device names.
- Avoid running unnecessary pointer calculations.
- Never interfere with native cursor behavior.
- Preserve text selection, drag operations, clicking, and keyboard access.
- Disable or greatly simplify effects on touch-first devices.
- Disable unnecessary effects under reduced motion.
- Ensure the effect cannot obscure text.

## C. Project storytelling

Where meaningful, use expandable details, project previews, image galleries, or animated project case studies.

Show real:
- Goals.
- Features.
- Technologies.
- Challenges.
- Screenshots.
- Outcomes, when documented.

Avoid fake metrics and empty modal windows.

Support dialog focus management, Escape-to-close behavior, and normal browser navigation where applicable.

## D. Command palette

Consider a useful keyboard-accessible command palette inspired by macOS software.

Potential entry shortcut:
- Ctrl/Cmd + K.

Potential actions:
- Navigate to sections.
- Search projects.
- Switch theme.
- Copy public contact details.
- Open verified social profiles.
- View keyboard shortcuts.

Requirements:
- Proper keyboard interaction.
- Functional search.
- Selected-item states.
- No-results state.
- Escape-to-close.
- Correct focus management.
- Touch-friendly operation.
- A discoverable mobile entry point.
- Appropriate shortcut hints.
- No browser-shortcut conflicts that make the feature frustrating.

Do not implement a command palette that contains nonfunctional demo actions.

## E. Terminal-inspired details

Terminal or code-inspired elements may reinforce the developer identity when they have a clear purpose.

Possible features:
- Real code examples.
- Syntax-highlighted snippets.
- Copyable commands.
- Project-specific code previews.
- Small interactive demonstrations.

Do not create a fake terminal that pretends to execute commands it cannot execute.

Never execute arbitrary user input merely for decoration.

## F. Sound design

Sound is optional, not mandatory.

If implemented:
- Audio must be disabled by default.
- Never autoplay unexpected sound.
- Require a clear user action to enable audio.
- Provide a persistent or accessible toggle where appropriate.
- Make every essential interaction work silently.
- Respect browser autoplay restrictions.
- Avoid loud, distracting, or repetitive effects.
- Ensure sound does not introduce privacy or tracking concerns.

Do not add sound merely to make the portfolio seem more elaborate.

## G. Theme system

Implement light and dark themes when supported by the existing design and useful for the portfolio.

Requirements:
- Carefully designed surfaces in both themes.
- Correct text and border contrast.
- Readable overlays and dialogs.
- Appropriate image and illustration treatment.
- Functional theme switching.
- Clear transition states.
- Correct initial behavior based on system appearance when appropriate.
- Respect for saved user preferences when persistence is implemented.
- No initial flash of the wrong theme where practical.

Do not simply invert all colors.

## H. Easter eggs

A small number of tasteful Easter eggs may improve memorability.

Examples:
- A hidden but discoverable keyboard shortcut.
- An optional alternate visual effect.
- A subtle developer-identity interaction.
- A useful interaction that rewards exploration.

Never hide essential navigation or functionality in an Easter egg.

Avoid distracting popups, gimmicks, and elaborate hidden systems that create unnecessary maintenance.

---

# 10. PERSONAL BRANDING AND STORYTELLING

Make the websites communicate a credible, recognizable personal developer identity.

## First impression

Within the first few seconds, visitors should understand:
- Who the developer is.
- What the developer builds.
- What kind of work is available.
- Where to explore projects.
- How to make contact.

Use a strong hero composition without forcing every detail into the first viewport.

## Authenticity

Use existing, verifiable information.

Do not fabricate:
- Technical skills.
- Work history.
- Education.
- Project completion status.
- User counts.
- Downloads.
- Customer numbers.
- Testimonials.
- GitHub activity.
- Business relationships.
- Performance benchmarks.

Clearly identify experimental and in-progress work when appropriate.

## Design language

Use:
- Strong typographic hierarchy.
- Deliberate negative space.
- Cohesive project imagery.
- Meaningful visual motifs.
- Thoughtful composition.
- Controlled contrast.
- Distinctive but restrained animation.

The outcome should be memorable because of its execution and identity, not because of the number of decorative effects.

---

# 11. CONTENT QUALITY AND INFORMATION ARCHITECTURE

Audit the existing content and remove obvious problems.

Check:
- Repeated sections.
- Placeholder text.
- Duplicate project cards.
- Dead links.
- Incorrect titles.
- Broken social profiles.
- Missing descriptions.
- Inconsistent capitalization.
- Contradictory branding.
- Unnecessary paragraphs.
- Empty headings.
- Misleading CTA labels.
- Unsupported claims.

Improve readability without changing the author's intended meaning unnecessarily.

Make important information easy to scan, especially on Android.

Every section must have a clear purpose.

Use meaningful heading levels and semantic page structure.

Avoid adding sections simply because a portfolio template usually contains them.

Prefer strong, complete, well-presented projects over a large number of weak or artificial entries.

---

# 12. COMPONENT ARCHITECTURE AND CODE QUALITY

Implement reusable, maintainable components.

Organize shared styling, visual tokens, layout primitives, and interaction patterns consistently.

Potential reusable components include:
- Navigation.
- Mobile menu.
- Buttons and links.
- Project cards.
- Project details.
- Section headings.
- Theme controls.
- Dialogs.
- Command palette.
- Footer.
- Animated reveal wrappers.
- Shared responsive containers.

Do not build an abstraction for every element.

Avoid:
- Monolithic components.
- Duplicated CSS.
- Conflicting global styles.
- Unnecessary libraries.
- Excessive prop complexity.
- Fragile selector chains.
- Magic numbers without a design rationale.
- Unused components.
- Unnecessary rewriting.
- Duplicated animation logic.
- Dead dependencies.

Use TypeScript and existing linting conventions if already supported.

Preserve compatibility with the actual framework and deployment target.

Do not migrate frameworks solely to match a personal preference.

Use CSS variables and existing project conventions where appropriate.

Keep animation cleanup, event listeners, observers, and resource lifecycle management correct.

---

# 13. ACCESSIBILITY AND INCLUSIVE UX

Accessibility is a required engineering standard, not an optional finishing touch.

Aim for WCAG 2.2 AA where applicable.

Audit and improve:

- Semantic HTML.
- Logical heading order.
- Descriptive links.
- Accessible button names.
- Keyboard navigation.
- Visible focus indicators.
- Color contrast.
- Form labels.
- Validation messages.
- Dialog focus management.
- Keyboard-operable menus.
- Image alternative text.
- Screen-reader announcements where necessary.
- Reduced-motion support.
- Zoom and text enlargement.
- Focus visibility under sticky navigation.

Never use color as the only way to communicate state.

Avoid focus traps outside intended modal interactions.

Ensure Escape closes dismissible overlays when appropriate.

Ensure opening and closing dialogs restores focus sensibly.

Support keyboard-only operation without requiring pointer gestures.

Test browser zoom at 200% and narrow layouts where practical.

Do not treat an automated accessibility score as proof of full accessibility. Combine automated checks with real interaction tests.

---

# 14. PERFORMANCE ENGINEERING

Optimize for real usability, especially on Android and mid-range hardware.

## Images

- Audit all asset dimensions and formats.
- Use responsive image sources where appropriate.
- Avoid oversized original images when smaller versions are sufficient.
- Preserve good visual quality.
- Set width, height, or aspect ratio to reserve layout space.
- Lazy-load noncritical below-the-fold images.
- Avoid unnecessarily lazy-loading the main above-the-fold image.
- Add explicit loading priorities when appropriate.
- Ensure all paths work in production.
- Provide suitable fallback behavior for missing assets.

## Fonts

- Avoid unnecessary font variants.
- Minimize external font requests.
- Use `font-display` appropriately.
- Provide reliable system fallbacks.
- Prevent layout shifts from font replacement where feasible.
- Do not load a large font family merely for one decorative heading.

## JavaScript

- Avoid unnecessary dependencies.
- Use code splitting when it materially improves loading.
- Keep interaction logic small and efficient.
- Avoid repeated rendering and unnecessary state updates.
- Do not install multiple overlapping animation libraries.
- Reduce nonessential JavaScript on mobile.
- Handle third-party requests cautiously.

## CSS and rendering

- Prefer transforms and opacity for many animated effects.
- Avoid excessive `backdrop-filter`.
- Use `will-change` only when justified and avoid permanently applying it to many elements.
- Reduce repaint-heavy decorative effects.
- Avoid unnecessarily large blurred surfaces.
- Clean up observers and listeners.
- Do not run continuous loops when nothing needs animation.

## Layout stability

Prevent:
- Cumulative layout shift.
- Unexpected image resizing.
- Late font-induced jumps.
- Unreserved skeleton space.
- Header height changes that move content.
- Animations that alter document flow.
- Overlay-induced layout shifts.

## Performance targets

Treat the following as goals to measure, not guaranteed outcomes:

- Lighthouse Performance: target 90+ on mobile and desktop where realistically achievable.
- Lighthouse Accessibility: target 95+.
- Lighthouse SEO: target 95+.
- Core Web Vitals at the 75th percentile, when field data is available:
  - LCP ≤ 2.5 seconds.
  - INP ≤ 200 milliseconds.
  - CLS ≤ 0.1.

Distinguish between simulated Lighthouse measurements and real-user field data.

Report the testing environment, baseline, and final measured results.

Do not manipulate results, remove necessary functionality to inflate scores, or claim a score without executing the relevant test.

A beautiful website that becomes sluggish on Android is not an acceptable result.

---

# 15. NAVIGATION, MICRO-INTERACTIONS AND FUNCTIONALITY

Every visible control must work as expected.

Test:
- Navbar links.
- Mobile menu.
- Theme switcher.
- Command palette.
- Project links.
- Dialogs.
- Copy buttons.
- Social links.
- Contact actions.
- Image galleries.
- Keyboard shortcuts.
- External links.
- Browser back and forward navigation.
- Direct URL navigation.
- Anchor scrolling.
- Forms that actually exist.

Provide clear feedback for:
- Copy success or failure.
- Form submission.
- Loading.
- Empty states.
- Errors.
- Disabled interactions.
- Theme changes.

Do not show fake success states.

Avoid adding a contact form that has no real backend or submission mechanism.

Avoid empty modal content or buttons with placeholder click handlers.

Do not interfere with browser-native functionality without a compelling reason.

For external links, use appropriate security handling when opening a new browsing context.

---

# 16. SECURITY, PRIVACY AND RELIABILITY

Preserve existing security and deployment assumptions.

- Never hardcode private API credentials.
- Never expose environment secrets.
- Avoid unsafe HTML injection.
- Validate untrusted input.
- Use appropriate external-link protections.
- Avoid unnecessary tracking.
- Do not add third-party analytics or scripts without a clear justification.
- Verify dependency changes before integrating them.
- Avoid installing abandoned or unnecessary packages.
- Review security implications of added runtime features.
- Keep public repository content free of sensitive configuration.

Do not weaken security protections to solve UI problems.

If the site does not handle user input, do not introduce complex input-handling code without a real requirement.

---

# 17. SEO, SOCIAL PREVIEWS AND DISCOVERABILITY

Audit the actual metadata and improve it where necessary.

Check:
- Page title.
- Meta description.
- Canonical URL.
- Open Graph metadata.
- Social preview images.
- Favicon.
- Relevant icon variants.
- Sitemap.
- Robots directives.
- Heading hierarchy.
- Descriptive image alternatives.
- Internal links.
- Structured data where justified.

Each domain must have accurate, domain-specific metadata.

Do not give both sites the same title, description, canonical URL, or social image unless that accurately reflects the intended architecture.

Ensure canonical URLs point to the correct live domain.

Do not add misleading structured data or unsupported claims.

Keep the content discoverable without requiring animations or complex client-side interaction.

If metadata, domain configuration, DNS, or deployment settings cannot be verified from the available environment, report the limitation.

---

# 18. PROGRESSIVE ENHANCEMENT AND FALLBACKS

The core website must work even when advanced effects are unavailable.

Ensure essential content is not dependent on:
- WebGL.
- Complex canvas rendering.
- Hover.
- Motion preferences being enabled.
- Third-party services.
- Sound.
- A command palette.
- A specific animation library.

If JavaScript fails, content should remain readable to the extent supported by the existing architecture.

Provide fallbacks for unsupported CSS effects.

Keep navigation and primary actions functional if decorative features fail.

Do not create an application-like experience that prevents normal browser use without a clear reason.

---

# 19. LIGHT AND DARK THEME VALIDATION

If theme switching exists or is implemented, test it thoroughly.

Verify:
- Page backgrounds.
- Navigation surfaces.
- Cards.
- Borders.
- Shadows.
- Forms.
- Dropdowns.
- Dialogs.
- Command palette.
- Icons.
- Project imagery.
- Focus indicators.
- Loading states.
- Error and success states.

Avoid poor contrast, inverted photography, invisible borders, and unreadable muted text.

Prevent initial theme flashes where practical.

Respect system appearance preferences appropriately and ensure manual choices behave predictably.

Do not store unnecessary personal data to retain a simple visual preference.

---

# 20. MOTION AND PERFORMANCE ADAPTATION

Advanced animation must remain subordinate to the quality of the user experience.

Use feature detection and input capabilities where helpful.

Adapt motion complexity according to:
- Viewport size.
- Input type.
- Reduced-motion preference.
- Visibility of animated content.
- Observed performance where feasible.

Avoid unreliable device-name detection.

Do not continuously poll hardware specifications.

Do not assume every Android device is slow or every desktop is powerful. Use measured performance and conservative effects.

Where suitable:
- Reduce particles.
- Disable pointer tracking on touch devices.
- Reduce parallax.
- Stop hidden decorative animation.
- Use static visual fallbacks.
- Remove nonessential blur.
- Simplify interactive 3D.
- Avoid unnecessary animation during scrolling.

Motion quality must remain high even when visual complexity is reduced.

---

# 21. DEPLOYMENT AND HOSTING COMPATIBILITY

Inspect the actual deployment configuration before making infrastructure changes.

The websites may use different hosting systems, so verify them independently.

Check:
- Correct build command.
- Correct output directory.
- Correct asset paths.
- Base paths and routing.
- Filename case sensitivity.
- Environment variables.
- Redirect behavior.
- Custom-domain configuration.
- HTTPS.
- Static-host limitations.
- Cache configuration where relevant.
- Existing CI workflows.
- Production dependencies.

For GitHub Pages, ensure the generated files, asset paths, routing strategy, and deployment workflow are compatible with the actual repository configuration.

For the other domain, inspect the actual hosting setup rather than assuming a particular provider.

Do not change DNS, domain ownership, hosting accounts, or production configuration without explicit authorization and appropriate tool access.

Do not perform destructive deployment actions merely to satisfy the design requirements.

After deployment, verify the actual public websites when access is available.

Distinguish these states clearly:
- Code changes implemented locally.
- Production build verified.
- Changes committed.
- Deployment completed.
- Public deployment verified.

Never describe one state as another.

---

# 22. COMPREHENSIVE TESTING STRATEGY

Testing is mandatory wherever the relevant tools are available.

## A. Baseline

Before implementation:
- Run the existing build if possible.
- Run existing tests where practical.
- Record existing failures.
- Capture representative screenshots.
- Measure baseline performance under documented conditions.

Do not attribute pre-existing failures to new changes without investigation.

## B. Build and static checks

Run the appropriate project commands for:
- Production build.
- Linting.
- Type checking.
- Unit tests.
- Integration tests.
- Existing automated checks.

Inspect command output and investigate failures.

Do not hide failed tests or skip checks simply to report a green status.

If the project has no test suite, do not invent a claim that tests passed. Add focused tests where practical and document what was actually verified.

## C. Responsive viewport testing

Test at minimum:
- 320px.
- 360px.
- 375px.
- 390px.
- 414px.
- 430px.
- 480px.
- 768px.
- 1024px.
- 1280px.
- 1440px.
- 1920px.
- 2560px.

Prioritize detailed verification at:
- Android mobile: 390px.
- Desktop: 1440px.

Also inspect at least one genuinely narrow viewport and one wide-screen viewport.

Verify:
- Horizontal overflow.
- Heading wrapping.
- Navigation.
- Hero proportions.
- Button placement.
- Project card sizing.
- Section spacing.
- Footer behavior.
- Fixed and sticky elements.
- Modal bounds.
- Touch-target sizes.
- Image cropping.
- Long content.
- Portrait and landscape behavior where possible.

Do not rely only on changing CSS viewport dimensions if browser tooling can validate the actual rendered page.

## D. Interaction testing

Exercise the complete user journey:
- Load each website.
- Navigate between sections.
- Open and close the mobile menu.
- Follow project links.
- Open and close dialogs.
- Switch themes.
- Use keyboard navigation.
- Test command palette behavior if implemented.
- Copy information.
- Submit real forms if available.
- Use browser refresh.
- Use back and forward navigation.
- Open direct URLs.
- Test reduced-motion mode.

Verify both mouse and touch behavior where applicable.

## E. Animation testing

Inspect:
- First-load sequences.
- Staggered reveals.
- Hover transitions.
- Pressed states.
- Modal transitions.
- Theme transitions.
- Scroll animations.
- Pointer-driven effects.
- 3D fallbacks.
- Reduced-motion alternatives.
- Resize behavior.
- Background movement.
- Mobile scrolling during animation.

Fix flicker, invisible content, motion collisions, incorrect z-index, blocked clicks, and layout shifts.

## F. Accessibility testing

Use appropriate available tooling for automated accessibility checks.

Manually verify:
- Keyboard navigation.
- Focus visibility.
- Dialog behavior.
- Heading order.
- Link descriptions.
- Accessible control names.
- Color contrast.
- Reduced-motion behavior.
- Zoom.
- Mobile menu operation.

Document limitations of automated testing.

## G. Performance testing

When tooling is available, record:
- Lighthouse results.
- JavaScript payload changes.
- Image payloads.
- Loading times under the test conditions.
- Layout shift findings.
- Browser console errors.
- Failed network requests.
- Animation performance issues.

Use identical or comparable measurement conditions for before-and-after comparisons.

Do not fabricate results.

## H. Visual regression and iterative critique

Capture before-and-after screenshots using the same viewport dimensions, browser settings, and comparable content states.

Review the complete page, not only the hero.

Evaluate:
- Typography.
- Hierarchy.
- Alignment.
- Proportions.
- Whitespace.
- Color.
- Contrast.
- Component consistency.
- Animation timing.
- Responsive behavior.
- Distinct brand identity.

Identify the most important remaining visual defects and fix them.

Repeat the review after major revisions.

Where screenshot automation is available, use it to catch regressions. Where it is unavailable, perform the strongest practical visual review and state the limitation.

Do not use mocked screenshots as evidence of production implementation.

---

# 23. REAL-USER USABILITY

Evaluate whether a visitor can understand and use both websites without instructions.

Representative tasks:

1. Identify the developer and the purpose of the website.
2. Find a featured project.
3. Understand what the project does.
4. Open its repository or live demo.
5. Navigate to another section.
6. Find the appropriate contact method.
7. Use the site with touch input on Android.
8. Navigate it using a keyboard on desktop.
9. Change theme if supported.
10. Continue using the page when animations are reduced or disabled.

Identify confusing labels, unnecessary steps, inaccessible interactions, and misleading buttons.

Make usability improvements before introducing more decorative effects.

Do not add chat widgets, intrusive prompts, unnecessary contact forms, or tracking merely because other portfolio sites have them.

---

# 24. FINAL CREATIVE DIRECTION

The visual result must be distinctive, cohesive, and immediately recognizable.

Use the following qualities as design guidance:

- Premium macOS-inspired interaction design.
- Original editorial composition.
- Refined typography.
- Controlled use of translucent surfaces.
- Sophisticated but restrained shadows.
- Deeply considered spacing.
- Strong visual hierarchy.
- Beautiful image presentation.
- Carefully coordinated motion.
- A memorable hero.
- Authentic project storytelling.
- Meaningful interactive details.
- Fast Android performance.
- Excellent desktop composition.

The experience should feel intentionally art-directed and professionally implemented.

Avoid:
- Generic AI portfolio templates.
- Copying the same layout onto both domains.
- Excessive gradients.
- Purple neon everywhere.
- Overused floating glass cards.
- Unnecessary custom cursors.
- Aggressive scrolling effects.
- Constantly moving backgrounds.
- Excessive 3D scenes.
- Fake terminals.
- Fake metrics.
- Fake loading screens.
- Unnecessary sound.
- Gimmicks without useful behavior.
- Features that do not work.
- Decorative elements that compete with content.

Put expressive motion and advanced visuals where they have the greatest impact, particularly the hero and selected project interactions. Let other sections use quieter motion.

Do not interpret "fully animated" as "every element must continuously move." Animate every major interaction and meaningful transition, but use static composition where continuous motion would damage readability, usability, or performance.

---

# 25. STRICT ACCEPTANCE CRITERIA

The task is complete only when the applicable criteria below are met.

## Design
- Both websites have a coherent macOS-inspired visual language.
- Each website retains a distinct identity.
- Typography, spacing, borders, shadows, and components are consistent.
- The hero is visually strong without obstructing useful information.
- All major sections have been reviewed.
- Project presentations are attractive, accurate, and usable.

## Android
- Responsive layouts work across the target viewport range.
- No reproducible horizontal overflow at supported viewport widths.
- No major overlapping elements or broken typography.
- Navigation and interactive components work with touch.
- Essential content does not depend on hover.
- The interface remains useful with reduced motion.
- Performance remains a priority.

## Desktop
- Layouts are balanced across laptop, desktop, and wide-screen displays.
- Text remains readable.
- Content containers have appropriate widths.
- Pointer interactions are polished but not intrusive.
- Keyboard navigation works.
- No major layout collisions or broken overlays.

## Animation
- A consistent motion system is implemented.
- Main entrance sequences and important transitions work.
- Major interactive components provide feedback.
- Animations do not introduce meaningful layout instability.
- Reduced-motion preferences are respected.
- Essential content remains available if animations fail.
- Advanced graphics have suitable fallbacks.

## Functionality
- Existing working features are preserved.
- Visible buttons perform their advertised actions.
- Important links are verified.
- Menus, dialogs, themes, and other added interactions work.
- Direct navigation and refresh behavior are tested.
- No unresolved critical functional regressions are knowingly concealed.

## Engineering
- Production builds pass, unless a documented blocker exists.
- Applicable tests and static checks have been executed.
- No unnecessary dependency explosion.
- No exposed secrets.
- Deployment configuration is preserved.
- Remaining defects are documented honestly.

## Quality
- Before-and-after visuals have been compared where tooling permits.
- Android and desktop have both been reviewed.
- High-impact issues have been corrected.
- Performance claims are backed by measurements.
- Deployment claims are backed by actual verification.

Do not require an arbitrary perfect numerical score at the expense of functionality. Use measurements to guide improvement, not to disguise defects.

---

# 26. IMPLEMENTATION PRIORITIES

When requirements compete for time, performance, or complexity, use this order:

**Priority 1 — Access and correctness**
- Ensure the real source code is available.
- Preserve existing work.
- Fix broken navigation, build failures, critical defects, and inaccessible controls.

**Priority 2 — Android responsiveness**
- Correct layouts.
- Fix overflow.
- Improve typography.
- Perfect mobile navigation.
- Optimize touch interactions.
- Preserve performance.

**Priority 3 — Desktop quality**
- Refine the layout.
- Improve composition.
- Establish proper content widths.
- Polish hover, keyboard, and pointer interactions.

**Priority 4 — Design system**
- Define design tokens.
- Unify typography and spacing.
- Refine surfaces, colors, shadows, and borders.
- Preserve distinct branding.

**Priority 5 — Animation**
- Build the reusable motion system.
- Implement hero choreography.
- Add section reveals.
- Improve component transitions.
- Add polished interaction feedback.

**Priority 6 — Advanced experiences**
- Add 3D, command palette, project storytelling, cursor-reactive effects, or optional sound only when they genuinely improve the experience.

**Priority 7 — Validation**
- Run tests.
- Review screenshots.
- Measure performance.
- Fix regressions.
- Verify deployment where authorized.

Do not leave critical defects unresolved in favor of adding more decorative features.

---

# 27. FINAL DELIVERY REPORT

When the implementation and verification work is finished, provide a concise, factual report organized by website.

For each website, state:

**Implemented changes**
- Main visual redesign.
- Android improvements.
- Desktop improvements.
- Animation system.
- Interactive features.
- Accessibility improvements.
- Performance work.
- SEO and metadata changes.

**Files and architecture**
- Key files modified.
- Important reusable components added or improved.
- Dependencies added, removed, or retained.

**Verification**
- Build status.
- Lint and type-check status.
- Test results.
- Viewports actually tested.
- Accessibility checks performed.
- Before-and-after performance measurements where available.
- Browser-based interaction tests performed.

**Deployment**
- Whether changes remain local.
- Whether a production build was created.
- Whether changes were committed.
- Whether deployment was completed.
- Whether the public website was verified.

**Remaining issues**
- Known defects.
- Missing tools or access.
- Unverified behavior.
- Performance limitations.
- Incomplete deployment tasks.

Do not claim that screenshots were captured if they were not. Do not claim that Android hardware was tested if only browser emulation was used. Do not report successful builds, test results, performance scores, or deployments without actual evidence.

If a requirement cannot be completed because a repository, credential, tool, or environment is unavailable, identify the exact blocker and the next action needed.

---

---

# PART II — STATUS SYSTEM ADDENDUM

Everything above is Part I, the original master prompt. The four sections below were supplied later and are reproduced verbatim. They are the authoritative specification for design tokens, semantic status colour, status icons, and the typed status registry.

**Numbering note.** These sections are numbered 12–15 because they were written to follow an earlier 1–11 token document. Part I already uses 12–15 for different subjects (component architecture, accessibility, performance, navigation). Read a bare "section 12" inside Part II as *this* section 12, not Part I's.

**Precedence where they disagree.**

- Part I section 5 permits "soft, controlled shadows" and selective glassmorphism. Part II section 12 removes shadows entirely. Existing translucent materials may stay only where they still read correctly without a shadow; no new glass is introduced.
- Part I sections 12–15 remain in force for their own subjects. Any shadow, glow, or elevation treatment they permit is superseded by the zero-shadow enforcement in Part II section 12.
- Part I section 13 requires that colour is never the only carrier of meaning; Part II sections 13 and 14 make that concrete for every status.
- Part I section 19 validates Light and Dark; Part II section 13 adds the semantic status tokens to that validation.
- Part I section 22 requires tests; Part II section 15.G lists the status-specific tests that must exist on top of the general suite.
- Part I targets both `dikaofc.devs.li` and `dikaglorya.github.io`. Part II is implemented once, as shared system code, in whichever repository the tokens live in.

12. CONCRETE COMPONENT TOKEN MAP

Implement these tokens as the single source of truth. All components must reference semantic tokens rather than hardcoded colors.
A. Global tokens

:root,
[data-theme="light"] {
  color-scheme: light;

  --bg-app: #F5F5F7;
  --bg-primary: #FFFFFF;
  --bg-secondary: #F0F0F2;
  --bg-tertiary: #E8E8ED;
  --bg-hover: #E8E8ED;
  --bg-active: #DCDCE1;
  --bg-disabled: #F0F0F2;

  --text-primary: #1D1D1F;
  --text-secondary: #6E6E73;
  --text-tertiary: #86868B;
  --text-disabled: #AEAEB2;
  --text-on-accent: #FFFFFF;

  --border-default: #D2D2D7;
  --border-subtle: #E5E5EA;
  --border-strong: #AEAEB2;

  --accent: #007AFF;
  --accent-hover: #0066D6;
  --accent-active: #0055B3;
  --accent-subtle: #E5F1FF;

  --success: #248A3D;
  --warning: #9A6700;
  --danger: #D70015;
  --info: #007AFF;

  --focus-ring: #007AFF;
  --selection-bg: #B9D7FF;
  --selection-text: #1D1D1F;
}

[data-theme="dark"] {
  color-scheme: dark;

  --bg-app: #1C1C1E;
  --bg-primary: #2C2C2E;
  --bg-secondary: #3A3A3C;
  --bg-tertiary: #48484A;
  --bg-hover: #444446;
  --bg-active: #545456;
  --bg-disabled: #2C2C2E;

  --text-primary: #F5F5F7;
  --text-secondary: #98989D;
  --text-tertiary: #8E8E93;
  --text-disabled: #636366;
  --text-on-accent: #FFFFFF;

  --border-default: #48484A;
  --border-subtle: #38383A;
  --border-strong: #636366;

  --accent: #0A84FF;
  --accent-hover: #409CFF;
  --accent-active: #0066CC;
  --accent-subtle: #153653;

  --success: #30D158;
  --warning: #FFD60A;
  --danger: #FF453A;
  --info: #0A84FF;

  --focus-ring: #0A84FF;
  --selection-bg: #245A91;
  --selection-text: #FFFFFF;
}

B. Layout tokens
Token	Value
--font-sans	-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif
--font-mono	ui-monospace, SFMono-Regular, Menlo, monospace
--text-xs	12px
--text-sm	13px
--text-base	14px
--text-md	16px
--text-lg	20px
--text-xl	24px
--text-2xl	32px
--space-1	4px
--space-2	8px
--space-3	12px
--space-4	16px
--space-5	20px
--space-6	24px
--space-8	32px
--space-10	40px
--space-12	48px
--radius-sm	6px
--radius-md	8px
--radius-lg	12px
--radius-xl	16px
--radius-pill	9999px
--control-height-sm	28px
--control-height-md	34px
--control-height-lg	44px
--sidebar-width	240px
--content-max-width	1440px
--transition-fast	120ms ease
--transition-normal	180ms ease
--z-dropdown	100
--z-sticky	200
--z-overlay	300
--z-modal	400
--z-toast	500
C. Component token map

Define component-specific tokens using the global tokens above.
Component	Background	Text	Border	Radius
App canvas	--bg-app	--text-primary	None	0
Main content	--bg-app	--text-primary	None	0
Sidebar	--bg-secondary	--text-primary	--border-subtle	0
Navigation item	Transparent	--text-secondary	None	--radius-md
Active navigation	--bg-active	--text-primary	None	--radius-md
Toolbar	--bg-primary	--text-primary	--border-subtle	0
Window panel	--bg-primary	--text-primary	--border-default	--radius-lg
Card	--bg-primary	--text-primary	--border-subtle	--radius-lg
Input	--bg-primary	--text-primary	--border-default	--radius-md
Dropdown	--bg-primary	--text-primary	--border-default	--radius-md
Menu item hover	--bg-hover	--text-primary	None	--radius-sm
Primary button	--accent	--text-on-accent	Transparent	--radius-md
Secondary button	--bg-secondary	--text-primary	--border-default	--radius-md
Tertiary button	Transparent	--accent	Transparent	--radius-md
Segmented control	--bg-secondary	--text-secondary	--border-subtle	--radius-md
Selected segment	--bg-primary	--text-primary	--border-default	--radius-sm
Table header	--bg-secondary	--text-secondary	--border-subtle	0
Table row	--bg-primary	--text-primary	--border-subtle	0
Badge	--bg-secondary	--text-secondary	--border-subtle	--radius-sm
Modal	--bg-primary	--text-primary	--border-default	--radius-xl
Modal backdrop	rgb(0 0 0 / 35%)	Inherited	None	0
Tooltip	--bg-tertiary	--text-primary	--border-default	--radius-sm
Code block	--bg-secondary	--text-primary	--border-subtle	--radius-md
Toast	--bg-primary	--text-primary	--border-default	--radius-lg
Divider	Transparent	Inherited	--border-subtle	0
D. Component state tokens

Use consistent state behavior across all components.
State	Required treatment
Default	Base component tokens
Hover	--bg-hover where applicable
Active / pressed	--bg-active or --accent-active
Focus-visible	2px solid var(--focus-ring) outline with 2px offset
Disabled	--text-disabled, --bg-disabled, reduced interaction
Selected	--accent or --bg-active, with clear text contrast
Invalid	--danger border and concise error message
Success	--success semantic indicator
Loading	Stable layout with a native-style progress indicator

Focus indicators must use outlines, not shadows. Never rely on color alone to communicate errors, selection, or status.
E. Mandatory zero-shadow enforcement

/* Global enforcement: no visual elevation anywhere. */
*,
*::before,
*::after {
  box-shadow: none !important;
  text-shadow: none !important;
}

:focus-visible {
  outline: 2px solid var(--focus-ring);
  outline-offset: 2px;
}

Do not use filter: drop-shadow() or SVG shadow filters. Inspect third-party components and generated styles as well.

Do not remove useful focus outlines, borders, or accessibility indicators. The prohibition applies to shadows, not outlines.
F. Implementation rules

    Use the exact tokens as the default design foundation; add new tokens only when a real component requires them.

    Keep component tokens semantic and centralized. Avoid repeating theme-specific hex values throughout page styles.

    Use data-theme="light" and data-theme="dark" consistently, or adapt to the project's existing theme architecture without creating competing systems.

    Avoid applying the global background to every nested component. Use surface hierarchy intentionally.

    Ensure menus, dialogs, portals, popovers, third-party widgets, and dynamically mounted components inherit the correct theme.

    Verify all token combinations in both themes for readability and accessible contrast.

    Do not introduce shadows, gradients, glassmorphism, or decorative glow effects as substitutes for hierarchy.

Expected result: a unified, flat, border-defined macOS-inspired interface with predictable design tokens, consistent component states, and complete Light/Dark theme coverage.
Define semantic status color variants

append this section to the existing prompt:
13. SEMANTIC STATUS COLOR SYSTEM

Define reusable semantic status variants for every component that communicates state. Status colors must adapt to Light and Dark themes, remain consistent across the entire application, and never introduce shadows, gradients, or glow effects.
A. Semantic status tokens

Add these tokens to the existing theme variables.

:root,
[data-theme="light"] {
  --status-success: #248A3D;
  --status-success-bg: #E8F5E9;
  --status-success-border: #B7DFBC;

  --status-warning: #9A6700;
  --status-warning-bg: #FFF4D6;
  --status-warning-border: #E9D28A;

  --status-danger: #D70015;
  --status-danger-bg: #FCE8EA;
  --status-danger-border: #F1B8BE;

  --status-info: #007AFF;
  --status-info-bg: #E5F1FF;
  --status-info-border: #B8D7FF;

  --status-neutral: #6E6E73;
  --status-neutral-bg: #F0F0F2;
  --status-neutral-border: #D2D2D7;

  --status-pending: #6E6E73;
  --status-pending-bg: #F0F0F2;
  --status-pending-border: #D2D2D7;
}

[data-theme="dark"] {
  --status-success: #30D158;
  --status-success-bg: #173B25;
  --status-success-border: #285A39;

  --status-warning: #FFD60A;
  --status-warning-bg: #403719;
  --status-warning-border: #6A5925;

  --status-danger: #FF453A;
  --status-danger-bg: #451F22;
  --status-danger-border: #713035;

  --status-info: #0A84FF;
  --status-info-bg: #153653;
  --status-info-border: #24547B;

  --status-neutral: #98989D;
  --status-neutral-bg: #3A3A3C;
  --status-neutral-border: #48484A;

  --status-pending: #98989D;
  --status-pending-bg: #3A3A3C;
  --status-pending-border: #48484A;
}

B. Required semantic variants
Variant	Meaning	Typical usage
success	Completed successfully or healthy	Saved, deployed, connected, passed
warning	Requires attention but is not necessarily failing	Degraded, expiring, resource pressure
danger	Failure, critical issue, or destructive consequence	Failed, disconnected unexpectedly, critical error
info	Informational state or neutral guidance	New feature, update available, system message
neutral	Ordinary, inactive, or unclassified state	Disabled, archived, unspecified
pending	Waiting for completion or confirmation	Queued, awaiting approval, scheduled

Do not assign colors arbitrarily. Components must derive status appearance from the semantic variant, not from individual page-specific styles.
C. Standard component variants

Implement the following reusable variants wherever applicable:

    Badge: compact status label with semantic text and optional background.

    Alert: status icon, title, description, and optional action.

    Toast: transient success, warning, error, or informational feedback.

    Banner: persistent status or system announcement.

    StatusDot: small indicator accompanied by accessible text.

    StatusText: semantic text without a filled background.

    StatusIcon: consistent icon treatment for each status.

    ProgressState: visual representation of queued, running, completed, or failed work.

    FormFeedback: field-level validation and submission feedback.

    HealthIndicator: operational health for services, connections, and integrations.

All variants must use the same token definitions across cards, tables, dashboards, menus, dialogs, and mobile layouts.
D. Visual rules

    Use semantic foreground, background, and border tokens together when a filled status component is appropriate.

    Prefer neutral styling for ordinary interface elements; reserve semantic colors for meaningful states.

    Keep status badges compact, with consistent padding, typography, and corner radii.

    Use subtle borders rather than shadows to define status containers.

    Do not color entire cards or pages unless the status genuinely applies to the entire region.

    Avoid excessive red, green, or yellow indicators on dashboards.

    Never communicate status through color alone. Pair color with text, an icon, or another accessible indicator.

    Maintain readable contrast in both themes.

    Support keyboard navigation and visible focus indicators for interactive alerts and status actions.

    Respect reduced-motion preferences; status transitions must not depend on animation to communicate changes.

E. State mapping

Use a consistent mapping for common application states:
Application state	Variant
Idle	neutral
Queued	pending
Loading	pending
Running	info
Completed	success
Saved	success
Connected	success
Disconnected intentionally	neutral
Reconnecting	pending
Degraded	warning
Expiring soon	warning
Validation error	danger
Failed	danger
Critical	danger
Update available	info
Archived	neutral

Use context to distinguish expected inactivity from unexpected failure. For example, an intentionally disconnected integration is neutral; an unexpectedly lost connection is a danger state.
F. Implementation contract

    Centralize status tokens and variants in the existing design system.

    Expose a consistent component API, such as variant="success" or status="warning".

    Type-check supported variants if the project uses TypeScript.

    Define a safe neutral fallback for unknown status values.

    Keep business logic separate from presentation logic.

    Ensure status components update correctly when application state changes.

    Verify every variant in both Light and Dark themes.

    Add tests for variant mapping, theme rendering, unknown values, and accessible labels.

    Do not introduce hardcoded semantic colors into individual components.

    Preserve all existing application behavior and status meanings.

Acceptance criteria: every status has one consistent semantic meaning, every theme has explicit status tokens, and every status component follows the same flat macOS-inspired styling with zero shadows.
Define accessible status icon mappings
14. ACCESSIBLE STATUS ICON MAPPINGS

Define a centralized, accessible icon mapping for all semantic statuses. Use Lucide icons with consistent stroke weight, sizing, and alignment. Preserve the existing macOS-inspired visual system: flat surfaces, no shadows, no glow, and only Light/Dark themes.
A. Canonical status mapping
Status	Lucide icon	Meaning
success	check-circle-2	Completed, healthy, verified
warning	alert-triangle	Attention required
danger	x-circle	Failed, critical, unexpected disconnection
info	info	Informational message
neutral	minus-circle	Inactive, archived, neutral
pending	clock-3	Waiting, queued, scheduled
loading	loader-circle	Operation in progress
running	loader-circle	Currently executing
connected	check-circle-2	Connection established
disconnected	unplug	Connection intentionally inactive
reconnecting	refresh-cw	Attempting to reconnect
degraded	activity	Reduced service quality
offline	wifi-off	Network unavailable
saved	check	Changes saved
failed	x-circle	Operation failed
expired	calendar-x	Expired
expiring	calendar-clock	Approaching expiration
queued	list-ordered	Waiting in queue
approved	check-check	Approved
rejected	ban	Rejected
unknown	circle-help	State cannot be determined

Use valid icon names supported by the installed icon library. If an icon is unavailable in the installed version, select a valid equivalent and keep the mapping centralized.
B. Mapping architecture

Implement a single typed registry rather than scattering icon names throughout components.

type StatusVariant =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral"
  | "pending";

type StatusDefinition = {
  icon: string;
  variant: StatusVariant;
  label: string;
};

export const statusIcons: Record<string, StatusDefinition> = {
  success: {
    icon: "check-circle-2",
    variant: "success",
    label: "Success",
  },
  warning: {
    icon: "alert-triangle",
    variant: "warning",
    label: "Warning",
  },
  danger: {
    icon: "x-circle",
    variant: "danger",
    label: "Error",
  },
  info: {
    icon: "info",
    variant: "info",
    label: "Information",
  },
  neutral: {
    icon: "minus-circle",
    variant: "neutral",
    label: "Inactive",
  },
  pending: {
    icon: "clock-3",
    variant: "pending",
    label: "Pending",
  },
};

Treat this registry as the source of truth for shared status components. Extend it with specialized application states where necessary. Resolve specialized states to their canonical semantic variants instead of creating redundant color systems.
C. Accessibility requirements

Decorative icons

    Set aria-hidden="true" when adjacent visible text already communicates the same status.

    Prevent decorative icons from creating duplicate screen-reader announcements.

Icon-only controls

    Provide a meaningful accessible name through aria-label or an equivalent supported labeling mechanism.

    Include a tooltip where useful, but never use the tooltip as the only accessible name.

    Make the control keyboard-accessible and provide a visible :focus-visible outline.

Status indicators

    Pair every important status with readable text or an equivalent accessible label.

    Never communicate success, failure, severity, or connectivity through color alone.

    Use role="status" for non-urgent updates and role="alert" for urgent errors that warrant immediate announcement.

    Do not apply live-region roles to every badge or icon; avoid repetitive announcements.

    Use aria-live="polite" for relevant asynchronous updates and reserve assertive announcements for genuinely urgent conditions.

    Do not move keyboard focus automatically when an ordinary status changes.

D. Visual specifications

Define consistent icon dimensions:
Context	Size
Inline status text	14px
Compact badge	14px
Standard alert	18px
Toast or banner	18px
Large empty/error state	24px
Icon-only button	16px

Use currentColor wherever supported. Derive icon color from the associated semantic status token:

    Success → --status-success

    Warning → --status-warning

    Danger → --status-danger

    Info → --status-info

    Neutral → --status-neutral

    Pending → --status-pending

Use consistent icon stroke weight, baseline alignment, and spacing. Never add shadows, colored glows, or unnecessary animated effects.
E. Animation and reduced motion

    Animate loading indicators only while work is genuinely in progress.

    Use subtle rotation for loader-circle when appropriate.

    Keep completion and error icons static.

    Respect prefers-reduced-motion: reduce.

    Avoid repeatedly animating persistent status indicators.

F. State resolution rules

Map runtime states consistently:

    idle → neutral / minus-circle

    queued → pending / list-ordered

    running → pending / loader-circle

    completed → success / check-circle-2

    connected → success / check-circle-2

    disconnected → neutral / unplug

    reconnecting → pending / refresh-cw

    degraded → warning / activity

    failed → danger / x-circle

    unknown → neutral / circle-help

Distinguish intentionally disconnected services from unexpected connection failures. Unexpected failures must use the danger variant.
G. Validation checklist

    Verify every icon exists in the installed icon library.

    Test all canonical variants in Light and Dark themes.

    Test icon-only controls with keyboard and screen readers.

    Verify meaningful labels and correct live-region behavior.

    Test missing and unknown status values.

    Confirm no duplicate announcements occur.

    Ensure status text remains understandable without color.

    Confirm all icons follow the existing zero-shadow policy.

Acceptance criterion: every application status resolves to one consistent icon, semantic variant, and accessible label through a centralized registry, with no ambiguous icon-only status indicators.
Expand the typed registry completely

replace the previous registry with this complete TypeScript implementation. it covers canonical variants, application states, accessible labels, icon mappings, safe fallbacks, and type-safe resolution.
15. COMPLETE TYPED STATUS REGISTRY

Implement a production-ready, centralized status registry in TypeScript. Use Lucide React icons, semantic color tokens, and a strict mapping between application states, icon names, visual variants, and accessible labels.
A. Types and contracts

// src/lib/status-registry.ts

import type { LucideIcon } from "lucide-react";

export const STATUS_VARIANTS = [
  "success",
  "warning",
  "danger",
  "info",
  "neutral",
  "pending",
] as const;

export type StatusVariant = (typeof STATUS_VARIANTS)[number];

export const STATUS_STATES = [
  "idle",
  "loading",
  "running",
  "queued",
  "pending",
  "scheduled",
  "awaiting_approval",
  "in_progress",
  "completed",
  "success",
  "saved",
  "connected",
  "disconnected",
  "reconnecting",
  "offline",
  "online",
  "healthy",
  "degraded",
  "warning",
  "error",
  "failed",
  "critical",
  "expired",
  "expiring",
  "approved",
  "rejected",
  "cancelled",
  "paused",
  "skipped",
  "retrying",
  "rate_limited",
  "maintenance",
  "update_available",
  "archived",
  "draft",
  "published",
  "unknown",
] as const;

export type StatusState = (typeof STATUS_STATES)[number];

export interface StatusDefinition {
  readonly icon: LucideIcon;
  readonly variant: StatusVariant;
  readonly label: string;
  readonly description: string;
  readonly announce: boolean;
}

export interface ResolvedStatus extends StatusDefinition {
  readonly state: StatusState;
}

B. Canonical variant registry

import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  MinusCircle,
  Clock3,
} from "lucide-react";

export const STATUS_VARIANT_REGISTRY = {
  success: {
    icon: CheckCircle2,
    variant: "success",
    label: "Success",
    description: "The operation completed successfully.",
    announce: false,
  },
  warning: {
    icon: AlertTriangle,
    variant: "warning",
    label: "Warning",
    description: "Attention may be required.",
    announce: false,
  },
  danger: {
    icon: XCircle,
    variant: "danger",
    label: "Error",
    description: "The operation failed or requires urgent attention.",
    announce: false,
  },
  info: {
    icon: Info,
    variant: "info",
    label: "Information",
    description: "Informational update.",
    announce: false,
  },
  neutral: {
    icon: MinusCircle,
    variant: "neutral",
    label: "Inactive",
    description: "No active operation or special condition.",
    announce: false,
  },
  pending: {
    icon: Clock3,
    variant: "pending",
    label: "Pending",
    description: "The operation is waiting or in progress.",
    announce: false,
  },
} as const satisfies Record<StatusVariant, StatusDefinition>;

C. Complete application state registry

import {
  Check,
  CheckCheck,
  CheckCircle2,
  CircleHelp,
  Clock3,
  FileEdit,
  FileCheck,
  FileClock,
  FileX,
  Ban,
  AlertCircle,
  AlertTriangle,
  Activity,
  CalendarClock,
  CalendarX,
  CircleDot,
  CirclePause,
  CirclePlay,
  CircleStop,
  CloudOff,
  LoaderCircle,
  MinusCircle,
  Pause,
  RefreshCw,
  RotateCcw,
  Send,
  ShieldAlert,
  ShieldCheck,
  Upload,
  Wifi,
  WifiOff,
  XCircle,
  XOctagon,
  Zap,
  ListOrdered,
  Unplug,
  Wrench,
  type LucideIcon,
} from "lucide-react";

type StatusDefinitionInput = Omit<StatusDefinition, "announce"> & {
  readonly announce?: boolean;
};

function defineStatus(
  icon: LucideIcon,
  variant: StatusVariant,
  label: string,
  description: string,
  announce = false,
): StatusDefinition {
  return {
    icon,
    variant,
    label,
    description,
    announce,
  };
}

export const STATUS_REGISTRY = {
  idle: defineStatus(
    CircleDot, "neutral", "Idle",
    "No operation is currently running.",
  ),
  loading: defineStatus(
    LoaderCircle, "pending", "Loading",
    "Content is loading.",
  ),
  running: defineStatus(
    LoaderCircle, "pending", "Running",
    "The operation is currently running.",
  ),
  queued: defineStatus(
    ListOrdered, "pending", "Queued",
    "The operation is waiting in a queue.",
  ),
  pending: defineStatus(
    Clock3, "pending", "Pending",
    "The operation is awaiting completion.",
  ),
  scheduled: defineStatus(
    CalendarClock, "pending", "Scheduled",
    "The operation is scheduled for later.",
  ),
  awaiting_approval: defineStatus(
    Clock3, "pending", "Awaiting approval",
    "Approval is required before proceeding.",
  ),
  in_progress: defineStatus(
    CirclePlay, "pending", "In progress",
    "Work is in progress.",
  ),

  completed: defineStatus(
    CheckCircle2, "success", "Completed",
    "The operation completed successfully.",
  ),
  success: defineStatus(
    CheckCircle2, "success", "Success",
    "The operation succeeded.",
  ),
  saved: defineStatus(
    Check, "success", "Saved",
    "Changes have been saved.",
  ),
  connected: defineStatus(
    Wifi, "success", "Connected",
    "The connection is established.",
  ),
  online: defineStatus(
    Wifi, "success", "Online",
    "The service is online.",
  ),
  healthy: defineStatus(
    ShieldCheck, "success", "Healthy",
    "The service is operating normally.",
  ),
  approved: defineStatus(
    CheckCheck, "success", "Approved",
    "The request has been approved.",
  ),

  disconnected: defineStatus(
    Unplug, "neutral", "Disconnected",
    "The connection is intentionally inactive.",
  ),
  archived: defineStatus(
    FileCheck, "neutral", "Archived",
    "The item has been archived.",
  ),
  draft: defineStatus(
    FileEdit, "neutral", "Draft",
    "The item has not been published.",
  ),
  paused: defineStatus(
    CirclePause, "neutral", "Paused",
    "The operation is paused.",
  ),
  skipped: defineStatus(
    MinusCircle, "neutral", "Skipped",
    "The operation was skipped.",
  ),
  cancelled: defineStatus(
    CircleStop, "neutral", "Cancelled",
    "The operation was cancelled.",
  ),

  reconnecting: defineStatus(
    RefreshCw, "pending", "Reconnecting",
    "The system is attempting to reconnect.",
  ),
  retrying: defineStatus(
    RotateCcw, "pending", "Retrying",
    "The operation is being retried.",
  ),

  degraded: defineStatus(
    Activity, "warning", "Degraded",
    "The service is operating with reduced capability.",
  ),
  warning: defineStatus(
    AlertTriangle, "warning", "Warning",
    "Attention is required.",
  ),
  expiring: defineStatus(
    CalendarClock, "warning", "Expiring soon",
    "The item is approaching its expiration date.",
  ),
  rate_limited: defineStatus(
    Clock3, "warning", "Rate limited",
    "Requests are temporarily being limited.",
  ),
  maintenance: defineStatus(
    Wrench, "warning", "Maintenance",
    "Maintenance is in progress or scheduled.",
  ),
  update_available: defineStatus(
    Upload, "info", "Update available",
    "An update is available.",
  ),

  offline: defineStatus(
    WifiOff, "danger", "Offline",
    "The service or network is unexpectedly unavailable.",
    true,
  ),
  error: defineStatus(
    AlertCircle, "danger", "Error",
    "An error occurred.",
    true,
  ),
  failed: defineStatus(
    XCircle, "danger", "Failed",
    "The operation failed.",
    true,
  ),
  critical: defineStatus(
    ShieldAlert, "danger", "Critical",
    "A critical condition requires immediate attention.",
    true,
  ),
  expired: defineStatus(
    CalendarX, "danger", "Expired",
    "The item has expired.",
  ),
  rejected: defineStatus(
    Ban, "danger", "Rejected",
    "The request was rejected.",
  ),

  published: defineStatus(
    Send, "success", "Published",
    "The item has been published.",
  ),

  unknown: defineStatus(
    CircleHelp, "neutral", "Unknown",
    "The current state could not be determined.",
  ),
} as const satisfies Record<StatusState, StatusDefinition>;

Ensure every icon import exists in the installed Lucide version. Remove unused imports and use a valid equivalent if an icon is unavailable.
D. Type-safe status resolution

const STATUS_STATE_SET: ReadonlySet<string> =
  new Set(STATUS_STATES);

export function isStatusState(
  value: unknown,
): value is StatusState {
  return (
    typeof value === "string" &&
    STATUS_STATE_SET.has(value)
  );
}

export function resolveStatus(
  value: unknown,
): ResolvedStatus {
  const state: StatusState = isStatusState(value)
    ? value
    : "unknown";

  return {
    state,
    ...STATUS_REGISTRY[state],
  };
}

Import STATUS_STATES from the type definition section and use the same registry across the application. Do not maintain a second, manually duplicated list of supported states.
E. Accessible reusable component

import type { HTMLAttributes } from "react";
import { resolveStatus } from "@/lib/status-registry";
import type { StatusState } from "@/lib/status-registry";

interface StatusIndicatorProps
  extends HTMLAttributes<HTMLSpanElement> {
  status: StatusState | (string & {});
  showIcon?: boolean;
  showDescription?: boolean;
}

export function StatusIndicator({
  status,
  showIcon = true,
  showDescription = false,
  className,
  ...props
}: StatusIndicatorProps) {
  const resolved = resolveStatus(status);
  const Icon = resolved.icon;

  return (
    <span
      {...props}
      className={[
        "status-indicator",
        `status-indicator--${resolved.variant}`,
        className,
      ].filter(Boolean).join(" ")}
      data-status={resolved.state}
    >
      {showIcon && (
        <Icon
          size={14}
          strokeWidth={1.8}
          aria-hidden="true"
          focusable="false"
        />
      )}

      <span>{resolved.label}</span>

      {showDescription && (
        <span className="sr-only">
          {resolved.description}
        </span>
      )}
    </span>
  );
}

Use visible text for status meaning. Decorative icons must not create duplicate announcements. Do not add live-region behavior to every indicator; announce changes at the relevant operation or notification boundary.
F. Semantic CSS

.status-indicator {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  font: inherit;
  line-height: 1.4;
}

.status-indicator--success { color: var(--status-success); }
.status-indicator--warning { color: var(--status-warning); }
.status-indicator--danger { color: var(--status-danger); }
.status-indicator--info { color: var(--status-info); }
.status-indicator--neutral { color: var(--status-neutral); }
.status-indicator--pending { color: var(--status-pending); }

.status-indicator svg {
  flex: 0 0 auto;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

G. Testing requirements

Add automated tests covering:

    Every declared StatusState has exactly one registry entry.

    Every registry entry has a valid icon, label, description, and canonical variant.

    Unknown runtime values resolve to unknown.

    All six canonical variants resolve correctly.

    Decorative icons are hidden from assistive technology.

    Visible status text remains present when icons are disabled.

    Light and Dark themes use the correct semantic tokens.

    Status updates do not cause unnecessary live-region announcements.

    The production build and TypeScript checks pass.

Implementation rule: integrate this registry into the real codebase, consolidate existing status mappings, remove duplicates, and validate every icon against the installed dependency version. Do not claim completion until the checks have actually passed.

Important: the agent must verify the project's installed lucide-react version and fix any unsupported icon imports before building.

---

# FINAL DIRECTIVE

Begin by inspecting both actual repositories and existing implementations.

Determine what is broken, what is worth preserving, and what requires redesign.

Then implement the redesign directly in the source code.

Deliver two distinctive, premium, macOS-inspired developer websites with outstanding Android responsiveness, polished desktop composition, rich but deliberate animations, meaningful interactive experiences, authentic content, accessible behavior, and production-quality engineering.

Do not waste time generating more specifications once the requirements are clear.

Do not stop after the initial redesign.

Do not add features merely to increase feature count.

Do not sacrifice usability or mobile performance for decorative effects.

Do not confuse a successful visual mockup with a working implementation.

Use parallel agents where beneficial, execute the available checks, review the actual results, correct regressions, and complete the highest-priority work before expanding scope.

Stop when the acceptance criteria are met, significant remaining issues are resolved or documented, and all reported results are supported by actual verification.

**The final objective is two exceptional, fully responsive, animated, distinctive developer websites—not two collections of impressive-looking effects.**
