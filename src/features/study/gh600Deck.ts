import type { Flashcard } from "./gh300Deck";

type SourceQuestion = [
  question: string,
  choices: string[],
  correctIndexes: number[],
  explanation?: string,
];

const sourceQuestions: SourceQuestion[] = [
  // G1: Prepare agent architecture and SDLC processes (15-20%)
  [
    `G1Q1. A team wants to hand work to an autonomous coding agent. Which kind of task is the best first candidate?`,
    [
      `A well-scoped issue with clear acceptance criteria, such as fixing a reproducible bug or adding tests to a module`,
      `A vague request to "improve the architecture" across the whole system`,
      `A production incident that needs real-time judgment and access to live customer data`,
      `A task whose requirements are still being negotiated with stakeholders`,
    ],
    [0],
    `Agents perform best on bounded, verifiable steps. Ambiguous, cross-cutting or high-stakes judgment work should stay with humans or be broken down first.`,
  ],
  [
    `G1Q2. Which practices are common agent anti-patterns that a team should mitigate? (Choose two.)`,
    [
      `Giving the agent one huge, open-ended task with no definition of done`,
      `Granting the agent broad write access to every repository "just in case"`,
      `Asking the agent to open a pull request for human review`,
      `Running the project's tests in the agent's environment before it finishes`,
    ],
    [0, 1],
    `Unbounded scope and over-broad permissions are classic anti-patterns. Review through pull requests and running tests are mitigations, not problems.`,
  ],
  [
    `G1Q3. Before assigning an issue to an agent, what should the issue define so the agent and reviewers can judge the result? (Choose three.)`,
    [
      `The inputs and context the agent needs, such as relevant files or reproduction steps`,
      `The expected output, such as a pull request with code and tests`,
      `Success criteria, such as "all existing tests pass and a new test covers the bug"`,
      `The model temperature the agent should use`,
    ],
    [0, 1, 2],
    `Clear inputs, outputs and success criteria turn an agent task into something that can be checked. Sampling parameters are not part of a task definition.`,
  ],
  [
    `G1Q4. A team wants the agent to think through a change before touching any code. How should the agent be configured?`,
    [
      `Separate a planning step, which produces a plan and cannot edit files, from an execution step that implements the approved plan`,
      `Let the agent plan and edit in the same step so it moves faster`,
      `Disable all tools so the agent can only plan forever`,
      `Ask the agent to write the plan as a code comment after the change is merged`,
    ],
    [0],
    `Keeping planning distinct from execution (for example a read-only planner agent followed by an implementer) lets humans and tools check intent before any action.`,
  ],
  [
    `G1Q5. Why configure an agent to output its plan in a structured format, such as a Markdown checklist or JSON with steps, files and tests?`,
    [
      `So the plan can be reviewed, validated automatically and tracked step by step`,
      `Because unstructured plans are not supported by any model`,
      `To reduce the number of tokens the model can use`,
      `So the plan can be executed without any review`,
    ],
    [0],
    `A structured plan is inspectable and machine-checkable: a reviewer or a script can confirm scope, touched files and tests before execution starts.`,
  ],
  [
    `G1Q6. Which checks are useful when validating an agent's plan before execution? (Choose two.)`,
    [
      `Confirm each step maps to the task's success criteria`,
      `Confirm the plan stays within the files, services and permissions the task allows`,
      `Confirm the plan has at least twenty steps`,
      `Confirm the plan was produced in under one second`,
    ],
    [0, 1],
    `Plan validation checks coverage (does it achieve the goal?) and scope (does it stay inside its boundaries?). Length and speed say nothing about quality.`,
  ],
  [
    `G1Q7. A team requires that an agent never acts until its plan is approved. Which design achieves this?`,
    [
      `The planning agent has read-only tools; execution starts only after a human or an automated gate approves the plan`,
      `The agent writes "approved" at the end of its own plan`,
      `The agent executes immediately and a human reverts it afterwards if needed`,
      `The agent sends the plan in chat but keeps editing in parallel`,
    ],
    [0],
    `Approval must be an external gate the agent cannot satisfy by itself. Read-only planning plus an approval step is the standard pattern.`,
  ],
  [
    `G1Q8. How should a team decide the degree of autonomy for an agent?`,
    [
      `Match autonomy to the risk and reversibility of the actions, and pair it with guardrails such as scoped permissions and required reviews`,
      `Always give maximum autonomy, because agents are faster than humans`,
      `Always require approval for every single tool call`,
      `Let the agent choose its own autonomy level at runtime`,
    ],
    [0],
    `Autonomy is a deliberate design choice: low-risk, reversible actions can run freely, while risky ones need guardrails or human approval.`,
  ],
  [
    `G1Q9. Copilot cloud agent works on a task in the background. How does it make its work inspectable inside standard development tooling? (Choose two.)`,
    [
      `It pushes commits to a branch and opens a pull request that humans review`,
      `It exposes session logs that show its reasoning steps and tool calls`,
      `It emails a ZIP file of the changed files to the repository owner`,
      `It writes directly to the default branch so the history shows every change`,
    ],
    [0, 1],
    `Branches, pull requests and session logs are familiar artifacts. They let reviewers see what changed and why, without new tools.`,
  ],
  [
    `G1Q10. A team wants human oversight of autonomous agents without slowing delivery. Which approach fits best?`,
    [
      `Insert human review at natural checkpoints, such as plan approval and pull request review, and let low-risk steps run unattended`,
      `Require a human to approve every file read the agent makes`,
      `Remove all human checkpoints to maximize speed`,
      `Pause the agent every five minutes for a status call`,
    ],
    [0],
    `Put humans where their judgment changes outcomes. Review of plans and pull requests gives control without blocking every small step.`,
  ],
  [
    `G1Q11. Where can a team give Copilot repository-wide guidance that agents read automatically, such as build commands and coding conventions? (Choose two.)`,
    [
      `.github/copilot-instructions.md`,
      `An AGENTS.md file in the repository`,
      `The repository's LICENSE file`,
      `A comment in the issue tracker's sidebar`,
    ],
    [0, 1],
    `Copilot reads repository custom instructions from .github/copilot-instructions.md, and agents also honor AGENTS.md files. Path-specific instructions live in .github/instructions/*.instructions.md.`,
  ],

  // G2: Implement tool use and environment interaction (20-25%)
  [
    `G2Q1. An agent must update dependency versions and confirm the project still builds. Which tools does it actually need? (Choose two.)`,
    [
      `File read and edit tools for the repository`,
      `A terminal or shell tool to run the build and tests`,
      `A tool to send messages to customers`,
      `Admin access to the organization's billing settings`,
    ],
    [0, 1],
    `Identify tools from the task: editing files and running the build. Anything else adds risk without helping the task.`,
  ],
  [
    `G2Q2. How do you restrict which tools a custom agent defined in .github/agents/<name>.agent.md can use?`,
    [
      `List the allowed tools in the tools property of the agent profile's YAML frontmatter`,
      `Rename the file to end in .readonly.md`,
      `Add the tool names to .gitignore`,
      `Tools cannot be restricted for custom agents`,
    ],
    [0],
    `A custom agent profile is Markdown with YAML frontmatter (name, description, tools and more). The tools list limits what the agent can call.`,
  ],
  [
    `G2Q3. A "reviewer" agent should comment on code but never change it. How should its tool permissions be configured?`,
    [
      `Grant only read and search tools, and omit edit and shell tools`,
      `Grant all tools and tell it in the prompt not to edit`,
      `Grant edit tools but disable the network`,
      `Grant the same permissions as the implementer agent for consistency`,
    ],
    [0],
    `Enforce least privilege with tool permissions, not with prompt wording. A prompt can be ignored; a missing tool cannot be called.`,
  ],
  [
    `G2Q4. What does adding an MCP server to an agent give the agent?`,
    [
      `Access to the tools (and possibly resources and prompts) that the server exposes through the Model Context Protocol`,
      `A larger context window`,
      `A different underlying language model`,
      `Automatic approval of all its pull requests`,
    ],
    [0],
    `MCP is a standard protocol for connecting agents to external tools and data. Each server advertises tools the agent can call.`,
  ],
  [
    `G2Q5. When you configure MCP servers for Copilot cloud agent in the repository settings JSON, what must each server entry include so the agent can use its tools?`,
    [
      `A tools list naming the allowed tools, or ["*"] to allow all of them`,
      `A model name for the server to use`,
      `A cron schedule`,
      `The repository's default branch name`,
    ],
    [0],
    `Cloud agent uses MCP tools autonomously without asking, so the configuration must say which tools are allowed. Listing specific tools is safer than "*".`,
  ],
  [
    `G2Q6. A developer wants to add GitHub's remote MCP server so an agent can read issues and pull requests. Which statements are true? (Choose two.)`,
    [
      `The remote server is hosted by GitHub, so nothing has to run locally`,
      `It can be limited to specific toolsets or set to read-only mode`,
      `It must be compiled from source on every developer machine`,
      `It can only be used with a personal access token stored in the repository`,
    ],
    [0, 1],
    `GitHub's remote MCP server is hosted at api.githubcopilot.com and supports OAuth. Toolsets and read-only mode reduce the surface the agent can use.`,
  ],
  [
    `G2Q7. An enterprise wants developers to discover only approved MCP servers in their IDE. What should an administrator configure?`,
    [
      `An MCP registry URL in the Copilot policies, listing the approved servers`,
      `A wiki page with server links`,
      `A branch protection rule`,
      `A Dependabot configuration`,
    ],
    [0],
    `An MCP registry is a catalog of servers. Pointing Copilot at the organization's registry makes approved servers discoverable from supported IDEs.`,
  ],
  [
    `G2Q8. An organization must block developers from adding MCP servers that are not in its registry. Which setting does this?`,
    [
      `Set the MCP allowlist policy to allow only servers from the registry (registry only)`,
      `Disable Copilot chat`,
      `Turn off GitHub Actions`,
      `Delete the registry so no servers can load`,
    ],
    [0],
    `A registry alone helps discovery; the allowlist policy enforces it by blocking servers that are not in the registry.`,
  ],
  [
    `G2Q9. Copilot cloud agent runs in an ephemeral environment powered by GitHub Actions. Which statements describe this execution context? (Choose two.)`,
    [
      `It has access only to the repository it was assigned work in`,
      `Its internet access is controlled by a firewall with an allowlist`,
      `It runs on the developer's laptop with their local credentials`,
      `It can push directly to any branch, including the default branch`,
    ],
    [0, 1],
    `Cloud agent works in a sandbox scoped to one repository, with a firewall limiting outbound traffic. It cannot push to the default branch.`,
  ],
  [
    `G2Q10. Copilot cloud agent fails because the project needs a specific Node.js version and private packages installed first. Where do you prepare its environment?`,
    [
      `In a .github/workflows/copilot-setup-steps.yml workflow with a job named copilot-setup-steps`,
      `In the README under "Getting started"`,
      `In .github/CODEOWNERS`,
      `In the repository's About section`,
    ],
    [0],
    `Setup steps run before the agent starts, so dependencies and tools are ready. The job must be named copilot-setup-steps.`,
  ],
  [
    `G2Q11. How do you keep an agent's work scoped to one repository and away from the default branch? (Choose two.)`,
    [
      `Assign the task in that repository, so the agent's token only covers it`,
      `Let the agent work on its own feature branch and merge through a reviewed pull request`,
      `Give the agent an organization-wide admin token`,
      `Disable branch protection on the default branch`,
    ],
    [0, 1],
    `Repository scope plus branch-based scope keeps changes contained. Copilot cloud agent works on copilot/ branches and opens pull requests for review.`,
  ],
  [
    `G2Q12. A team wants an agent to run automatically when a label is added to an issue. What is the most direct way?`,
    [
      `Trigger the agent from a GitHub Actions workflow on the issues labeled event`,
      `Ask a developer to check the label list every morning`,
      `Add the label name to copilot-instructions.md`,
      `Use a branch protection rule on labels`,
    ],
    [0],
    `CI workflows can invoke agents on repository events, which makes agent work part of the normal automation pipeline.`,
  ],
  [
    `G2Q13. Which actions can Copilot cloud agent perform autonomously after you assign it an issue? (Choose two.)`,
    [
      `Create a branch and push commits to it`,
      `Open a pull request and request your review`,
      `Merge its own pull request into the default branch without review`,
      `Approve its own pull request`,
    ],
    [0, 1],
    `The agent can branch, commit and open pull requests, but merging stays with humans and existing branch protection rules.`,
  ],
  [
    `G2Q14. The agent's environment blocks outbound traffic, but the build must download packages from an internal registry. What is the right fix?`,
    [
      `Add the registry's host to the agent's firewall allowlist (or preinstall dependencies in setup steps)`,
      `Disable the firewall completely`,
      `Commit the package tarballs into the repository`,
      `Tell the agent to skip the build`,
    ],
    [0],
    `Handle environment constraints with the narrowest change: allow the specific host or prepare dependencies in advance.`,
  ],
  [
    `G2Q15. An agent's tool call to an external API fails with a timeout. Which error-handling approach is best?`,
    [
      `Retry a limited number of times with backoff, then fail clearly and escalate if it still fails`,
      `Retry forever until it works`,
      `Ignore the error and continue as if the call succeeded`,
      `Delete the repository and start over`,
    ],
    [0],
    `Transient failures deserve bounded retries with backoff. After that, the agent should stop with a clear error and an escalation path, not hide the failure.`,
  ],
  [
    `G2Q16. When is it safe for an agent to retry a failed action automatically?`,
    [
      `When the action is idempotent, so running it twice has the same effect as running it once`,
      `Always, because retries never cause harm`,
      `Only when the action deletes data`,
      `Never; agents must not retry`,
    ],
    [0],
    `Retrying non-idempotent actions (for example "create a payment" or "post a comment") can duplicate side effects.`,
  ],
  [
    `G2Q17. An agent's change broke the build after it was merged. What makes rollback easy?`,
    [
      `The agent's changes are in small, reviewed commits or pull requests that can be reverted`,
      `The agent squashes all work from a week into one unreviewed push to main`,
      `The agent deletes its branch after merging, so nobody can find the change`,
      `The agent rewrites history to hide the failing commit`,
    ],
    [0],
    `Small, isolated changes through pull requests can be reverted cleanly. Git history is the rollback mechanism.`,
  ],
  [
    `G2Q18. An agent repeatedly fails a task it cannot complete. What should its escalation path do?`,
    [
      `Stop, record what it tried and why it failed, and hand off to a human (for example by commenting on the issue or pull request)`,
      `Keep trying with more permissions`,
      `Mark the task as done to unblock the queue`,
      `Silently close the issue`,
    ],
    [0],
    `Good escalation stops wasted work and gives the human enough context to continue.`,
  ],
  [
    `G2Q19. How do you make an agent's actions traceable and accountable? (Choose two.)`,
    [
      `Link each change to the task, plan and session logs that produced it`,
      `Record which human assigned the work and who approved the result`,
      `Run the agent with a shared, anonymous account`,
      `Disable logging to save storage`,
    ],
    [0, 1],
    `Traceability connects every change to its trigger, reasoning and approvals. With cloud agent, commits are co-authored by the person who assigned the task.`,
  ],

  // G3: Manage memory, state, and execution (10-15%)
  [
    `G3Q1. An agent needs the current conversation's recent tool results, a set of facts that should last across sessions, and a large internal knowledge base. Which memory types fit, in that order?`,
    [
      `Short-term (context window), long-term (persisted memories), external (retrieval from a store)`,
      `External, short-term, long-term`,
      `Long-term, external, short-term`,
      `Short-term for all three`,
    ],
    [0],
    `Short-term memory is the working context; long-term memory persists learned facts; external memory is retrieved on demand from documents or databases.`,
  ],
  [
    `G3Q2. Why scope agent memory to task-relevant information?`,
    [
      `Irrelevant context wastes tokens and can mislead the agent into wrong decisions`,
      `Models cannot store more than ten facts`,
      `It makes the agent ignore instructions`,
      `It is required for MCP servers to work`,
    ],
    [0],
    `More context is not always better. Focused memory improves accuracy and cost.`,
  ],
  [
    `G3Q3. Copilot Memory stores facts it learns about a repository. How does it avoid acting on outdated memories? (Choose two.)`,
    [
      `It checks memories against the current code, using citations, before using them`,
      `Memories expire automatically if they are not used for a period (28 days)`,
      `Memories are kept forever and never questioned`,
      `Every memory must be retyped by a developer each day`,
    ],
    [0, 1],
    `Validation against the codebase and automatic expiry keep memory fresh. Repository owners can also review and delete stored memories.`,
  ],
  [
    `G3Q4. A long-running agent task will span several sessions. How should it capture progress so another session can pick it up?`,
    [
      `Write progress, decisions and next steps to a durable artifact, such as a checklist in the pull request description or a plan file in the branch`,
      `Keep everything only in the model's context window`,
      `Rely on the developer remembering what happened`,
      `Store progress in a temporary variable that is lost on restart`,
    ],
    [0],
    `Durable artifacts survive restarts and are visible to humans and other agents.`,
  ],
  [
    `G3Q5. An agent resumes work after an interruption. What prevents it from repeating steps or contradicting earlier decisions?`,
    [
      `Reading the recorded plan, completed steps and decision log before continuing`,
      `Starting the task over from scratch`,
      `Raising the temperature for more creative continuation`,
      `Deleting the earlier commits`,
    ],
    [0],
    `Resuming from recorded state keeps work consistent and avoids duplicated effort.`,
  ],
  [
    `G3Q6. During a long session an agent gradually starts editing files unrelated to its task. What is this, and how do you correct it?`,
    [
      `Context drift; compare actions against the original plan and scope, and re-anchor or restart from the plan`,
      `A firewall error; allow more hosts`,
      `A merge conflict; rebase the branch`,
      `Normal behavior; no action needed`,
    ],
    [0],
    `Drift is gradual divergence from the goal. Regular checks against the plan, scope limits and checkpoints detect and correct it.`,
  ],
  [
    `G3Q7. Two agents in different tools need the same project state. What is the most reliable way to share it?`,
    [
      `Store state in a shared, versioned artifact, such as files in the repository, an issue or a pull request`,
      `Copy and paste chat history between tools`,
      `Let each agent guess the state from scratch`,
      `Store state in each agent's private context only`,
    ],
    [0],
    `A single shared source of truth, visible to every tool, keeps agents aligned.`,
  ],
  [
    `G3Q8. Two agents receive conflicting instructions about which test framework to use. How do you prevent this conflicting context?`,
    [
      `Keep one authoritative source, such as repository instructions, and have every agent read it`,
      `Let the agents vote on the framework`,
      `Give each agent its own copy of the instructions to edit freely`,
      `Remove all instructions`,
    ],
    [0],
    `Conflicting context comes from duplicated, diverging sources. A single authoritative source fixes it.`,
  ],
  [
    `G3Q9. An agent uses a summary of the codebase that was generated last month. Which practices prevent stale context? (Choose two.)`,
    [
      `Refresh or re-validate context against the current code before using it`,
      `Attach timestamps or versions to stored context and expire old entries`,
      `Assume last month's summary is still correct`,
      `Cache context forever to save tokens`,
    ],
    [0, 1],
    `Stale context leads to wrong edits. Versioning, expiry and re-validation keep it current.`,
  ],

  // G4: Perform evaluation, error analysis, and tuning (15-20%)
  [
    `G4Q1. When specifying an agent task, what should you include besides the expected outcome?`,
    [
      `Operational constraints, such as files it must not change, time limits and allowed dependencies`,
      `The agent's favorite programming language`,
      `Nothing; outcome alone is enough`,
      `A list of every possible solution`,
    ],
    [0],
    `Constraints define what "done well" means, not just "done". They also become checks during evaluation.`,
  ],
  [
    `G4Q2. Which are quantitative evaluation signals for a coding agent? (Choose two.)`,
    [
      `Percentage of pull requests merged without rework`,
      `Test pass rate of the agent's changes`,
      `A reviewer's note that the code "reads clearly"`,
      `The agent's tone in its pull request description`,
    ],
    [0, 1],
    `Quantitative signals are measurable rates and counts. Reviewer judgment about clarity is a qualitative signal; both are useful.`,
  ],
  [
    `G4Q3. An agent makes all tests pass by deleting the failing tests. What evaluation problem does this reveal?`,
    [
      `The evaluation criteria were not aligned with development intent; passing tests was measured instead of correct behavior`,
      `The model's context window is too small`,
      `The firewall blocked the test runner`,
      `The agent needs more MCP servers`,
    ],
    [0],
    `Metrics can be gamed. Evaluation must reflect intent, for example "tests pass and no tests were removed".`,
  ],
  [
    `G4Q4. Which automated tools can generate evaluation signals for agent-written code? (Choose two.)`,
    [
      `Code scanning, such as CodeQL, to find security issues`,
      `Secret scanning and dependency review`,
      `A random number generator`,
      `The repository's star count`,
    ],
    [0, 1],
    `Automated scanners give objective, repeatable signals about security and quality on every agent change.`,
  ],
  [
    `G4Q5. An agent's pull request does the wrong thing. Which sources help you find where it went wrong? (Choose three.)`,
    [
      `The agent's session logs and traces of tool calls`,
      `The plan it produced before execution`,
      `Workflow run logs and artifacts from CI`,
      `The repository's license`,
    ],
    [0, 1, 2],
    `Logs, plans, traces, outputs and workflow artifacts together show what the agent intended and what actually happened.`,
  ],
  [
    `G4Q6. An agent called a "delete branch" tool when it meant to list branches. How do you classify this root cause?`,
    [
      `Tool misuse`,
      `Context or environment issue`,
      `Network outage`,
      `Successful execution`,
    ],
    [0],
    `Tool misuse means the agent picked the wrong tool or wrong arguments. Fixes include clearer tool descriptions and tighter permissions.`,
  ],
  [
    `G4Q7. An agent wrote code against an API version that is not installed in its environment. How do you classify this root cause?`,
    [
      `Context or environment issue`,
      `Reasoning error`,
      `Tool misuse`,
      `Approval failure`,
    ],
    [0],
    `The agent lacked correct information about its environment. Fixes include setup steps and better context, not just a better prompt.`,
  ],
  [
    `G4Q8. An agent has the right tools and context but draws the wrong conclusion from a failing test. How do you classify this?`,
    [`Reasoning error`, `Tool misuse`, `Environment issue`, `Memory expiry`],
    [0],
    `Reasoning errors happen in the agent's logic. Typical fixes are clearer instructions, smaller steps or plan validation.`,
  ],
  [
    `G4Q9. Evaluation shows an agent keeps ignoring the project's naming conventions. What is the most direct tuning step?`,
    [
      `Revise the agent's instructions, for example in copilot-instructions.md or path-specific instructions, with the conventions and examples`,
      `Give the agent more tools`,
      `Remove all instructions`,
      `Increase the agent's permissions`,
    ],
    [0],
    `Tune behavior where it originates: missing or unclear instructions are fixed by revising instructions, workflows or constraints.`,
  ],
  [
    `G4Q10. Evaluation shows an agent uses a deprecated internal API that appears in old memories, and also calls an expensive tool it never needs. Which tuning steps fit? (Choose two.)`,
    [
      `Prune or correct the outdated memory`,
      `Remove the unneeded tool from the agent's tool list`,
      `Add more memories without reviewing them`,
      `Grant the agent access to every tool to compensate`,
    ],
    [0, 1],
    `Refine memory usage and tool access based on evidence. Fewer, correct inputs usually improve behavior.`,
  ],

  // G5: Orchestrate multi-agent coordination (15-20%)
  [
    `G5Q1. A workflow has a planner agent, then an implementer agent, then a reviewer agent, each using the previous agent's output. Which orchestration pattern is this?`,
    [
      `Sequential (pipeline)`,
      `Concurrent (fan-out)`,
      `Group chat`,
      `Random routing`,
    ],
    [0],
    `In a sequential pattern each agent hands its output to the next. Concurrent patterns run agents in parallel and merge results.`,
  ],
  [
    `G5Q2. Several agents must work on separate features of the same repository at the same time. How do you isolate them? (Choose two.)`,
    [
      `Give each agent its own branch (or Git worktree)`,
      `Give each agent its own sandboxed execution environment`,
      `Let all agents edit the same working directory`,
      `Run all agents with one shared terminal session`,
    ],
    [0, 1],
    `Separate branches or worktrees plus separate environments prevent agents from overwriting each other's files and state.`,
  ],
  [
    `G5Q3. Two agents produce pull requests that change the same function in different ways. What should the orchestration do?`,
    [
      `Detect the overlap, pick one change or merge them deliberately, and send the conflict to a human or a coordinator agent if needed`,
      `Merge both and let Git decide`,
      `Close both pull requests without comment`,
      `Ask a third agent to make a third, unrelated change`,
    ],
    [0],
    `Overlapping changes, duplicated effort and contradictory outputs must be detected and resolved explicitly, not left to chance.`,
  ],
  [
    `G5Q4. How do you prevent duplicated effort when several agents pull work from the same backlog?`,
    [
      `Assign or claim each task explicitly (for example, assign the issue) so only one agent owns it`,
      `Let every agent take every task and keep the best result`,
      `Hide the backlog from agents`,
      `Give tasks to agents at random`,
    ],
    [0],
    `Clear ownership of tasks avoids two agents doing the same work.`,
  ],
  [
    `G5Q5. Compliance needs to audit a multi-agent workflow. What should each agent produce? (Choose two.)`,
    [
      `Reviewable artifacts, such as pull requests, plans and logs`,
      `A record of decisions and handoffs, including which agent passed what to whom`,
      `Nothing, to keep the workflow fast`,
      `Only a final "done" message`,
    ],
    [0, 1],
    `Auditability needs artifacts and a documented chain of decisions and handoffs across agents.`,
  ],
  [
    `G5Q6. A multi-agent run produced a bad result last week. What makes post-hoc analysis possible?`,
    [
      `Retained logs, traces and artifacts that link each step to the agent that performed it`,
      `The final output only`,
      `Asking the agents what they remember now`,
      `Rerunning the workflow and hoping it fails the same way`,
    ],
    [0],
    `Post-hoc analysis depends on retained, correlated records. Without them you can only guess.`,
  ],
  [
    `G5Q7. Which signals indicate a stalled or partial agent execution? (Choose two.)`,
    [
      `No new commits, logs or status updates for much longer than usual`,
      `A task marked finished while required steps in its plan are unchecked`,
      `A pull request that passed all checks and was approved`,
      `An agent that finished within its normal time`,
    ],
    [0, 1],
    `Monitor progress signals and compare completion claims against the plan to catch stalled and partial runs.`,
  ],
  [
    `G5Q8. One agent in a pipeline starts producing low-quality output, and downstream agents build on it. What is the best response?`,
    [
      `Pause or isolate the degraded agent, stop downstream steps from consuming its output, and route to a fallback or human`,
      `Let downstream agents fix whatever they receive`,
      `Restart all agents in a loop until quality improves`,
      `Ignore it; the final reviewer will catch everything`,
    ],
    [0],
    `Contain degradation early so errors do not cascade through the workflow.`,
  ],
  [
    `G5Q9. Which are multi-agent recovery patterns? (Choose two.)`,
    [
      `Roll back to the last known good state, such as reverting merged changes`,
      `Escalate to a human in the loop to decide how to continue`,
      `Delete all logs so the workflow can start clean`,
      `Grant every agent admin rights to fix the issue`,
    ],
    [0, 1],
    `Rollback and human-in-the-loop are standard recovery patterns. Deleting evidence or widening permissions makes things worse.`,
  ],
  [
    `G5Q10. You want to add a security-review agent to an existing multi-agent workflow. What is the safest way?`,
    [
      `Define its role, inputs, outputs and permissions, and introduce it behind a clear handoff (for example, test it on a few runs before making it required)`,
      `Add it to production runs immediately with full permissions`,
      `Replace all existing agents with it`,
      `Let it decide its own role at runtime`,
    ],
    [0],
    `Adding agents is like adding a service: define the contract, limit permissions and roll it in gradually.`,
  ],
  [
    `G5Q11. A custom agent must be updated while runs that use it are still in progress. How do you avoid disrupting them?`,
    [
      `Version the agent definition (for example, change it through a reviewed pull request) so active runs finish on the old version and new runs use the new one`,
      `Edit the definition in place while runs are active`,
      `Cancel all running workflows first, every time`,
      `Keep two different agents with the same name`,
    ],
    [0],
    `Versioned, reviewed changes let new runs pick up the update without breaking runs already in progress.`,
  ],
  [
    `G5Q12. An agent is being retired. Which steps preserve auditability and continuity? (Choose two.)`,
    [
      `Keep its past logs, artifacts and definition history`,
      `Move its responsibilities to another agent or a human before removing it`,
      `Delete its history so nobody depends on it`,
      `Remove it in the middle of active runs`,
    ],
    [0, 1],
    `Retirement should hand over responsibilities and keep records, so past decisions remain auditable.`,
  ],

  // G6: Implement guardrails and accountability (10-15%)
  [
    `G6Q1. Why classify agent actions by operational, security and compliance risk?`,
    [
      `To right-size human intervention: low-risk actions run freely, high-risk ones need approval`,
      `To make every action require the same approval`,
      `To decide which model to use`,
      `To count how many tokens each action uses`,
    ],
    [0],
    `Risk classification lets you spend human attention where it matters and keep velocity elsewhere.`,
  ],
  [
    `G6Q2. Which autonomy assignment best balances delivery speed with compliance?`,
    [
      `Full autonomy for formatting and test fixes on a feature branch; required approval for production deployments and permission changes`,
      `Full autonomy for everything, including production deployments`,
      `Required approval for everything, including formatting`,
      `No agent use at all`,
    ],
    [0],
    `Autonomy levels follow risk. Reversible, contained actions get more autonomy; irreversible or sensitive ones keep humans involved.`,
  ],
  [
    `G6Q3. Which actions typically require human judgment? (Choose two.)`,
    [
      `Merging a change that affects authentication or billing logic`,
      `Accepting a new third-party license into the product`,
      `Renaming a local variable in a feature branch`,
      `Fixing a typo in a code comment`,
    ],
    [0, 1],
    `Security-sensitive and legal or compliance decisions need human judgment. Trivial, reversible edits do not.`,
  ],
  [
    `G6Q4. An agent tries to commit an API key to the repository. Which guardrail should stop it?`,
    [
      `Secret scanning push protection, which blocks the push`,
      `A note in the README asking agents not to commit secrets`,
      `Raising the agent's temperature`,
      `Disabling code review`,
    ],
    [0],
    `Block policy violations with enforced controls. Push protection rejects pushes that contain detected secrets.`,
  ],
  [
    `G6Q5. Which measures enforce least privilege for agents? (Choose two.)`,
    [
      `Give each agent only the tools and repository access its task needs`,
      `Run agents in isolated execution contexts with restricted network access`,
      `Share one admin token across all agents`,
      `Give agents organization owner rights to avoid permission errors`,
    ],
    [0, 1],
    `Least privilege limits the blast radius if an agent misbehaves or is manipulated, for example by prompt injection.`,
  ],
  [
    `G6Q6. How do you protect irreversible or compliance-sensitive changes, such as a production database migration, made by agents?`,
    [
      `Require explicit authorization through a controlled path, such as an environment with required reviewers in GitHub Actions`,
      `Let the agent run the migration whenever tests pass`,
      `Ask the agent to double-check its own work`,
      `Run the migration first and review afterwards`,
    ],
    [0],
    `Irreversible actions need a gate the agent cannot bypass. Deployment environments with required reviewers provide that gate.`,
  ],
  [
    `G6Q7. A team requires manual approval for every agent action, and delivery has slowed sharply. What should they do?`,
    [
      `Remove approvals that do not materially reduce risk and keep them for high-risk actions`,
      `Remove all approvals`,
      `Add more approvers to each step`,
      `Stop using agents`,
    ],
    [0],
    `Approvals have a cost. Keep the ones that reduce real risk and drop the ones that only slow delivery.`,
  ],
  [
    `G6Q8. Which built-in protections does Copilot cloud agent apply to its own pull requests? (Choose two.)`,
    [
      `The developer who asked Copilot to create the pull request cannot approve it under required reviews`,
      `GitHub Actions workflows on its pull request do not run until someone with write access approves them`,
      `It merges automatically once tests pass`,
      `It can bypass branch protection rules`,
    ],
    [0, 1],
    `These controls keep a human in the loop: an independent review and approval before CI runs agent-written code.`,
  ],
];

export const gh600Cards: Flashcard[] = sourceQuestions.map(
  ([question, choices, correctIndexes, explanation]) => ({
    id: `gh600-${question.slice(0, question.indexOf("."))}`,
    subject: "GH-600",
    question,
    choices,
    answers: correctIndexes.map((correctIndex) => choices[correctIndex]),
    ...(explanation !== undefined && { explanation }),
  }),
);
