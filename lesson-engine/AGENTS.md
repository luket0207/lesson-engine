Codex Repository Instructions
Scope: These are persistent instructions for Codex in this React repository. They define how to work, not what the product should be. Product behaviour comes only from the current user instruction and the selected epic item.
Placement: Keep this file named AGENTS.md in the repository root. Do not also maintain a src/vibe/rules.txt copy.

1. Mandatory behaviour
- Before each user instruction, including every // command, consult the current repository-root AGENTS.md. Re-read it from disk at the start of each new coding request so recent edits are not missed. Codex also discovers repository AGENTS.md guidance automatically when a session starts.
- Follow applicable higher-priority platform instructions and the user's current explicit instruction first. This file governs the defaults; the selected feature or bug supplies its specific requirements. Never treat old epic notes as permission to override a newer explicit request.
- Stay strictly within the current task. Make the smallest functional, maintainable change that satisfies it, then stop. Never implement neighbouring features, speculative improvements, decorative styling, or unrelated refactors.
- Inspect relevant existing code and installed dependencies before introducing new components, helpers, folders, or packages. Reuse first.
- Never change AGENTS.md, add agent instruction files, or redesign the workflow unless the user explicitly asks.
- Prefer clear, readable implementations to excessive abstraction. If a material requirement is ambiguous, ask instead of inventing product decisions; for low-risk implementation details, choose the simplest approach and state the assumption briefly.
- Do not commit, push, switch branches, rewrite Git history, or delete the user's existing work unless specifically authorised.
2. Command dispatcher
Recognise these exact canonical forms when provided as user commands. XXX means a three-digit epic number, including leading zeroes. A command may be part of a longer message. Execute one command at a time unless the user explicitly requests a sequence; //setupProject is the single exception because it must call the logic of //nextEpic once. Unknown or malformed commands must be reported without guessing or editing files.
Command	Action
//setupProject	One-time React project bootstrap specified in section 3.
//nextEpic	Create the next empty numbered epic as specified in section 4.
//epic-XXXNextFeature	Implement the first non-complete feature in that epic.
//epic-XXXNextBug	Address the first non-complete bug in that epic.
//rollbackFeature	Safely undo the most recently worked-on feature command.
//rollbackBug	Safely undo the most recently worked-on bug command.


Feature and bug commands
For //epic-XXXNextFeature, read src/vibe/epics/epic-XXX/features.txt. For //epic-XXXNextBug, read src/vibe/epics/epic-XXX/bugs.txt.
1. Pick the first entry in written order whose status is not complete. An entry without a status counts as not started. in progress and blocked both count as non-complete: do not silently skip them. If the selected entry is blocked, first check whether the documented blocker is now resolved; avoid blindly repeating the same failed work.
2. Work on that single entry using the implementation procedure in section 6.
3. If the epic, file, or an unambiguous entry is missing, report the problem; do not fabricate requirements or advance to another item.
4. Do not implement the next item automatically after finishing.
Rollback commands
- //rollbackFeature targets the most recent feature implementation attempt not already rolled back, across all epics.
- //rollbackBug does the same for bug implementation attempts. Attempts ending blocked also qualify.
- Use the rollback safety protocol in section 7. Restore the selected epic entry's previous status and notes along with the code where possible.
- Do not guess from the latest Git commit, discard unrelated edits, or undo intervening changes. If an exact rollback would overwrite subsequent work, stop and explain the conflict.
3. //setupProject — one-time bootstrap
This command is for a new React project. Inspect the existing directory, package.json, React entry point, package manager, and Git state before changing anything. If already set up, do not wipe the project, recreate files, or reinstall dependencies; explain what is already present. Preserve all user-created code and configuration.
1. Install the standard libraries using npm, retaining compatible existing versions where already installed:
   - Routing: react-router-dom
   - UI components: primereact
   - Icons: @fortawesome/react-fontawesome, @fortawesome/fontawesome-svg-core, @fortawesome/free-solid-svg-icons
   - SCSS compilation: sass as a development dependency
     These are the default choices for future work. Use PrimeReact first when a suitable component is needed; use Font Awesome for requested icons; do not add UI merely to demonstrate installed libraries.
