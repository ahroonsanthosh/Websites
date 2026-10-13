# Vendored Draco decoder

These files are copied verbatim from the installed Three.js package:

    node_modules/three/examples/jsm/libs/draco/gltf/

They are the **glTF variant**, built against the
`KHR_draco_mesh_compression` extension, which is the extension this project's
compressed asset uses. It is also the smaller of the two builds Three.js ships
(192 KB of WebAssembly against 286 KB for the general-purpose one).

| Field | Value |
| --- | --- |
| Source package | `three@0.180.0` |
| Source path | `examples/jsm/libs/draco/gltf/` |
| Variant | glTF (`KHR_draco_mesh_compression`) |
| Licence | Apache License 2.0 (see `README.md`) |
| Served from | `/vendor/draco/` |

Taking the decoder from the installed package rather than from a download
guarantees it matches the `DRACOLoader` that will drive it. Re-copy these files
whenever Three.js is upgraded; a decoder and a loader from different versions is
exactly the kind of mismatch that fails only on some assets.

**Never load these from a CDN.** A slowdown at a third-party origin takes every
compressed asset down with it, even when the assets themselves are hosted here.

Which files are actually fetched at runtime, from `DRACOLoader.js`:

- WebAssembly available: `draco_wasm_wrapper.js` + `draco_decoder.wasm`
- WebAssembly unavailable: `draco_decoder.js`

The second case cannot normally arise here, because the application already
requires WebGL 2 and every engine that has WebGL 2 has WebAssembly. The asm.js
build is kept anyway so that a browser with WebAssembly disabled by policy gets
a working decoder rather than a 404.
