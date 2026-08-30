//! Access-aware context slicing for validated Compiler Semantic Graphs.

use reflective_rust_csg::{CompilerSemanticGraph, CsgNode, GraphProvenance, ValidationError};
use reflective_rust_protocol::AccessLevel;
use serde::{Deserialize, Serialize};
use std::collections::{BTreeMap, BTreeSet, VecDeque};

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct ContextSlice {
    pub target_id: String,
    pub radius: usize,
    pub compiler_certified: bool,
    pub nodes: Vec<CsgNode>,
}

pub fn slice_around(
    graph: &CompilerSemanticGraph,
    target_id: &str,
    radius: usize,
    access: AccessLevel,
) -> Result<Option<ContextSlice>, ValidationError> {
    graph.validate()?;
    let nodes: BTreeMap<&str, &CsgNode> = graph
        .nodes
        .iter()
        .map(|node| (node.id.as_str(), node))
        .collect();
    let Some(target) = nodes.get(target_id) else {
        return Ok(None);
    };
    if !access.permits(target.minimum_access) {
        return Ok(None);
    }

    let mut adjacency: BTreeMap<&str, Vec<&str>> = BTreeMap::new();
    for edge in &graph.edges {
        if access.permits(edge.minimum_access) {
            adjacency.entry(&edge.from).or_default().push(&edge.to);
            adjacency.entry(&edge.to).or_default().push(&edge.from);
        }
    }

    let mut queue = VecDeque::from([(target_id, 0usize)]);
    let mut visited = BTreeSet::new();
    while let Some((id, depth)) = queue.pop_front() {
        if !visited.insert(id) || depth == radius {
            continue;
        }
        for neighbor in adjacency.get(id).into_iter().flatten() {
            if nodes
                .get(neighbor)
                .is_some_and(|node| access.permits(node.minimum_access))
            {
                queue.push_back((neighbor, depth + 1));
            }
        }
    }

    Ok(Some(ContextSlice {
        target_id: target_id.into(),
        radius,
        compiler_certified: matches!(graph.provenance, GraphProvenance::Compiler { .. }),
        nodes: graph
            .nodes
            .iter()
            .filter(|node| visited.contains(node.id.as_str()))
            .cloned()
            .collect(),
    }))
}

#[cfg(test)]
mod tests {
    use super::*;
    use reflective_rust_csg::{CsgEdge, CsgNodeKind, SourceSpan};

    fn node(id: &str, access: AccessLevel) -> CsgNode {
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

    #[test]
    fn radius_and_access_are_enforced() {
        let mut graph = CompilerSemanticGraph::fixture("unit-test");
        graph.nodes = vec![
            node("a", AccessLevel::Public),
            node("b", AccessLevel::Public),
            node("c", AccessLevel::Owner),
        ];
        graph.edges = vec![
            CsgEdge {
                from: "a".into(),
                to: "b".into(),
                relationship: "uses".into(),
                minimum_access: AccessLevel::Public,
            },
            CsgEdge {
                from: "b".into(),
                to: "c".into(),
                relationship: "uses".into(),
                minimum_access: AccessLevel::Public,
            },
        ];
        let public = slice_around(&graph, "a", 2, AccessLevel::Public)
            .unwrap()
            .unwrap();
        assert_eq!(
            public
                .nodes
                .iter()
                .map(|node| node.id.as_str())
                .collect::<Vec<_>>(),
            ["a", "b"]
        );
        assert!(!public.compiler_certified);
        let owner = slice_around(&graph, "a", 1, AccessLevel::Owner)
            .unwrap()
            .unwrap();
        assert_eq!(owner.nodes.len(), 2);
    }
}
