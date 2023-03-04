# Pipelight

A Lightweight CI/CD tool.

Write pipelines in Javascript.
And trigger them automatically on git action.

[Full Documentation](https://pipelight.areskul.com) in progress.

## What it is.

A Rust program that execute "js strings parsed as bash commands" on a git event.

## Motivation

### Lazy

Config is written in Js so lots of loops and variables can be used
to end the struggle with CI/CD pipelines written in configuration optimised languages.

### Frugal Power User

I've been working with quite small servers, that struggle to build docker images, forget about kubernetes, graphana and so on.
But I have local powerful computers.
Pipelight allows me to git-push from a machine, build on another, and send the result on my tiny server, so I don't have to spend much in Cloud ressources.

### Heavy work

When I need to deploy a machine and install and configure everything to deploy my apps in different envs..
I use it with docker, ansible, vagrant and others.
It becomes pretty simple to share variables/env between tools and one click full deployement.

## Install

Package only available on Arch linux.
(Available soon on Debian/Ubuntu and Fedora)

Install from the AUR

```sh
paru -S pipelight
```

Or from source

```sh
git clone <this_repo>
cd pipelight
cargo build --release
cp target/release/pipelight* /<my_bin_directory>/
```

---

## TL;DR

If you're too "zero attention genZ tiktok user" to go further in the documentation.
Just read the [USAGE](#USAGE) section and rush to the CLI.
It will yell a few times until your config file is good (don't forget to increase verbosity to debug).
But in the end it will run smooth.
Enjoy!

In short:

Pipelight is easy to install, fast, and usable on every project.

---

# Usage

## Configuration example

Create a config file at the root of your project

```ts
//pipelight.config.ts
const config = {
  pipelines: [
    {
      name: "my_pipeline",
      steps: [
        {
          name: "list working directory",
          commands: ["ls -alh"]
        },
        {
          name: "get working directory",
          commands: ["pwd"]
        }
      ]
    }
  ]
};
export default config;
```

List pipelines defined in config file

```sh
pipelight ls
```

or

```sh
pipelight ls -vvvv
```

Trigger a specific pipeline execution

```sh
pipelight run my_pipeline
```

Pretty print the pipeline status

```sh
pipelight logs
```

/// Insert log screenshot

Verbosity can be increased

```sh
pipelight logs -vvvv
```

Abort pipeline execution

```sh
pipelight stop my_pipeline
```

## Triggers

Works better in a Git repo.

```sh
git init
```

```mjs
//pipelight.config.mjs
const config = {
  pipelines: [
    {
      name: "automatic",
      triggers: [
        {
          actions: ["pre-push", "pre-commit"],
          branches: ["master"]
        }
      ]
    }
  ]
};
export default config;
```

Define triggers as combinations of branch-name and git-hooks.

# Documentation

## Types

The only constraint of pipelight is to "default export" an Object of type Config.
The second only constraint is that different Pipelines can't have the same name.

Here "?" means optionnal property in Typescript

```ts
type Config {
  pipelines?: [Pipeline]
}
type Pipeline {
  name: String, \\ Must be
  steps: [Step]
  triggers?: [Trigger]
}
type Step {
  command: [String]
}

struct Trigger {
  branches: [String],
  actions?: [Hook],
}

eum Hook {
  "pre-push",
  "pre-commit",
    ...
  // every git-hook
}
```

For the sake of readability,
it is a simplified object that omit success/failure/abortion callbacks and parallelism special types.

## How it works

Think of it as a bash wrapper.

When we first deploy a project we quickly edit some raw bash scripts.
It's clearly the fastest way to test.

```sh
//deploy.sh
vitest
vite build
rsync local_files to_my_remote_server
```

But at some point, this method lakes verbosity, and automation...

Just put your commands into a Pipeline object.

```mjs
//pipelight.config.mjs
const config = {
  pipelines: [
    {
      name: "deploy",
      steps: [
        {
          name: "test",
          commands: ["vitest"]
        },
        {
          name: "build",
          commands: ["vite build"]
        },
        {
          name: "send",
          commands: ["rsync local_files to_my_remote_server"]
        }
      ]
    }
  ]
};
export default config;
```

Add triggers, appreciate logs, and bettern your deployment scripts.

## Why another CICD tool ?

The need of something that keep it simple but allows for the great flexibility.

Pipelight does not use neither secrets nor plugins.
It directly loads your local environnement, so you can use your user ssh configuration, aliases and commands,
so you can easily couple it with Ansible, docker, Vagrant...

It takes Config as Code to another extend: Code as Config as Code!

### The power of Javascript (Code as configuration)

Javascrip is very good at writting object.
You can write functions in javascript to create multiple pipelines in a breeze.
Pipeline combines the speed and security of Rust with the easy scripting of Javascript.

## Why so fast ?

Pipelight is written in Rust and tightly coupled to linux and git.
It doesn't reinvent the wheel by making cumbersom event listeners, secrets or plugins.
Only git-hooks and bash commands with syntaxic sugar.

### Terminal friendly

Deploy, Backup, Restore... without living your terminal.

# Master the Cli

Pipeline inspection

```sh
pipelight ls <pipeline_name>
```

or
in depth json inspection

```sh
pipelight ls --json <pipeline_name>
```

For long pipelines, you may want to redirect the output to your favorite reader.

```sh
pipelight ls --json <pipeline_name> | less
```

# Tips

## Make it soft on the eye

For the sake of reusability and when you need to deploy in multiple evironnements.

Overuse string interpolation!

```ts
//pipelight.config.ts
const params = {
  remote: {
    domain: "myserver.com",
    path: "/remote/directory"
  },
  local: {
    path: "/my/build/directory"
  }
};

const config = {
  pipelines: [
    {
      name: "deploy",
      steps: [
        {
          name: "send files to server",
          commands: [
            `scp -r ${params.local.path} ${params.remote.domain}@${params.remote.path}`
          ]
        }
      ]
    }
  ]
};
export default config;
```

Overuse string interpolation, and parameter destructuring.

```ts
//pipelight.config.ts
const params = {
  remote: {
    domain: "myserver.com",
    path: "/remote/directory"

  },
  local: {
    path: "/my/build/directory"
  }
};

const makeConfig = ({remote, local}) = > {
  pipelines: [
    {
      name: "deploy",
      steps: [
        {
          name: `send files to ${remote.domain}`,
          commands: [
            `scp -r ${local.path} ${remote.domain}@${remote.path}`
          ],
        },
      ],
    },
  ],
};

const config = makeConfig(params)

export default config;
```

## Split your config

Split your config into multiple files and separate concerns.
Overuse string interpolation, parameter destructuring and import/export ESM synthax.

Export here

```ts
//.pipelight/config/default.ts

const makeDefaultConfig = ({remote, local}) = > {
  pipelines: [
    {
      name: "deploy",
      steps: [
        {
          name: `send files to ${remote.domain}`,
          commands: [
            `scp -r ${local.path} ${remote.domain}@${remote.path}`
          ],
        },
      ],
    },
  ],
};

export {
  makeDefaultConfig
}

```

And import here

```ts
//pipelight.config.ts

import { makeDefaultConfig } from ".pipelight/config/default.mjs";

const params = {
  remote: {
    domain: "myserver.com",
    path: "/remote/directory"
  },
  local: {
    path: "/my/build/directory"
  }
};

const config = makeConfig(params);

export default config;
```

## Pipeline Duration computation

While increasing log verbosity, you may encouter some duration for each pipeline step and commands

This is the time it took for your command to process plus:

- Commands subprocess/shell spawning time. (around 5ms on good/average machines)

- and last but not least it takes into account the code that wraps those commands.

  Pipelight code(logging, duration)
  Your command
  Pipelight code

# CookBook / Deployement startegies

In the end it's just JS, either it is functionnal programming or object oriented,
you just have to return an object that satisfies the Config type.

## Dummy deployement

When you want to put stuffs from your computer to your server

```ts
//pipelight.config.ts
const config = {
  pipelines: [
    {
      name: "deploy",
      steps: [
        {
          name: "send files to server",
          commands: [
            "rsync local_files to_my_remote_server"
            "scp -r myfiles to_remote"
          ],
        },
      ],
    },
  ],
};
export default config;
```

## Server Side deployement

When you work in TEAM and want the server to deploy code.

### On your local

Creat a mirror repository.

```sh
git push --mirror ssh://username@mydomain.com/new-repository.git
```

### On your server(s)

Install pipelight on your server and adapt the hooks.

```mjs
//pipelight.config.mjs
      ...
      triggers: [
        {
          actions: ["pre-receive", "update", "post-receive"],
          branches: ["master"],
        },
      ],
```

## With remote Docker

Build docker images where the power resides, which mean locally, and not on remote tiny server.

```ts
//pipelight.config.ts
const params = {
  remote: "myremote.com"
  image: {
    name: "my_app",
    port:{
      in: 8080 ,
      out:80
    }
  }
}
const config = {
  pipelines: [
    {
      name: "deploy",
      steps: [
        {
          name: "build image",
          commands: [
            "rsync local_files to_my_remote_server"
            "scp -r myfiles to_remote"
          ],
        },
      ],
    },
  ],
};
export default config;
```
