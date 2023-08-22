<script setup>
import Example from '@components/Example.vue';
import Sheet from '@components/Sheet.vue';
import Schema from '@components/Schema.vue';
import Features from "@components/Features.vue";
</script>

# Introduction

## What is Pipelight ?

**It's a tiny command line tool that executes a list of tasks you provided in a configuration file.**

Written in Rust (90%) and Typescript (10%).

Perfect for:

- Small repetitive task automation;
- CICD (Continuous Integration & Continuous Deployment);
- Machine provisionning;
- Infrastructure creation.

::: warning

Pipelight is a relatively young software,
therefore it has some early features flaged as beta(yelow) and alpha(red).
Its few caveats are discussed into warning(yellow) and danger(red) containers
like this one.

:::

## The core concept

Pipelight ultimate goal is to automate your most boring tasks by enhancing **your** favorite tools.

The truth about the core of the tool is that it is absurdly simple.
**Pipelight only defines an execution worklow**, which is the order in which the commands will be executed
and what to do on the few possible exit status.

Basically, it **encapsulates your shell commands into another language** (Typescript, Javascript, Toml and Yaml)
and executes them in the given order.

Commands are put inside a Pipeline and grouped by Steps.

```rs
// A pipeline in pseudo code
Pipeline {
    Step {
        Command {
            // Bash string
            echo $PWD
        }
    }
}
```

Encapsulating bash commands into a programming language brings you:

- easy programming language abilities;
- automatic triggers;
- and verbose logging.

So what internally happens when you run a pipeline ?

1. First, the software reads the config file.

   -> Typescript is executed and return a JSON pipeline definition.

2. Then only, it processes the parsed pipeline definition.

   -> Pipelight spawns the commands into subprocesses while writting the outputs into log files.

<Schema/>

The pipeline is by default executed in the background and
you can check its status by printing the logs in your terminal.

## Delegate to the old fashioned tools.

Pipelight is light because it only implements basic functionnalities by delegating crucial functionnalities
to the appropriate specialized tools such as Git, Watchexec and Deno (typescript/javascript runtime).

<div class="flex justify-center">
    <img src="/images/ferris_playing_pipelight.png" alt="ferris_playing_with_cubes" class="sm">
</div>

See the core of Pipelight as Ferris (rust mascot) making the heavy lift.

- On the first hand, it uses Javascript/Typescript to **manipulate bash strings**.
- And on the other it uses Git as an **event detector**.

For every others subsidiary tasks, pipelight relays on popular rust crates (std, serde, rustix, watchexec, miette...).

## As close to the kernel as possible.

Pipelight uses the provided **kernel functions for process management**.

Beeing this tightly coupled to the Linux kernel allows us to have very few software internal code that could
disrupt processes execution without reporting.

Resulting in the most **highly verbose** and **transparent logs** achievable.

## Who is it for ?

**It is for every programmer that seeks fast and simple automation that can keep up to his needs and adapt quick**.

Beware! Simple doesn't mean simplistic.
It means that even complex and avant-gardist pipeline behaviors can be achived with a minimal overhead.

### Pragmatic Programmers

Pipelight ends the struggle with configuration optimised languages (YAML/TOML).

Instead of combining multiple keywords and flags, the pipeline logic can be written in Javascript/Typescript.
You can then define pipelines with concepts you are already comfortable with like variables, loops and functions.

### Frugal Power User

Decrease by two third the money spent in the Cloud by using local computing ressources.

You can push code from a machine, build on another,
and send the resulting archive on hosting servers.
It allows you to use the latent computing power where it resides
and drastically diminish cloud computing costs.

### Manianimous Builders

Glue your synergetic tools together within a pipeline (Libvirt, Docker, Ansible, pure Bash...).
It then becomes pretty simple to share variables and environments between them.

The result is you can dig out of the ground complete infrastructures,
deploy multiple virtual machines, containers, and provision them with different environments
with a uniq and on the fly configurable pipeline.

## For which tasks using Pipelight ?

### Software development

With a **single file** in your root directory, you can define pipelines that will run either
**client-side, server-side or both.**

#### Client side

On your computer, you can enable client side automation by using specific triggers (on `pre-push`, `pre-commit`...).

- **Enforce code quality**,

  You can write pipelines to test your code before pushing it to production branches.

- **Save cloud costs**,

  Make the **heavy computation locally**,
  Build and only send the resulting archive or image to your remote hosts.

#### Server side

Server side automation can be achieved by using server-side triggers (on update, pre-receive...).

- **Ease team work**,

  Trigger pipelines directly on the remote once git has resolved.
  Same as using a conventional cicd in cloud provider.

- **Better debugging**,

  Pipelight logs are verbose and easy to read.
  You won't ever miss a single byte of a pipeline execution.

  It displays the real commands as they are executed without suboptimal wrapper (the **good old stdin, stdout, stderr** and return statements).

### Other trivial usages

- Everyday tasks automation;
- Server provisionning;
- Run **heavy workloads, parallelize tasks** on your servers.

## Best features!

### Code in your config file.

As a pipeline gets complex, you want to add variables, conditions, loops and more.

While other tools are about static Configuration as Code,
Pipelight gets one step further and allows you to **code in your configuration file** to create reusable configuration blocks (with Typescript).
We may call it as Code as Configuration as Code 🥴.

### Terminal friendly (CLI) & Pretty logs

Run a pipeline and check logs **without living your terminal**.
Pipelight stays in the terminal, and is finally nothing more than a Command Line Tool/Interface.

```sh
# CLI feels like home
pipelight run
pipelight logs
```

### Quick Automation

Add triggers to your pipeline definition.
The pipeline will automatically run in the background on matching event (a triggering action and/or a git branch or tag).

```ts
triggers: [
  {
    actions: ["pre-push"],
    branches: ["master"],
  },
],
```
