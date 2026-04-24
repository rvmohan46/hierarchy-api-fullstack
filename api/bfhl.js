const { parseInput, buildGroups, buildTree } = require('../backend/utils/tree');

const USER_ID = 'mohan_04062006';
const EMAIL_ID = 'mv5273@srmist.edu.in';
const COLLEGE_ROLL_NUMBER = 'RA2311026010404';

function formatResponse({ validEdges, invalidEntries, duplicateEdges }) {
  const hierarchies = [];

  if (validEdges.length > 0) {
    const { groups } = buildGroups(validEdges);

    for (const groupNodes of groups) {
      const result = buildTree(groupNodes, validEdges);
      const entry = { root: result.root, tree: result.tree };
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

  return {
    user_id: USER_ID,
    email_id: EMAIL_ID,
    college_roll_number: COLLEGE_ROLL_NUMBER,
    hierarchies,
    invalid_entries: invalidEntries,
    duplicate_edges: duplicateEdges,
    summary,
  };
}

module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { data } = req.body;
  if (!Array.isArray(data)) {
    res.status(400).json({ error: 'data must be an array' });
    return;
  }

  const parsed = parseInput(data);
  res.status(200).json(formatResponse(parsed));
};
