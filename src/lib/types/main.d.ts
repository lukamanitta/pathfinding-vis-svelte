declare namespace Path {
  export interface Node {
    position: Point;
    weight: number;
    isStartNode: boolean;
    isEndNode: boolean;
    isWall: boolean;
    visited: boolean;
    previousNode?: Node;
  }

  export interface Point {
    x: number;
    y: number;
  }
}
