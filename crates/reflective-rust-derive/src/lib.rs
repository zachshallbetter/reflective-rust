//! # Reflective Rust Derive Macro Substrate (`#[derive(Reflectable)]`)
//!
//! Procedural derive macro expanding to static `TypeDescriptor` registries
//! for opt-in runtime semantic projection with zero memory cost by default.

extern crate proc_macro;

use proc_macro::TokenStream;
use quote::quote;
use syn::{parse_macro_input, Data, DeriveInput, Fields};

/// Proc-macro deriving static runtime reflection descriptors for a struct.
#[proc_macro_derive(Reflectable)]
pub fn derive_reflectable(input: TokenStream) -> TokenStream {
    let input = parse_macro_input!(input as DeriveInput);
    let name = &input.ident;
    let name_str = name.to_string();

    let field_descriptors = match &input.data {
        Data::Struct(data_struct) => match &data_struct.fields {
            Fields::Named(fields) => {
                let field_entries = fields.named.iter().map(|f| {
                    let field_ident = &f.ident;
                    let field_name = field_ident.as_ref().unwrap().to_string();
                    let field_ty = &f.ty;
                    let field_ty_str = quote!(#field_ty).to_string();
                    quote! {
                        FieldDescriptor {
                            name: #field_name,
                            offset: ::core::mem::offset_of!(#name, #field_ident),
                            type_name: #field_ty_str,
                        }
                    }
                });
                quote! {
                    &[ #(#field_entries),* ]
                }
            }
            _ => quote! { &[] },
        },
        _ => quote! { &[] },
    };

    let expanded = quote! {
        pub struct FieldDescriptor {
            pub name: &'static str,
            pub offset: usize,
            pub type_name: &'static str,
        }

        pub struct TypeDescriptor {
            pub name: &'static str,
            pub size: usize,
            pub align: usize,
            pub fields: &'static [FieldDescriptor],
        }

        impl #name {
            /// Returns the opt-in static runtime descriptor for this type.
            pub fn type_descriptor() -> &'static TypeDescriptor {
                static DESCRIPTOR: TypeDescriptor = TypeDescriptor {
                    name: #name_str,
                    size: ::core::mem::size_of::<#name>(),
                    align: ::core::mem::align_of::<#name>(),
                    fields: #field_descriptors,
                };
                &DESCRIPTOR
            }
        }
    };

    TokenStream::from(expanded)
}
