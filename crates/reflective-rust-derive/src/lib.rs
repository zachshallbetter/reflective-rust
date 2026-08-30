//! Derive support for opt-in runtime type descriptors.

extern crate proc_macro;

use proc_macro::TokenStream;
use quote::quote;
use syn::{Data, DeriveInput, Fields, parse_macro_input};

/// Implements `reflective_rust_protocol::Reflect` for a struct or enum.
#[proc_macro_derive(Reflectable)]
pub fn derive_reflectable(input: TokenStream) -> TokenStream {
    let input = parse_macro_input!(input as DeriveInput);
    let name = &input.ident;
    let (impl_generics, type_generics, where_clause) = input.generics.split_for_impl();

    let (kind, fields, variants) = match &input.data {
        Data::Struct(data) => (
            quote!(Struct),
            describe_fields(&data.fields, quote!(#name #type_generics), true),
            quote!(::std::vec::Vec::new()),
        ),
        Data::Enum(data) => {
            let variants = data.variants.iter().map(|variant| {
                let variant_name = variant.ident.to_string();
                let fields = describe_fields(&variant.fields, quote!(#name #type_generics), false);
                quote! {
                    ::reflective_rust_protocol::VariantDescriptor {
                        name: #variant_name.to_string(),
                        fields: #fields,
                    }
                }
            });
            (
                quote!(Enum),
                quote!(::std::vec::Vec::new()),
                quote!(::std::vec![#(#variants),*]),
            )
        }
        Data::Union(_) => {
            return syn::Error::new_spanned(name, "Reflectable does not support unions")
                .to_compile_error()
                .into();
        }
    };

    quote! {
        impl #impl_generics ::reflective_rust_protocol::Reflect for #name #type_generics #where_clause {
            fn type_descriptor() -> ::reflective_rust_protocol::TypeDescriptor {
                ::reflective_rust_protocol::TypeDescriptor {
                    name: ::core::any::type_name::<Self>().to_string(),
                    kind: ::reflective_rust_protocol::TypeKind::#kind,
                    layout: Some(::reflective_rust_protocol::LayoutDescriptor {
                        size_bytes: ::core::mem::size_of::<Self>(),
                        align_bytes: ::core::mem::align_of::<Self>(),
                    }),
                    fields: #fields,
                    variants: #variants,
                }
            }
        }
    }
    .into()
}

fn describe_fields(
    fields: &Fields,
    owner: proc_macro2::TokenStream,
    include_offsets: bool,
) -> proc_macro2::TokenStream {
    let entries = fields.iter().enumerate().map(|(position, field)| {
        let field_name = field
            .ident
            .as_ref()
            .map(ToString::to_string)
            .unwrap_or_else(|| position.to_string());
        let field_type = &field.ty;
        let type_name = quote!(#field_type).to_string();
        let optional = is_option(field_type);
        let offset = if include_offsets {
            if let Some(identifier) = &field.ident {
                quote!(Some(::core::mem::offset_of!(#owner, #identifier)))
            } else {
                let index = syn::Index::from(position);
                quote!(Some(::core::mem::offset_of!(#owner, #index)))
            }
        } else {
            quote!(None)
        };
        quote! {
            ::reflective_rust_protocol::FieldDescriptor {
                name: #field_name.to_string(),
                type_name: #type_name.to_string(),
                optional: #optional,
                offset_bytes: #offset,
                minimum_access: ::reflective_rust_protocol::AccessLevel::Public,
                attributes: ::std::collections::BTreeMap::new(),
            }
        }
    });
    quote!(::std::vec![#(#entries),*])
}

fn is_option(field_type: &syn::Type) -> bool {
    let syn::Type::Path(path) = field_type else {
        return false;
    };
    path.path
        .segments
        .last()
        .is_some_and(|segment| segment.ident == "Option")
}
