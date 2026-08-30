//! Read-only HTTP endpoint for protocol discovery.

use reflective_rust_protocol::SCHEMA_VERSION;
use std::io::{Read, Write};
use std::net::{TcpListener, TcpStream};
use std::time::Duration;

const MAX_REQUEST_BYTES: usize = 8 * 1024;

fn main() -> std::io::Result<()> {
    let listener = TcpListener::bind("127.0.0.1:8080")?;
    for stream in listener.incoming() {
        match stream {
            Ok(stream) => handle(stream)?,
            Err(error) => eprintln!("connection error: {error}"),
        }
    }
    Ok(())
}

fn handle(mut stream: TcpStream) -> std::io::Result<()> {
    stream.set_read_timeout(Some(Duration::from_secs(5)))?;
    stream.set_write_timeout(Some(Duration::from_secs(5)))?;
    let mut request = [0_u8; MAX_REQUEST_BYTES];
    let length = stream.read(&mut request)?;
    let request_line = std::str::from_utf8(&request[..length])
        .ok()
        .and_then(|request| request.lines().next());
    let (status, body) = match request_line {
        Some("GET /v1/protocol HTTP/1.1") => (
            "200 OK",
            serde_json::json!({ "schema_version": SCHEMA_VERSION }).to_string(),
        ),
        _ => (
            "404 Not Found",
            serde_json::json!({ "error": "not found" }).to_string(),
        ),
    };
    write!(
        stream,
        "HTTP/1.1 {status}\r\nContent-Type: application/json\r\nContent-Length: {}\r\nConnection: close\r\n\r\n{body}",
        body.len()
    )
}
