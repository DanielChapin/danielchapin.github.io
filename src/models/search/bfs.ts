import Graph from "@models/graph/graph";
import { GraphSearchAlgo, SolutionState } from "./search-algo";

type BFSVertexMeta = {
  searched: boolean;
  frontier: boolean;
};

enum BFSSearchState {
  PopFrontier,
  TestGoal,
  GetNeighbors,
  CullNeigbors,
  AddNeighborsToFrontier,
}

type BFSGoalTest<VertexType> = (vertex: VertexType) => boolean;

class BFSAlgo<VertexType extends Object, VertexValueType>
  implements
    GraphSearchAlgo<
      VertexType,
      VertexValueType,
      Graph<VertexType, VertexValueType>,
      BFSVertexMeta,
      BFSSearchState
    >
{
  graph: Graph<VertexType, VertexValueType>;
  private goalTest: BFSGoalTest<VertexType>;

  private state: BFSSearchState;
  // Unfortunately, because JS is cringe, we can't use VertexType -> VertexType
  // because they are not certainly comprable by value.
  private predecessor: Map<String, String>;
  private frontier: Array<VertexType>;

  constructor(
    graph: Graph<VertexType, VertexValueType>,
    start: VertexType,
    goalTest: BFSGoalTest<VertexType>
  ) {
    this.graph = graph;
    this.goalTest = goalTest;

    this.state = BFSSearchState.PopFrontier;

    this.frontier = [start];
    this.predecessor = new Map();
    this.predecessor.set(start.toString(), "");
  }

  step(): VertexType[] {
    throw new Error("Method not implemented.");
  }
  jump(): VertexType[] {
    throw new Error("Method not implemented.");
  }
  getVertexData(vertex: VertexType): BFSVertexMeta {
    throw new Error("Method not implemented.");
  }
  currentPathTo(vertex: VertexType): VertexType[] | null {
    throw new Error("Method not implemented.");
  }
  getSearchState(): BFSSearchState {
    throw new Error("Method not implemented.");
  }
  getSolutionState(): SolutionState {
    throw new Error("Method not implemented.");
  }
}
