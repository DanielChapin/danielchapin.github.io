interface Graph<VertexType, VertexValueType> {
  adjacent(a: VertexType, b: VertexType): boolean;
  getNeighbors(vertex: VertexType): Array<VertexType>;
  getValue(vertex: VertexType): VertexValueType;
}

interface WeightedGraph<VertexType, VertexValueType>
  extends Graph<VertexType, VertexValueType> {
  edgeWeight(from: VertexType, to: VertexType): number | null;
}

export default Graph;
export type { WeightedGraph };
