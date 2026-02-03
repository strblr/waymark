import { useState, useEffect, useMemo } from "react";
import type { Route, Match } from "waymark";
import { styles } from "../styles";
import { ChevronDown, ChevronRight } from "./icons";

interface RouteTreeProps {
  routes: ReadonlyArray<Route>;
  currentMatch: Match | null;
  selectedRoute: Route | null;
  onSelectRoute: (route: Route) => void;
}

interface RouteNode {
  key: string;
  route: Route;
  children: RouteNode[];
  navigable: boolean;
}

export function RouteTree({
  routes,
  currentMatch,
  selectedRoute,
  onSelectRoute
}: RouteTreeProps) {
  const activeSet = useMemo(() => {
    const set = new Set<Route>();
    if (currentMatch) {
      for (let r: Route | undefined = currentMatch.route; r; r = r._._) {
        set.add(r);
      }
    }
    return set;
  }, [currentMatch]);

  const tree = useMemo(() => {
    const navigableSet = new Set<Route>(routes);
    const nodeMap = new Map<Route, RouteNode>();
    const roots: RouteNode[] = [];

    for (let i = 0; i < routes.length; i++) {
      const route = routes[i];
      const chain: Route[] = [];
      for (let r: Route | undefined = route; r; r = r._._) {
        chain.unshift(r);
      }
      for (let j = 0; j < chain.length; j++) {
        const r = chain[j];
        let node = nodeMap.get(r);
        if (!node) {
          node = {
            key: `${i}-${j}`,
            route: r,
            children: [],
            navigable: navigableSet.has(r)
          };
          nodeMap.set(r, node);
        }
        if (j === 0) {
          if (!roots.includes(node)) {
            roots.push(node);
          }
        } else {
          const parent = nodeMap.get(chain[j - 1])!;
          if (!parent.children.includes(node)) {
            parent.children.push(node);
          }
        }
      }
    }

    const sort = (nodes: RouteNode[]) => {
      nodes.sort((a, b) => a.route._.pattern.localeCompare(b.route._.pattern));
      nodes.forEach(n => sort(n.children));
    };
    sort(roots);

    return roots;
  }, [routes]);

  return (
    <div>
      {tree.map(node => (
        <RouteTreeNode
          key={node.key}
          node={node}
          depth={0}
          activeRoute={currentMatch?.route}
          activeSet={activeSet}
          selectedRoute={selectedRoute}
          onSelect={onSelectRoute}
        />
      ))}
    </div>
  );
}

interface RouteTreeNodeProps {
  node: RouteNode;
  depth: number;
  activeRoute?: Route;
  activeSet: Set<Route>;
  selectedRoute: Route | null;
  onSelect: (route: Route) => void;
}

function RouteTreeNode({
  node,
  activeRoute,
  activeSet,
  depth,
  selectedRoute,
  onSelect
}: RouteTreeNodeProps) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = node.children.length > 0;
  const selected = selectedRoute === node.route;
  const active = activeSet.has(node.route);
  const leafActive = activeRoute === node.route;
  const status = leafActive ? "active" : active ? "matched" : "inactive";

  useEffect(() => {
    if (active && hasChildren) setExpanded(true);
  }, [active, hasChildren]);

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={() => onSelect(node.route)}
        style={styles.routeTreeItem({ selected, active: leafActive, depth })}
      >
        <button
          tabIndex={hasChildren ? 0 : -1}
          aria-label={expanded ? "Collapse" : "Expand"}
          style={styles.expandButton(hasChildren)}
          onClick={e => {
            e.stopPropagation();
            setExpanded(!expanded);
          }}
        >
          {expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        </button>
        <span style={styles.routeIndicator(status)} />
        <code style={styles.routeTreePattern(node.navigable)}>
          {formatPattern(node.route)}
          {!node.navigable && (
            <span style={styles.routeTreeLabel}>(layout)</span>
          )}
        </code>
      </div>
      {expanded &&
        node.children.map(child => (
          <RouteTreeNode
            key={child.key}
            node={child}
            depth={depth + 1}
            activeRoute={activeRoute}
            activeSet={activeSet}
            selectedRoute={selectedRoute}
            onSelect={onSelect}
          />
        ))}
    </>
  );
}

function formatPattern(route: Route): string {
  const pattern = route._.pattern;
  if (pattern === "/") return "/";
  const parentPattern = route._._?._.pattern;
  if (!parentPattern) return pattern;
  return pattern.substring(parentPattern.length);
}
