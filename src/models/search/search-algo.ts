import Graph from "@models/graph/graph";

enum SolutionState {
  Searching,
  PathFound,
  NoPath,
}

// Required functionality:
//   Some way to pass a graph
//   Ability to take only one search step at a time
//     return the changes made to internal state during the step
//     step: one subsection of a full search cycle (ie. getting neighbors)
//     jump: A full cycle of the search loop (ie. getting neighbors, checking if they're searched, adding them to the frontier)
//   Get the path to any given searched vertex
//   Get current solution status (searching, found path, or no path)
//   Access to internal status of the algorithm.
//     ie. frontier and searched for BFS/DFS
//     frontier, searched, f(n), g(n), h(n) for A*
//     Temperature for simulated annealing
interface GraphSearchAlgo<
  VertexType,
  VertexValueType,
  GraphType extends Graph<VertexType, VertexValueType>,
  VertexMetaData,
  SearchState
> {
  graph: GraphType;

  step(): Array<VertexType>;
  jump(): Array<VertexType>;

  getVertexData(vertex: VertexType): VertexMetaData;
  currentPathTo(vertex: VertexType): Array<VertexType> | null;

  getSearchState(): SearchState;
  getSolutionState(): SolutionState;
}

export type { SolutionState, GraphSearchAlgo };
