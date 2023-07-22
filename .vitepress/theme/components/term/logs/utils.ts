import { Pipeline, Step, StepOrParallel, Verbosity } from "pipelight";
import { h } from "vue";
import { VNode } from "vue/types";

export const json_to_html = (
  pipeline: Pipeline,
  verbosity: Verbosity
): VNode => {
  return h("div", { class: "pipeline", id: "pipeline" }, [
    draw_status(pipeline),
    draw_header(pipeline),
    draw_pipeline(pipeline)
  ]);
};

const draw_status = (pipeline: Pipeline): VNode => {
  const node = h("div", { class: "flex status", id: "pipeline_header" }, [
    h("div", {
      class: "inline capitalize",
      innerHTML: `● ${pipeline.status}`
    }),
    h("div", { class: "secondary", innerHTML: ` - ${pipeline.event.date}` })
  ]);
  return node;
};

const draw_header = (pipeline: Pipeline): VNode => {
  const node = h("div", { class: "header", id: "pipeline_header" }, [
    h("div", {
      class: "secondary",
      innerHTML: `branch: ${pipeline.event.trigger.branch}`
    }),
    h("div", {
      class: "secondary",
      innerHTML: `tag: ${pipeline.event.trigger.tag}`
    }),
    h("div", {
      class: "secondary",
      innerHTML: `action: ${pipeline.event.trigger.action}`
    })
  ]);
  return node;
};

const draw_pipeline = (pipeline: Pipeline): VNode => {
  const node = h("div", { class: "pipeline" }, [
    h("div", { innerHTML: `pipeline: ${pipeline.name}` }),
    h("div", draw_steps_or_parallels(pipeline.steps))
  ]);
  return node;
};
const draw_steps_or_parallels = (steps: StepOrParallel): VNode => {
  const nodes: VNode[] = [];
  for (let step of steps) {
    nodes.push(h("li", draw_step_or_parallel(step)));
  }
  return h("ul", nodes);
};

const draw_parallel = (parallel: Parallel): VNode => {
  const steps: VNode[] = [];
  for (let step of parallel.steps) {
    steps.push(draw_step(step));
  }
  return h("div", [
    h("li", { innerHTML: "parallel", id: "parallel_step" }),
    [h("ul", { id: "pipeline_step" }, steps)]
  ]);
};

const draw_step = (step: Step): VNode => {
  return h(
    "div",
    {
      id: "pipeline_command"
    },
    [
      h("div", { innerHTML: `step: ${step.name}` }),
      h("ul", draw_commands(step.commands))
    ]
  );
};
const draw_step_or_parallel = (stepOrParallel: StepOrParallel): VNode => {
  if ("steps" in stepOrParallel) {
    return draw_parallel(stepOrParallel);
  } else {
    return draw_step(stepOrParallel);
  }
};

const draw_commands = (commands: Command[]) => {
  const cmd_nodes: VNode[] = [];
  for (let command of commands) {
    cmd_nodes.push(h("li", { innerHTML: command.process.state.stdin }));
  }
  return h("ul", { id: "pipeline_command" }, cmd_nodes);
};
