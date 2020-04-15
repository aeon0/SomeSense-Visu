#!/usr/bin/env bash

# Replace segment.ts and segment.d.ts in the installed capnp-ts module
# The package is not maintained anymore... lets hope we will not have to touch this again...
# or even better, update the package or make a new one

rm node_modules/capnp-ts/src/serialization/segment.ts
rm node_modules/capnp-ts/lib/serialization/segment.d.ts

cp capnp-ts-fixes/src/serialization/segment.ts node_modules/capnp-ts/src/serialization
cp capnp-ts-fixes/lib/serialization/segment.d.ts node_modules/capnp-ts/lib/serialization
