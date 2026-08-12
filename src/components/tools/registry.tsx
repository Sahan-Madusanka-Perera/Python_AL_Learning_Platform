"use client";

import type { WidgetId } from "@/lib/types";
import { StructureChartBuilder } from "./StructureChart";
import { SortVisualiser, SearchVisualiser } from "./widgets/algorithms";
import { BitwiseLab, OperatorPrecedence, DatatypeInspector } from "./widgets/operators";
import {
  ProblemSolvingCycle,
  GenerationTimeline,
  ParadigmExplorer,
  TranslatorLab,
  IdeTour,
} from "./widgets/concepts";
import {
  ControlFlowVisualiser,
  LoopVisualiser,
  ScopeVisualiser,
  DataStructureLab,
  FileLab,
  SqlLab,
  FlowchartBuilder,
} from "./widgets/labs";

type WidgetComponent = React.ComponentType<Record<string, never> | { mode?: string }>;

const REGISTRY: Record<WidgetId, WidgetComponent> = {
  "problem-solving-cycle": ProblemSolvingCycle,
  "structure-chart-builder": StructureChartBuilder,
  "flowchart-builder": FlowchartBuilder,
  "trace-table": ControlFlowVisualiser,
  "paradigm-explorer": ParadigmExplorer,
  "translator-lab": TranslatorLab,
  "ide-tour": IdeTour,
  "datatype-inspector": DatatypeInspector,
  "operator-precedence": OperatorPrecedence,
  "bitwise-lab": BitwiseLab,
  "control-flow-visualiser": ControlFlowVisualiser,
  "loop-visualiser": LoopVisualiser,
  "scope-visualiser": ScopeVisualiser,
  "data-structure-lab": DataStructureLab,
  "file-lab": FileLab,
  "sql-lab": SqlLab,
  "search-visualiser": SearchVisualiser,
  "sort-visualiser": SortVisualiser,
  "generation-timeline": GenerationTimeline,
};

export function Widget({
  id,
  props,
}: {
  id: WidgetId;
  props?: Record<string, unknown>;
}) {
  const Component = REGISTRY[id];
  if (!Component) return null;
  return <Component {...(props as { mode?: string })} />;
}

/** Everything shown on the standalone toolbox page. */
export const TOOLBOX: {
  id: WidgetId;
  name: string;
  blurb: string;
  levels: string[];
  icon: string;
}[] = [
  {
    id: "problem-solving-cycle",
    name: "Problem-solving cycle",
    blurb: "The four stages, and what to ask yourself in each one",
    levels: ["9.1"],
    icon: "Lightbulb",
  },
  {
    id: "structure-chart-builder",
    name: "Structure chart builder",
    blurb: "Decompose a system and rearrange the modules",
    levels: ["9.2"],
    icon: "Network",
  },
  {
    id: "flowchart-builder",
    name: "Flow chart builder",
    blurb: "The six standard symbols, and a chart you can build",
    levels: ["9.3"],
    icon: "GitBranch",
  },
  {
    id: "control-flow-visualiser",
    name: "Control structure tracer",
    blurb: "Step through sequence, selection and nesting",
    levels: ["9.3", "9.8"],
    icon: "Split",
  },
  {
    id: "generation-timeline",
    name: "Language generations",
    blurb: "1GL to 5GL with real code from each",
    levels: ["9.4"],
    icon: "Milestone",
  },
  {
    id: "paradigm-explorer",
    name: "Paradigm explorer",
    blurb: "Imperative and declarative, side by side",
    levels: ["9.4"],
    icon: "Languages",
  },
  {
    id: "translator-lab",
    name: "Compiler vs interpreter",
    blurb: "Run the same faulty program both ways",
    levels: ["9.5"],
    icon: "RefreshCw",
  },
  {
    id: "ide-tour",
    name: "Inside an IDE",
    blurb: "Editor, translator and debugger",
    levels: ["9.6"],
    icon: "MonitorSmartphone",
  },
  {
    id: "datatype-inspector",
    name: "Data type inspector",
    blurb: "What Python calls each kind of value",
    levels: ["9.7"],
    icon: "Braces",
  },
  {
    id: "operator-precedence",
    name: "Precedence resolver",
    blurb: "Which operator runs first, and why",
    levels: ["9.7"],
    icon: "ListOrdered",
  },
  {
    id: "bitwise-lab",
    name: "Bitwise lab",
    blurb: "AND, OR, XOR and shifts, bit by bit",
    levels: ["9.7"],
    icon: "Binary",
  },
  {
    id: "loop-visualiser",
    name: "Loop laboratory",
    blurb: "for, while, nested, break and continue",
    levels: ["9.8"],
    icon: "Repeat",
  },
  {
    id: "scope-visualiser",
    name: "Scope & lifetime",
    blurb: "Watch local variables appear and vanish",
    levels: ["9.9"],
    icon: "Package",
  },
  {
    id: "data-structure-lab",
    name: "Data structure lab",
    blurb: "Strings, lists, tuples and dictionaries",
    levels: ["9.10"],
    icon: "Boxes",
  },
  {
    id: "file-lab",
    name: "File system",
    blurb: "Create real files and inspect them",
    levels: ["9.11"],
    icon: "FileText",
  },
  {
    id: "sql-lab",
    name: "SQL console",
    blurb: "SELECT, WHERE, ORDER BY, UPDATE, DELETE",
    levels: ["9.12"],
    icon: "Database",
  },
  {
    id: "search-visualiser",
    name: "Sequential search",
    blurb: "Count the comparisons as it hunts",
    levels: ["9.13"],
    icon: "Search",
  },
  {
    id: "sort-visualiser",
    name: "Bubble sort",
    blurb: "Watch each pass bubble a value to the end",
    levels: ["9.13"],
    icon: "ArrowUpDown",
  },
];
