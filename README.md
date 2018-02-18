generator-rollupjs-library
=========================

###### _A stream-based generator for scaffolding a project which is meant to make a library with rollupjs_
---------------------------------------------------------------------

This generator is being built with the intent of being used with the [`slush` CLI](https://slushjs.github.io/#/), and is currently very much a **work in progress**.

**Note**: It is currently untested as a slush-specific generator. Instead, for ease of development, to currently use it you should use
```node --require ts-node/register node_modules/.bin/gulp --gulpfile=./slushfile.ts --dir=<destination>``` where `<destination>` is a directory where you'd like to find its output.

##### Features
- Getting a (dynamic) list of open source licenses to choose from (from [_choosealicense_](https://choosealicense.com/licenses/))
-- Right now the choice of license is inconsequential to the generator.
- Basic tests with Mocha / Ava
- Code Coverage (with either nyc or istanbul, based on whether you choose Mocha or Ava)
- Ability to download dependencies through the generator with `yarn` or `npm`
- Modified package.json depending on necessary dependencies

##### Roadmap
- Modifying Author and License information in package.json based on `inquirer` responses
- More than the one, current template with the ability to choose
- [Possible] TypeScript support, depending on demand

##### LICENSE
MIT
