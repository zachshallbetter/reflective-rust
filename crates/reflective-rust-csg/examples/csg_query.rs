use reflective_rust_csg::CompilerSemanticGraph;

fn main() {
    let graph = CompilerSemanticGraph::fixture("example:csg-query");
    println!("{}", graph.to_json().expect("fixture must serialize"));
    assert!(!graph.provenance.is_compiler_certified());
}
