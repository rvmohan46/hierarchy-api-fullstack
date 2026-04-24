const VALID_EDGE_RE = /^([A-Z])->([A-Z])$/;

function parseInput(data) {
  const invalidEntries = [];
  const duplicateEdges = [];
  const seenEdges = new Set();
  const validEdges = [];

  for (const raw of data) {
    const entry = typeof raw === 'string' ? raw.trim() : String(raw).trim();
    if (!VALID_EDGE_RE.test(entry)) {
      invalidEntries.push(raw);
      continue;
    }

    const [, from, to] = entry.match(VALID_EDGE_RE);
    if (from === to) {
      invalidEntries.push(raw);
      continue;
    }

    const key = `${from}->${to}`;
    if (seenEdges.has(key)) {
      if (!duplicateEdges.includes(key)) {
        duplicateEdges.push(key);
      }
      continue;
    }

    seenEdges.add(key);
    validEdges.push({ from, to });
  }

  return { validEdges, invalidEntries, duplicateEdges };
}

function buildGroups(validEdges) {
  const parent = {};

  function find(node) {
    if (parent[node] === undefined) parent[node] = node;
    if (parent[node] !== node) parent[node] = find(parent[node]);
    return parent[node];
  }

  function union(a, b) {
    const ra = find(a);
    const rb = find(b);
    if (ra !== rb) parent[ra] = rb;
  }

  const allNodes = new Set();
  for (const { from, to } of validEdges) {
    allNodes.add(from);
    allNodes.add(to);
    union(from, to);
  }

  const groups = {};
  for (const node of allNodes) {
    const root = find(node);
    if (!groups[root]) groups[root] = new Set();
    groups[root].add(node);
  }

  return { groups: Object.values(groups).map((set) => [...set]) };
}

function buildTree(groupNodes, validEdges) {
  const nodeSet = new Set(groupNodes);
  const groupEdges = validEdges.filter((edge) => nodeSet.has(edge.from) && nodeSet.has(edge.to));

  const childParent = {};
  const adjList = {};
  groupNodes.forEach((node) => { adjList[node] = []; });

  for (const { from, to } of groupEdges) {
    if (childParent[to] !== undefined) continue;
    childParent[to] = from;
    adjList[from].push(to);
  }

  const roots = groupNodes.filter((node) => childParent[node] === undefined);
  if (roots.length === 0) {
    const root = [...groupNodes].sort()[0];
    return { root, tree: {}, hasCycle: true };
  }

  const root = roots.sort()[0];

  const visited = new Set();
  const inStack = new Set();
  let hasCycle = false;

  function dfs(node) {
    if (inStack.has(node)) {
      hasCycle = true;
      return;
    }
    if (visited.has(node)) return;
    visited.add(node);
    inStack.add(node);
    for (const child of adjList[node]) dfs(child);
    inStack.delete(node);
  }

  dfs(root);
  if (hasCycle) return { root, tree: {}, hasCycle: true };

  function buildNested(node) {
    const children = adjList[node] || [];
    const tree = {};
    children.forEach((child) => { tree[child] = buildNested(child); });
    return tree;
  }

  function calcDepth(node) {
    const children = adjList[node] || [];
    if (!children.length) return 1;
    return 1 + Math.max(...children.map(calcDepth));
  }

  return {
    root,
    tree: { [root]: buildNested(root) },
    depth: calcDepth(root),
    hasCycle: false,
  };
}

module.exports = { parseInput, buildGroups, buildTree };
