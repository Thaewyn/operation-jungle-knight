# Jungle Knight

Open-source web-based rogue-lite game.

![Jungle Knight Header Logo](public/assets/images/jungle-knight-logo.png)

## Description

A Web-based roguelike, using turn-based cyberpunk-styled mechanics to attempt to escape one layer of the ‘simulation’.

Hardware and Software upgrades can be acquired, while attempting to free the Mind, Body, and Spirit from the control of the simulation.

Players gain some level of meta-progression, gaining upgrades to the strength of mind and spirit as they ascend through multiple layers of simulation.

## Table of Contents

- [Jungle Knight](#jungle-knight)
  - [Description](#description)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Credits](#credits)
  - [License](#license)
  - [Badges](#badges)
  - [Contributions](#contributions)
  - [Testing](#testing)

## Features

The game takes place over a series of ‘runs’, one run represents hacking through a single ‘layer’ of a simulation of reality.

Turn based combat is cooldown-based, with no required secondary resource except for major powers.

Upgrades are handled via Hardware and Software. Abilities (mostly active, some passive) are handled by software, and Hardware modifies core stats, and has passives that dramatically change other behaviors.

<!-- TODO
- [ ] Why build it?
- [ ] What problems does it solve?
- [ ] What has been learned while working on it? -->

## Installation

Install all Jungle Knight packages by running `npm install` or `npm i`.

## Usage

Start Jungle Knight by running `npm start`.

- Players start a new ‘run’ by picking their character class, and then choosing the first ‘server’ to hack into.
- Each server provides randomized rewards, as well as clues that enable the player to finish each ‘act’.
- If the player is able to successfully complete all 3 acts, they win that run, but only by unlocking and completing the 4th act will the player be able to move to the next ‘layer’.
- Progression takes the form of ‘unlocks’, which are diegetic knowledge about how to find and utilize other pieces of hardware and software, giving players more strategic choices.

Restart Jungle Knight by running `npm restart`.

Stop Jungle Knight by running `npm stop`.

Start the Jungle Knight development environment by running `npm run develop`.

<!-- TODO
- [ ] Add run develop script to package.json -->

## Credits

Max VanDuyne

Patrick Hopps

Billy Ruback

<!-- TODO
- [ ] Collaborators
- [ ] Third-party assets
- [ ] Tutorials
- [ ] Other referenced material -->
## License

MIT

## Badges

<!-- TODO
- [ ] Add badges displaying repository information -->

## Contributions

<!-- TODO
- [ ] How to contribute? -->
## Testing

The Jest testing framework is used alongside the concept of test-driven development.

Install Jest by running `npm install jest --save-dev` or `npm i jest -D`.

Once Jest is installed, open the `package.json` file, go the the `scripts` property, and update the value of the `"test"` property to `jest`.

Running `npm test` will run all tests in the `__test__` folder, or `npm test <filename>` can be used to specify a specific test to run by replacing `<filename>` with the name of the test file.

Test suite files use the `<filename>.test.js` naming convention by replacing `<filename>` with the name of the file being tested.