2. Remove recognisable unused React/Vite starter boilerplate only. Never delete unrelated existing code, real content, or user-owned assets. Preserve the working HTML/React mount and essential configuration.
3. Create src/pages/home.jsx and src/pages/about.jsx. Create src/routes.jsx with React Router DOM routes: / renders Home and /about renders About. Integrate the router with the existing application entry point.
4. Put a simple React Router DOM Link to About on Home and a Link to Home on About. No other navigation, sample features, visual polish, or decorative CSS/SCSS.
5. Create these directories, initially empty: src/assets/scss/, src/assets/images/, and src/components/. Do not add placeholder files to them unless the user requests that. (Git does not track empty directories.)
6. Preserve the root AGENTS.md. Create src/vibe/epics/ if needed and execute the //nextEpic procedure exactly once, producing epic-001 in a fresh project. Never overwrite an existing epic or its entries.
7. Use the existing Git repository for safe rollback records. If no Git repository exists, initialise one locally, without creating commits or remotes. Never make Git commits or pushes automatically.
8. Perform only a quick, relevant compile/startup check if practical; do not add a test suite or testing documentation.
9. Report the files created, required dependencies, and the available commands. Explain that features and bugs are written by the user into each epic's text files. Then stop.
The setup is intentionally basic and functional. It does not define the project's future features, business rules, theme, or content.
4. //nextEpic — epic creation
- Look at existing directories named src/vibe/epics/epic-NNN where NNN is exactly three digits and is greater than 000.
- Create epic-001 if none exist; otherwise take the highest existing number and add one (epic-002, epic-003, etc.). Do not fill gaps, overwrite directories, or reset numbering. If epic-999 already exists, stop and ask how to continue.
- Inside the new epic folder create exactly two truly empty text files, features.txt and bugs.txt.
- Do not create testing.txt, implementation.txt, sample features, templates, README files, or any other epic process file.
- Report the new epic path and stop.
5. Epic entry conventions
Epics contain only:
src/vibe/epics/
  epic-001/
    features.txt
    bugs.txt
  epic-002/
    features.txt
    bugs.txt
The user owns requirements. Accept plainly numbered items or clearly separated blocks; do not require a strict template. For reliable automatic selection, recommend this format after an epic has been created, without filling blank files automatically:
FEATURE-001: Short title
Status: not started
Requirements:
- Required behaviour and acceptance criteria
Notes: (optional)

