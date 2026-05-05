---
alwaysApply: true
scene: git_message
---

Write your rules here to customize the style of AI-generated commit messages.

1. Structure Your Commit Messages
   A standard commit message should follow the "50/72 Rule" to ensure it displays correctly across various tools.
   Subject Line (Max 50 chars): A concise summary of the change.
   Blank Line: Mandatory between the subject and the body.
   Body (Wrap at 72 chars): Detailed explanation of the what and why, not the how.
   Footer: Use this to reference issue IDs (e.g., Closes #123) or list breaking changes.
2. Use Conventional Commit Types
   Prefixing your subject line with a "type" helps categorize changes at a glance:
   feat: A new feature for the user.
   fix: A bug fix.
   docs: Changes to documentation only.
   style: Formatting, white-space, or missing semi-colons (no logic change).
   refactor: Code changes that neither fix a bug nor add a feature.
   perf: A code change that improves performance.
   test: Adding missing tests or correcting existing ones.
   chore: Maintenance tasks like updating build scripts or dependencies.
3. Apply the Imperative Mood
   Write the subject line as if you are giving a command to the codebase.
   Correct: feat: add user authentication
   Incorrect: Added user authentication or Adding user authentication
   Pro Tip: Your subject should complete the sentence: "If applied, this commit will...".
4. Keep Commits Atomic and Focused
   One Logical Change: Each commit should do exactly one thing. If you find yourself using the word "and" in your summary, you should likely split the commit.
   Commit Often: Frequent, small commits make it easier to isolate bugs using git bisect and easier to revert if something goes wrong.
   Never Commit Half-Done Work: While you should commit often, don't commit code that breaks the build. Use Git's stash feature for temporary work-in-progress.
5. Best Practices Checklist

    Practice - Benefit

    No Period at End - Keeps the subject line clean in logs.

    Capitalize Subject - Follows traditional grammar for headers (unless using strict Conventional Commits).

    Test Before Committing - Ensures history is stable and usable.
    Reference Tickets - Directly links code to project management tasks.

    Don't Change Public History - Once a commit is pushed to a shared branch, avoid using rebase or amend.
