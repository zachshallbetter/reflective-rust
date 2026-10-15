//! Access-aware, deterministic context slicing for validated Compiler Semantic Graphs.

use reflective_rust_csg::{
    CompilerSemanticGraph, CsgEdge, CsgNode, GraphProvenance, ValidationError,
};
use reflective_rust_protocol::AccessLevel;
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use std::collections::{BTreeMap, BTreeSet, VecDeque};
use std::fmt;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum TraversalDirection {
    Undirected,
    Forward,
    Reverse,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct SliceOptions {
    pub radius: usize,
    pub direction: TraversalDirection,
    pub access: AccessLevel,
    pub max_nodes: Option<usize>,
}

impl Default for SliceOptions {
    fn default() -> Self {
        Self {
            radius: 1,
            direction: TraversalDirection::Undirected,
            access: AccessLevel::Public,
            max_nodes: None,
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct ContextSlice {
    pub target_id: String,
    pub radius: usize,
    pub direction: TraversalDirection,
    pub provenance: GraphProvenance,
    pub compiler_certified: bool,
    pub nodes: Vec<CsgNode>,
    pub edges: Vec<CsgEdge>,
    pub omitted_inaccessible_count: usize,
    pub slice_hash: String,
}

#[derive(Debug, PartialEq, Eq)]
pub enum SliceError {
    Validation(ValidationError),
    NodeLimitExceeded { limit: usize, attempted: usize },
    Serialization(String),
}

impl fmt::Display for SliceError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::Validation(e) => write!(f, "Validation error: {e:?}"),
            Self::NodeLimitExceeded { limit, attempted } => {
                write!(
                    f,
                    "Node limit exceeded: limit={limit}, attempted={attempted}"
                )
            }
            Self::Serialization(e) => write!(f, "Serialization error: {e}"),
        }
    }
}

impl std::error::Error for SliceError {}

impl From<ValidationError> for SliceError {
    fn from(e: ValidationError) -> Self {
        Self::Validation(e)
    }
}

/// Computes an access-aware, bounded context slice around a target node with custom options.
pub fn slice_with_options(
    graph: &CompilerSemanticGraph,
    target_id: &str,
    options: SliceOptions,
) -> Result<Option<ContextSlice>, SliceError> {
    graph.validate()?;

    let nodes_by_id: BTreeMap<&str, &CsgNode> = graph
        .nodes
        .iter()
        .map(|node| (node.id.as_str(), node))
        .collect();

    let Some(target) = nodes_by_id.get(target_id) else {
        return Ok(None);
    };

    if !options.access.permits(target.minimum_access) {
        return Ok(None);
    }

    let mut omitted_inaccessible_count = 0usize;

    // Build directed or undirected adjacency
    let mut adjacency: BTreeMap<&str, Vec<&str>> = BTreeMap::new();
    for edge in &graph.edges {
        let from_permitted = nodes_by_id
            .get(edge.from.as_str())
            .is_some_and(|n| options.access.permits(n.minimum_access));
        let to_permitted = nodes_by_id
            .get(edge.to.as_str())
            .is_some_and(|n| options.access.permits(n.minimum_access));
        let edge_permitted = options.access.permits(edge.minimum_access);

        if !from_permitted || !to_permitted || !edge_permitted {
            omitted_inaccessible_count += 1;
            continue;
        }

        match options.direction {
            TraversalDirection::Forward => {
                adjacency.entry(&edge.from).or_default().push(&edge.to);
            }
            TraversalDirection::Reverse => {
                adjacency.entry(&edge.to).or_default().push(&edge.from);
            }
            TraversalDirection::Undirected => {
                adjacency.entry(&edge.from).or_default().push(&edge.to);
                adjacency.entry(&edge.to).or_default().push(&edge.from);
            }
        }
    }

    let mut queue = VecDeque::from([(target_id, 0usize)]);
    let mut visited = BTreeSet::new();

    while let Some((id, depth)) = queue.pop_front() {
        if !visited.insert(id) {
            continue;
        }

        if let Some(limit) = options.max_nodes
            && visited.len() > limit
        {
            return Err(SliceError::NodeLimitExceeded {
                limit,
                attempted: visited.len(),
            });
        }

        if depth >= options.radius {
            continue;
        }

        if let Some(neighbors) = adjacency.get(id) {
            for neighbor in neighbors {
                if !visited.contains(neighbor) {
                    queue.push_back((neighbor, depth + 1));
                }
            }
        }
    }

    // Deterministic ordering: sorted by ID
    let mut slice_nodes: Vec<CsgNode> = graph
        .nodes
        .iter()
        .filter(|node| visited.contains(node.id.as_str()))
        .cloned()
        .collect();
    slice_nodes.sort_by(|a, b| a.id.cmp(&b.id));

    // Filter and sort edges connecting visited nodes
    let mut slice_edges: Vec<CsgEdge> = graph
        .edges
        .iter()
        .filter(|edge| {
            visited.contains(edge.from.as_str())
                && visited.contains(edge.to.as_str())
                && options.access.permits(edge.minimum_access)
        })
        .cloned()
        .collect();
    slice_edges
        .sort_by(|a, b| (&a.from, &a.to, &a.relationship).cmp(&(&b.from, &b.to, &b.relationship)));

    // Compute deterministic slice identity
    #[derive(Serialize)]
    struct SliceHashPayload<'a> {
        target_id: &'a str,
        radius: usize,
        direction: TraversalDirection,
        nodes: &'a [CsgNode],
        edges: &'a [CsgEdge],
    }
    let payload = SliceHashPayload {
        target_id,
        radius: options.radius,
        direction: options.direction,
        nodes: &slice_nodes,
        edges: &slice_edges,
    };
    let json_bytes =
        serde_jcs::to_vec(&payload).map_err(|e| SliceError::Serialization(e.to_string()))?;
    let slice_hash = format!("sha256:{:x}", Sha256::digest(&json_bytes));

    Ok(Some(ContextSlice {
        target_id: target_id.into(),
        radius: options.radius,
        direction: options.direction,
        provenance: graph.provenance.clone(),
        compiler_certified: graph.is_compiler_certified(),
        nodes: slice_nodes,
        edges: slice_edges,
        omitted_inaccessible_count,
        slice_hash,
    }))
}

