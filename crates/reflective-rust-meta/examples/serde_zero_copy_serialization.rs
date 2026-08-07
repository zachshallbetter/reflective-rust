//! Real-World Industrial Example: Zero-Copy Binary Serializer
//! Run with: `cargo run --example serde_zero_copy_serialization -p reflective-rust-meta`

use reflective_rust_meta::{fields_of, layout_of, of, Info};

#[allow(dead_code)]
struct TelemetryPacket {
    timestamp: u64,
    active: bool,
}

pub struct ZeroCopySerializer;

impl ZeroCopySerializer {
    /// Serializes any reflectable struct into a byte vector using compile-time layout queries.
    pub unsafe fn serialize<T: Sized>(data: &T) -> Vec<u8> {
        let layout = layout_of::<T>();
        let ptr = data as *const T as *const u8;
        // Safety: Caller guarantees data points to valid instance of T
        let slice = unsafe { std::slice::from_raw_parts(ptr, layout.size) };
        slice.to_vec()
    }

    /// Deserializes bytes back into type T safely after layout validation.
    pub unsafe fn deserialize<T: Sized>(bytes: &[u8]) -> Option<T> {
        let layout = layout_of::<T>();
        if bytes.len() != layout.size {
            return None;
        }
        // Safety: Caller guarantees bytes contain valid bit pattern for T
        unsafe {
            let mut uninit: T = std::mem::zeroed();
            let dest_ptr = &mut uninit as *mut T as *mut u8;
            std::ptr::copy_nonoverlapping(bytes.as_ptr(), dest_ptr, layout.size);
            Some(uninit)
        }
    }
}

fn main() {
    println!("=== Real-World Industrial Example: Zero-Copy Binary Serializer ===");

    let packet = TelemetryPacket {
        timestamp: 17723456789,
        active: true,
    };

    const INFO: Info = of::<TelemetryPacket>();
    let fields = fields_of(INFO);
    let layout = layout_of::<TelemetryPacket>();

    println!("Reflecting TelemetryPacket (Size: {} bytes, Fields: {}):", layout.size, fields.len());
    for field in &fields {
        println!("  - Field {:<10} at byte offset {}", field.name, field.offset);
    }

    // Perform zero-copy binary serialization
    let bytes = unsafe { ZeroCopySerializer::serialize(&packet) };
    println!("\nSerialized Binary Payload ({} bytes): {:02X?}", bytes.len(), bytes);

    // Deserialization
    let restored: TelemetryPacket = unsafe { ZeroCopySerializer::deserialize(&bytes).unwrap() };
    println!("Restored Packet Timestamp: {}", restored.timestamp);
    println!("Restored Packet Active   : {}", restored.active);

    assert_eq!(packet.timestamp, restored.timestamp);
    assert_eq!(packet.active, restored.active);
    println!("\n[OK] Zero-Copy Binary Serialization & Deserialization Succeeded!");
}
