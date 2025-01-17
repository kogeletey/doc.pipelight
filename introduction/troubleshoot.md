# Troubleshoot a pipeline (tips)

## Code debugging

Like for every Typescript and Javascript script,
at some point, you may want to check what contain some variable, the output of some functions, what happens inside your loops...
You can use `console.log()`, `console.debug()` , `console.error()` statements and every others
inside your config file.

The output will be silenced if you run the resulting pipelines with `pipelight <command>`.

But running the pipeline config file with Deno(the typescript/javascript runtime)
**displays your print statements without triggering any pipeline**.

```sh
# Lint file and display console statements.
deno run -A ./pipelight.ts
```

## Linting and Formatting

### Directly from your IDE

Pipelines can be written in Typescript, Javascript, Yaml or Toml.
You should set up your file editor/IDE to lint and format those languages.

### Using the CLI

For pipelines written in Typescript and Javascript,
Pipelight uses the **deno built in linter** and got you cover on every `pipelight <whatever_command>` or `deno run`.
For Yaml and Toml, Pipelight internally uses the rust specific crates to achieve the same result.

For example, if `pipelight ls` doesn't yell any error.
Your pipeline are exempt from error and ready to be tested/run.