/// Convenience function for access-aware context slicing with default undirected traversal.
pub fn slice_around(
    graph: &CompilerSemanticGraph,
    target_id: &str,
    radius: usize,
    access: AccessLevel,
) -> Result<Option<ContextSlice>, SliceError> {
    slice_with_options(
        graph,
        target_id,
        SliceOptions {
            radius,
            direction: TraversalDirection::Undirected,
            access,
            max_nodes: None,
        },
    )
}

#[cfg(test)]
mod tests {
    use super::*;
    use reflective_rust_csg::{CsgEdge, CsgNodeKind, SourceSpan};

    fn make_node(id: &str, access: AccessLevel) -> CsgNode {
        CsgNode {
            id: id.into(),
            name: id.into(),
            kind: CsgNodeKind::Struct,
            span: SourceSpan {
                file: "lib.rs".into(),
                start_line: 1,
                end_line: 1,
            },
            minimum_access: access,
            size_bytes: None,
        }
    }

    fn sample_graph() -> CompilerSemanticGraph {
        let mut graph = CompilerSemanticGraph::fixture("unit-test");
        graph.nodes = vec![
            make_node("a", AccessLevel::Public),
            make_node("b", AccessLevel::Public),
            make_node("c", AccessLevel::Owner),
            make_node("d", AccessLevel::Public),
        ];
        graph.edges = vec![
            CsgEdge {
                from: "a".into(),
                to: "b".into(),
                relationship: "calls".into(),
                minimum_access: AccessLevel::Public,
            },
            CsgEdge {
                from: "b".into(),
                to: "c".into(),
                relationship: "secret_call".into(),
                minimum_access: AccessLevel::Owner,
            },
            CsgEdge {
                from: "c".into(),
                to: "d".into(),
                relationship: "calls".into(),
                minimum_access: AccessLevel::Public,
            },
        ];
        graph
    }

