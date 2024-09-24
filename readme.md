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
  configuration options are provided.

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

## Example

This command:

```sh
yarn openapi-type-gen build ./src/openapi.template.yaml
```

Will produce this output:

- `./src/openapi.yaml`: A single OpenAPI specification file. This is produced
  using [@altearius/openapi-compose][1], which permits resolving wildcard
  imports. Thus, the `openapi.template.yaml` file may use wildcards to `$ref`
  other files, and the resulting `openapi.yaml` file will contain the resolved
  paths, ready for consumption by other tools.

- `./src/openapi.d.yaml.ts`: TypeScript types for the OpenAPI specification.
  This file is generated using [openapi-typescript][2].

- `./src/openapi.validation.js`: Pre-compiled standalone validation code for
  the TypeScript types. This file is generated using [ajv][3].

[1]: https://github.com/altearius/openapi-compose '@altearius/openapi-compose'
[2]: https://openapi-ts.pages.dev/introduction 'openapi-typescript'
[3]: https://ajv.js.org 'ajv'
