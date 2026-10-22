use reflective_rust_derive::Reflectable;
use reflective_rust_protocol::Reflect;

#[derive(Reflectable)]
struct Account {
    id: u64,
    nickname: Option<String>,
}

fn main() {
    let descriptor = Account::type_descriptor();
    let json = serde_json::to_string_pretty(&descriptor).expect("type descriptor should serialize");
    println!("{json}");
}
