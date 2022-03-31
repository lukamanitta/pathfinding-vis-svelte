import type { Point } from './Point';

export interface Node {
  position: Point;
  weight: number;
  isStartNode: boolean;
  isEndNode: boolean;
  isWall: boolean;
  visited: boolean;
  previousNode?: Node;
}
