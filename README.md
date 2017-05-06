generator-rollupjs-library
=========================

_A stream-based generator for scaffolding a project which is meant to make a library with rollupjs_

This generator is being built with the intent of being used with the [slush](https://slushjs.github.io/#/) CLI, and is currently very much a work in progress.

**Note**: It is currently untested as a slush-specific generator. Instead, for ease of development, to currently use it you should use
```gulp --gulpfile=./slushfile.js --dir=<destination>``` where `<destination>` is a directory where you'd like to find its output.

##### Features:
- Basic tests with Mocha / Ava
- Code Coverage (with either nyc or istanbul, based on whether you choose Mocha or Ava)
- Ability to download dependencies through the generator with `yarn` or `npm`
- Modified package.json depending on necessary dependencies

##### Roadmap:
- Modifying Author and License information in package.json based on inquiry responses
- More than the one, current template with the ability to choose
- Reaching out to Brian Donovan (per the rollup-starter package.json) to ask about what should be done about a license someone using this generator might want to add
- [Possible] TypeScript support, depending on demand
