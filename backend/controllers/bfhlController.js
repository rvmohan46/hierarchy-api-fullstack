const { parseInput, buildGroups, buildTree } = require('../utils/tree');

const USER_ID = 'mohan_04062006';
const EMAIL_ID = 'mv5273@srmist.edu.in';
const COLLEGE_ROLL_NUMBER = 'RA2311026010404';

function handleAnalyze(req, res) {
  const { data } = req.body;
  if (!Array.isArray(data)) {
    return res.status(400).json({ error: 'data must be an array' });
  }

  const { validEdges, invalidEntries, duplicateEdges } = parseInput(data);
  const hierarchies = [];

  if (validEdges.length > 0) {
    const { groups } = buildGroups(validEdges);

    for (const groupNodes of groups) {
      const result = buildTree(groupNodes, validEdges);
      const entry = {
        root: result.root,
        tree: result.tree,
      };
      if (result.hasCycle) {
        entry.has_cycle = true;
      } else {
        entry.depth = result.depth;
      }
      hierarchies.push(entry);
    }

    hierarchies.sort((a, b) => a.root.localeCompare(b.root));
  }

  const nonCyclic = hierarchies.filter((h) => !h.has_cycle);
  const cyclic = hierarchies.filter((h) => h.has_cycle);

  let largestTreeRoot = '';
  if (nonCyclic.length > 0) {
    const sorted = [...nonCyclic].sort((a, b) => {
      if (b.depth !== a.depth) return b.depth - a.depth;
      return a.root.localeCompare(b.root);
    });
    largestTreeRoot = sorted[0].root;
  }

  const summary = {
    total_trees: nonCyclic.length,
    total_cycles: cyclic.length,
    largest_tree_root: largestTreeRoot,
  };

  res.json({
    user_id: USER_ID,
    email_id: EMAIL_ID,
    college_roll_number: COLLEGE_ROLL_NUMBER,
    hierarchies,
    invalid_entries: invalidEntries,
    duplicate_edges: duplicateEdges,
    summary,
  });
}

function handleHealthCheck(req, res) {
  res.json({ status: 'ok', message: 'BFHL API is up. Use POST /bfhl.' });
}

module.exports = { handleAnalyze, handleHealthCheck };
