---
name: create-skill
description: "Use when you need to create or update a VS Code skill file (SKILL.md) for workspace or personal customization. Guides through scope, structure, and validation."
---

# Create a Skill (`SKILL.md`)

Use this skill when the user wants a reusable, multi-step workflow packaged as a VS Code skill file.

## When to use

- The need is a workflow rather than a single prompt.
- You want a skill that can be invoked with a slash command in chat.
- You are creating a repository-scoped or user-level helper for later reuse.

## Steps

1. Confirm the outcome
   - What should this skill produce?
   - What specific problem or workflow should it solve?
2. Choose scope
   - Workspace-scoped: put the skill under `.github/skills/<name>/SKILL.md`
   - User-scoped: put the skill under `{{VSCODE_USER_PROMPTS_FOLDER}}/` instead
3. Create the skill folder and file
   - Use the skill name as the folder name.
   - Add `SKILL.md` inside that folder.
4. Write the body
   - Start with a short purpose statement.
   - Include a clear step-by-step workflow.
   - Add decision points and completion checks.
5. Validate
   - Confirm the file exists in the right path.
   - Verify the markdown is readable and the frontmatter is valid.

## Completion checks

- The skill describes the exact outcome and when it should be used.
- It includes a clear workflow with branching or quality checks when needed.
- It uses repository or user-level placement consistently.

## Example prompts

- "Create a SKILL.md that helps me review backend routes and controllers."
- "Generate a workspace skill for writing API documentation updates."
- "Help me build a skill for fixing authentication middleware in this repo."

## Related customization

- For one-off tasks, use a prompt file (`*.prompt.md`) instead.
- For repository-wide guidance, use `*.instructions.md`.
- For tool-enforced policies, use a hook or custom agent.
