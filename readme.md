# OpenAPI Type Gen

This project is responsible for these tasks:

- Compile various OpenAPI schema definitions into a single "root level"
  OpenAPI specification. This is done by wrapping around
  `@altearius/openapi-compose`.

- Generate TypeScript types from an OpenAPI specification. This is nothing
  more than a wrapper around `openapi-typescript` with some defaults and
  optimizations. If you are looking for a more general purpose tool, you
  should use `openapi-typescript` directly.

- Generate validation functions for the generated types. This tool works by
  extracting various schemas from within the OpenAPI specification and passing
  them into `ajv` to generate validation functions. A set of default
  configuration options are provided. Minor adjustments are made to the
  resulting validation functions to ensure they can be loaded in an
  ESM environment.

## Usage

This package makes specific assumptions about how a project is structured.

It provides a single command, `build`.

The `build` command accepts a single argument, a path to a template file
used to generate the root level OpenAPI specification. See the
`@altearius/openapi-compose` project for details on how this works.

The `build` command will generate a single OpenAPI specification file
that contains all of the `path` definitions from the imported files.

It will also generate TypeScript types for schemas defined by the OpenAPI
specification. Pass the `--no-types` command line argument to suppress this
behavior.

It will also generate pre-compiled AJV validation functions for each of
those types. Pass the `--no-validation` command line argument to suppress
this behavior.
