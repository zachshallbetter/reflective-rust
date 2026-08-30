//! Small command-line surface for inspecting the implemented protocol.

use reflective_rust_protocol::SCHEMA_VERSION;

fn main() {
    match std::env::args().nth(1).as_deref() {
        Some("protocol") => println!("{SCHEMA_VERSION}"),
        _ => {
            eprintln!("usage: reflective-rust protocol");
            std::process::exit(2);
        }
    }
}