BUG-001: Short title
Status: not started
Description: What goes wrong and the expected behaviour
Notes: (optional)
- Valid status values for both features and bugs: not started, in progress, blocked, complete.
- Status is attached to each item, never the whole file. Treat missing status as not started.
- Preserve all original wording and the order of entries. Never silently add, combine, remove, reorder, or expand the user's requirements.
- Update only the currently selected entry's status and concise implementation notes. Useful notes include a blocker, a necessary technical decision, an affected data contract, or an outstanding limitation. Avoid detailed logs.
- Other discovered issues are out of scope. Mention significant ones in the response; do not insert a new feature or bug into an epic without authorisation.
- features.txt and bugs.txt are the only epic workflow files. Never create or maintain testing.txt, even if an older project used one.
6. Implementation procedure — one item per command
1. Read: Consult this AGENTS.md, the selected feature/bug's full requirements, and only the relevant application files. Check existing components, hooks, utilities, styles, routes, and dependency APIs for reuse.
2. Set boundaries: Identify the behaviour explicitly required. Do not infer extra functionality, validation, routes, database structures, persistence, architecture, or style. Do not modify unrelated areas.
3. Capture rollback baseline: Before editing each affected path, save its original state using section 7, including whether it did not yet exist. If you cannot establish a safe recoverable baseline, do not proceed with destructive changes.
4. Implement: Change the selected entry to Status: in progress, then make the smallest maintainable fix or implementation. Build a reusable component only when there is an actual present need; do not future-proof speculatively.
5. Verify lightly: Carry out only a targeted check appropriate to the change, following section 9. Correct errors introduced by this implementation, without expanding into broad testing.
6. Update entry: Set Status: complete when the specified behaviour is implemented with reasonable confidence. Otherwise set Status: blocked and add a short explanation of what prevents completion. Do not claim human acceptance or full test coverage.
7. Record + stop: Save the post-change state for rollback, report the outcome concisely, and stop. Do not start another feature or bug in the same pass.
7. Safe rollback protocol
Rollback must survive different Codex sessions without depending on conversation memory. Prefer storing local command history under .git/vibe-command-history/, outside the epic folders and outside the tracked source tree.
- Before modifying a file in a feature/bug command, capture its exact prior contents or absence, including any pre-existing uncommitted user changes. Record which item, epic, command type, and paths are involved. When the command is finished or blocked, save the resulting contents or hashes as well. Include the applicable epic text file, package.json, and lockfiles if modified.
- Keep separate records for feature and bug attempts and record their execution order, so a later rollback can identify the latest eligible command of that type. Avoid making Git commits merely for rollback.
- Before restoring a path, check its current state against the recorded post-command state. If it differs, or if later commands depend on it, stop rather than overwrite more recent work. Explain which files conflict and what manual decision is needed.
- If all paths are safe, restore only that command's exact previous versions (or remove files that were newly created by that command), restore the epic entry's prior state, and mark the history record rolled back.
- Never run git reset --hard, git clean -fd, blanket git restore, force checkout, or any other destructive repository-wide command to implement these rollbacks.
- If local history was removed, or safe reversal is not possible, say so. Do not pretend the rollback succeeded.
- Do not add rollback logs to the epic directories or create testing.txt or implementation.txt for rollback purposes.
8. Coding and architecture standards
Stack, folders and reuse
- Use React with .jsx for every file containing JSX, including pages, components, and JSX-rendering providers. Use .js for plain logic, utilities, hooks without JSX, and configuration where suitable. Do not introduce TypeScript without a request.
- Use .scss for authored styling, not .css. Do not add inline styles unless genuinely dynamic or the simplest safe implementation. Existing third-party CSS imports may remain when required by dependencies.
- Route with React Router DOM, keeping application route definitions together in src/routes.jsx unless the user requests a different structure.
- Before building custom UI, consider both existing application components and the installed PrimeReact equivalent. Use PrimeReact if it meets the request without unnecessary complexity; semantic HTML is preferable for a simpler basic element. Do not recreate an existing component unnecessarily.
- Use Font Awesome only when an icon is actually required. Reuse already-installed dependencies; check the real installed version/API. Propose new dependencies only when existing tools cannot reasonably meet the requirement.
- Keep shared, currently reusable components in src/components/. A component with bespoke styling may use src/components/modal/modal.jsx and src/components/modal/modal.scss. Components used by only one feature may stay near that feature; do not generalise on speculation.
- Keep components focused and readable, with clear props. Prefer composition over oversized components or configurable abstractions. Extract repeated logic only when there is real duplication.
- Keep state local until sharing is necessary. Avoid direct state mutation, duplicated sources of truth, excessive effects, and mixing complex data logic into presentation. Do not introduce global state libraries, persistence, servers, APIs, authentication, or other infrastructure unless required by the current item.
SCSS, responsiveness and design
- Use src/assets/scss/ for genuinely shared variables, mixins, breakpoints, and global structural rules. Keep the SCSS centralised and reusable; use modern Sass module conventions (@use/@forward) as appropriate. Create only the shared files actually needed.
- Keep bespoke SCSS beside its .jsx file: e.g., src/pages/home.scss for src/pages/home.jsx. Do not put one-off styles in global SCSS.
- No unrequested styling or product design. Do not choose colours, branding, typefaces, themes, gradients, shadows, animation, decorative page structure, extra icons, or visual polish. If no styling is specified, leave the UI as plain browser defaults except for the minimum required for accessibility and functionality.
- Unless expressly stated otherwise, keep interfaces functional on mobile and desktop; prefer fluid sizing and shared responsive patterns rather than fixed-width layouts and elaborate breakpoint systems. Responsiveness is not permission to invent visual design.
Quality, correctness and safety
- Keep changes small, traceable, and consistent with the current codebase. Use clear names; remove unused imports or dead code only in files directly changed. Add short comments only when decisions are non-obvious.
- Preserve existing behaviour, exports, routes, APIs, data formats, and user data unless the feature or bug requires a specific change. Avoid unrelated renames or sweeping refactors.
- Build accessible basic UI when relevant: semantic buttons and links, labels for inputs, keyboard-usable controls, appropriate error feedback, and no colour-only meaning. Do not add speculative validation or flows.
- Handle errors that can actually occur in the requested functionality. Do not silently swallow failures, expose secrets, hard-code credentials, or log sensitive information.
- Do not invent business rules, demo data, fake integrations, placeholder content, future screens, or optional enhancements. Anything not requested should remain unimplemented.
- Do not modify unrelated dependency versions, config, documentation, or folder structure as a side effect of a feature or bug.
9. Minimal verification only — avoid expensive testing
- Do not create unit tests, integration tests, end-to-end tests, automated test suites, test frameworks, test harnesses, test fixtures, or testing.txt. Human users will test features and report problems in each epic's bugs.txt.
- Make only the smallest relevant check needed to catch obvious implementation mistakes: for example, inspect the changed logic or run a single quick build when compilation could be affected. Use judgment; some simple edits need no command.
- Do not perform repeated build/lint/test cycles, full regression testing, extensive manual QA, broad code reviews, or detailed test write-ups. Fix clear errors introduced by the current change only.
- Never claim checks were run if they were not. If verification is unavailable, note it in one sentence at most.
10. Completion response
Keep the final response short and practical: identify the command and epic item, its final status, the behaviour implemented or bug fixed, notable files changed, and any essential blocker or assumption. Mention a relevant check only briefly. Then stop and await the next instruction.