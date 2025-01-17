<script setup lang="ts">
import { api } from "@utils/preferences.ts";
import Sync from '@components/Sync.vue';
import ASync from '@components/ASync.vue';
</script>

# Triggers (Automation)

Here is the part you were waiting for! What is the point of writting pipelines
if you still have to execute them by hand?

::: tip tl;dr 

Triggers are a **set of conditions** that can **instantly launch
multiple pipelines** when they are met.

:::

## Prerequesits

::: warning Triggers are opt-in

The configuration file was initially polled to enable required triggers. But
this has raised crucial concurrency issues. Until there is a fix, this feature
is disabled and ** triggers have to be explicitly enable from the command
line**.

:::

### Enable git hooks (Optional)

Most of triggers only work inside a Git repository. Be sure to initialize a repo
if you want to take advantage of them all.

```sh
git init
```

To enable git triggers (pipelight managed git hooks) on a fresh directory run:

```sh
pipelight enable git-hooks
```

::: danger

For now, this operation overwrites the `.git/hooks` folder. Be sure to move your
manually defined hooks elsewhere before enabling pipelight hooks.

:::

## Define pipeline triggers

**Make a combination of branches and actions for which to trigger the
pipeline.**

When triggers are added to a pipeline, the pipeline is not triggered until
triggering requirements are met. Which means you need to checkout to the allowed
branches or tags, and execute the allowed actions for the pipeline to run.

(debug): _When verbosity is increased, the CLI tells you what to do if
requirements are not met._

disable them with:

```sh
pipelight disable git-hooks.
```

Make a combination of branches and actions for which to trigger the pipeline.

<div v-if="api.compositions">
```ts
pipeline.add_trigger({
  branches: ["main"],
  actions: ["pre-push"],
});
```

</div>
<div v-else>

```ts
pipeline.triggers =
  {
    branches: ["main"],
    actions: ["pre-push"],
  },
];
```

</div>

```ts
type Trigger = TriggerBranch | TriggerTag;

type TriggerBranch = { branches?: string[]; actions?: Action[] };
type TriggerTag = { tags?: string[]; actions?: Action[] };
```

Then, add triggers to your pipeline definition.

<div v-if="api.compositions">

```ts
//pipelight.ts
const my_pipeline = pipeline("test", () => [
  step("build", () => ["yarn install", "yarn build"]),
]).add_trigger({
  branches: ["main"],
  actions: ["pre-push"],
});
```

</div>
<div v-else>

```ts
//pipelight.ts
pipelines: [
  {
    name: "test",
    steps: [
      {
        name: "build",
        commands: ["yarn install", "yarn build"],
      },
    ],
    triggers: [
      {
        branches: ["main"],
        actions: ["pre-push"],
      },
    ],
  },
];
```

</div>

## Git environment (optional)

### Branch and Tags

Branches are your git project branches names (see: `git branch`). Tags are the
commits you made with `git tag -a "v0.8"` (see: `git tag`).

Tags are the tag you added the commits you want to release with
`git tag -a "v0.8"` (see: `git tag`).

Branch and Tag combinations are enhanced by **globbing** pattern matching.

<div v-if="api.compositions">

```ts
my_pipeline
  .add_trigger({
    branches: ["feature/*"],
    actions: ["pre-push"],
  })
  .add_trigger({
    tags: ["v*-dev"],
    actions: ["pre-commit"],
  });
```

</div>
<div v-else>

```ts
triggers: [
  {
    branches: ["feature/*"],
    actions: ["pre-push"],
  },
  {
    tags: ["v*-dev"],
    actions: ["pre-commit"],
  },
];
```

</div>

## Actions

