# Composition Helpers <Badge type="warning" text="beta" />

Going further into these sections, we will maximise Composition Helpers usage.

Helpers are **Javascript/Typescript** functions that will do some heavy lift for more complex pipeline definition.

This design pattern has been greatly inspired by the [Vue.js](https://vuejs.org/) framework.

::: tip
If needed, upgrade helpers to latest version.

```sh
deno cache --reload pipelight.ts
```

:::

You can use a function instead of an object to define a pipeline

You've been use to define objects with the option API.

```ts
const my_pipeline = {
  name: "composition",
  steps: my_steps
};
```

With the composition API, those objects can be created through functions.

```ts
const my_pipeline = pipeline("composition", () => [...my_steps]);
```

You just need to import the helpers at the top of your file.

```ts
import type { Config, Pipeline } from "https://deno.land/x/pipelight/mod.ts";
import { pipeline, step, ssh } from "https://deno.land/x/pipelight/mod.ts";
```

::: tip

[See the complete type definition on DenoLand](https://deno.land/x/pipelight/mod.ts)

:::

Here is a complete working example.

```ts
import { pipeline, step } from "https://deno.land/x/pipelight/mod.ts";

const my_commands = ["cd", "ls"];

const compositionPipe = pipeline("composition", () => [
  step("do something", () => my_commands),
  step("do something else", () => my_commands)
]);
```