    #[test]
    fn radius_zero_returns_only_target() {
        let graph = sample_graph();
        let slice = slice_around(&graph, "a", 0, AccessLevel::Public)
            .unwrap()
            .unwrap();
        assert_eq!(slice.nodes.len(), 1);
        assert_eq!(slice.nodes[0].id, "a");
        assert!(slice.edges.is_empty());
        assert!(slice.slice_hash.starts_with("sha256:"));
    }

    #[test]
    fn radius_and_access_are_strictly_enforced() {
        let graph = sample_graph();
        let public = slice_around(&graph, "a", 3, AccessLevel::Public)
            .unwrap()
            .unwrap();
        // c is Owner, d cannot be reached without passing through c
        assert_eq!(
            public
                .nodes
                .iter()
                .map(|n| n.id.as_str())
                .collect::<Vec<_>>(),
            ["a", "b"]
        );
        assert_eq!(public.edges.len(), 1);
        assert!(public.omitted_inaccessible_count > 0);

        let owner = slice_around(&graph, "a", 3, AccessLevel::Owner)
            .unwrap()
            .unwrap();
        assert_eq!(
            owner
                .nodes
                .iter()
                .map(|n| n.id.as_str())
                .collect::<Vec<_>>(),
            ["a", "b", "c", "d"]
        );
        assert_eq!(owner.edges.len(), 3);
    }

    #[test]
    fn directed_traversal_distinguishes_forward_and_reverse() {
        let graph = sample_graph();
        let forward = slice_with_options(
            &graph,
            "b",
            SliceOptions {
                radius: 1,
                direction: TraversalDirection::Forward,
                access: AccessLevel::Public,
                max_nodes: None,
            },
        )
        .unwrap()
        .unwrap();
        // b -> c (c is Owner, inaccessible), so forward only yields b
        assert_eq!(forward.nodes.len(), 1);

        let reverse = slice_with_options(
            &graph,
            "b",
            SliceOptions {
                radius: 1,
                direction: TraversalDirection::Reverse,
                access: AccessLevel::Public,
                max_nodes: None,
            },
        )
        .unwrap()
        .unwrap();
        // a -> b, so reverse from b reaches a
        assert_eq!(
            reverse
                .nodes
                .iter()
                .map(|n| n.id.as_str())
                .collect::<Vec<_>>(),
            ["a", "b"]
        );
    }

    #[test]
    fn graph_explosion_limit_is_enforced() {
        let graph = sample_graph();
        let result = slice_with_options(
            &graph,
            "a",
            SliceOptions {
                radius: 3,
                direction: TraversalDirection::Undirected,
                access: AccessLevel::Owner,
                max_nodes: Some(2),
            },
        );
        assert!(matches!(
            result,
            Err(SliceError::NodeLimitExceeded { limit: 2, .. })
        ));
    }

    #[test]
    fn target_absence_and_access_denial_return_none() {
        let graph = sample_graph();
        // Missing node
        assert!(
            slice_around(&graph, "nonexistent", 1, AccessLevel::Public)
                .unwrap()
                .is_none()
        );
        // Inaccessible target
        assert!(
            slice_around(&graph, "c", 1, AccessLevel::Public)
                .unwrap()
                .is_none()
        );
    }

    #[test]
    fn slice_hash_is_deterministic_and_verifiable() {
        let graph = sample_graph();
        let s1 = slice_around(&graph, "a", 1, AccessLevel::Public)
            .unwrap()
            .unwrap();
        let s2 = slice_around(&graph, "a", 1, AccessLevel::Public)
            .unwrap()
            .unwrap();
        assert_eq!(s1.slice_hash, s2.slice_hash);
        assert!(s1.slice_hash.starts_with("sha256:"));
    }
}