Actions are named according to [git-hooks](https://githooks.com/) names, plus
special flags "manual","watch" and "blank".

```ts
export enum Action {
  // mail hooks
  ApplypatchMsg = "applypatch-msg",
  PreApplypatch = "pre-applypatch",
  PostApplypatch = "post-applypatch",
  SendemailValidate = "sendemail-validate",
  // client hooks
  PreCommit = "pre-commit",
  PreMergeCommit = "pre-merge-commit",
  PrepareCommitMsg = "prepare-commit-msg",
  CommitMsg = "commit-msg",
  PostCommit = "post-commit",
  // other client hooks
  PreRebase = "pre-rebase",
  PostCheckout = "post-checkout",
  PostMerge = "post-merge",
  PrePush = "pre-push",
  PostRewrite = "post-rewrite",
  PreReceive = "pre-receive",
  PreAutoGc = "pre-auto-gc",
  FsmonitorWatchman = "fsmonitor-watchman",
  PostIndexChange = "past-index-change",
  // p4
  P4Changelist = "p4-changelist",
  P4PrepareChangelist = "p4-prepare-changelist",
  P4PostChangelist = "p4-post-changelist",
  P4PreSubmit = "p4-pre-submit",
  // server-side hooks
  PreReceive = "pre-receive",
  Update = "update",
  ProcReceive = "proc-receive",
  PostReceive = "post-receive",
  PostUpdate = "post-update",
  RefrenceTransaction = "reference-transaction",
  PushToCheckout = "push-to-checkout",
  // special flags
  Manual = "manual",
  Watch = "watch",
  Blank = "blank",
}
```

### Git actions (Git-hooks)

Actions are named according to [git-hooks](https://githooks.com/) names, plus
special flags like `blank`,`manual` and `watch`.

::: warning

A pipeline whoes trigger has an action alone without specified branch is
triggered for every branches.

:::

### Special actions

#### On file change (Watch Flag)

```ts
actions: ["watch"];
```

Trigger pipelines on file change. Whether a file is created, deleted or modified
the pipeline is triggered.

You can ignore folders or files by declaring them inside the
`.pipelight_itignore` hidden file which stick to the .gitignore file
specifications.

#### Security (Manual Flag)

```ts
actions: ["manual"];
```

If you want to manually run a pipeline that has non-empty triggers, with the
command `pipelight run` you need to add the **special flag** `manual` to the
pipeline trigger's actions. This **avoids unintentionnal manual triggering**
aspecialy on critical production branches.

## Client-Server synchronisation

### with the blank flag

```ts
actions: ["blank"];
```

When you have pipelight installed **client and server side**. A push to the
(git)server triggers both client and server side pipelines simultaneously.

<Sync/>

What if you want to trigger a server side pipeline only **once a client side
pipeline has resolved**?

The first workaround is to force the pipeline to run in attach mode with the
`--attach` option by creating an intermediary `glue_pipeline`.

<div v-if="api.compositions">

```ts
// pipelight.ts
let glue_pipeline = pipeline("sync", () => [
  step("nested attached pipeline", () => [
    "pipelight run my_pipeline --attach",
  ]),
]);
```

</div>
<div v-else>

```ts
// pipelight.ts
let glue_pipeline = {
  name: "sync",
  steps: [{
    name: "nested attached pipeline",
    commands: [
      "pipelight run my_pipeline --attach",
    ],
  }],
};
```

</div>

A workaround is to send an ssh command to the server at some point in your
pipeline. `pipelight run <pipeline_name> --flag blank` or
`pipelight trigger --flag blank` to trigger the server side pipeline.

And add the required trigger to the pipeline to be executed server-side.

<div v-if="api.compositions">

```ts
// pipelight.ts
server_pipeline.add_trigger({
  action: ["blank"],
});
```

</div>
<div v-else>

```ts
// pipelight.ts
server_pipeline.triggers.push({
  action: ["blank"],
});
```

</div>

Emit the **trigger signal** from the client-side pipeline. Whether it be from a
fallback or from a regular pipeline step.

<div v-if="api.compositions">

```ts
// pipelight.ts
pipeline.on_success = step("sync", () => [
  ...ssh((host) => ["pipelight run server_side_pipeline --flag blank"]),
]);
```

</div>
<div v-else>

```ts
// pipelight.ts
pipeline.on_success = {
  name: "sync",
  commands: `ssh ${host} -C "pipelight run server_side_pipeline --flag blank"`,
};
```

</div>

and voilà, you have synced your pipelines.

<ASync/>

## Forced flags (Manually set trigger action)

Simulate a specific action to trigger associated pipelines.

```sh
pipelight trigger <action>
```

Or trigger a pipeline by simulating the appropriate action.

```sh
pipelight run --flag <action>
```

_You can use it for debugging purpose or simply as a way to create
unconventionnal pipelines._
