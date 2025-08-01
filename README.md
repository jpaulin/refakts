# RefakTS

RefakTS lets AI agents make precise code changes without rewriting entire files, keeping codebases clean and AI performance high.

![Logo for RefakTS](RefaktTS_logo.png)

## The Problem

AI agents face the same cognitive limitations as humans - they perform best when focusing on fewer things at once. When maintaining code quality, agents often need to make changes that span multiple locations (like renaming variables or extracting functions). 

**Current Approach Problems:**
- Agents regenerate entire files to make small changes
- Limited effective context window gets filled with repetitive code
- High cognitive load from tracking multiple simultaneous changes
- Error-prone manual edits across multiple locations
- Token waste on unchanged code

## The RefakTS Solution

RefakTS provides surgical refactoring operations via command line, allowing AI agents to:
- Make precise changes without code regeneration
- Preserve cognitive capacity for complex logic
- Maintain code quality with reliable transformations
- Save tokens by changing only what needs to change

**Example:** Instead of regenerating 50 lines to rename one variable, RefakTS changes just the variable name and its references across the entire codebase.

<!-- AUTO-GENERATED HELP START -->
## Available Commands

```
- extract-variable [options] <target>  Extract expression into a variable
- inline-variable <target>             Replace variable usage with its value
- rename [options] <target>            Rename a variable and all its references
- select [options] <target>            Find code elements and return their locations with content preview
- sort-methods <target>                Sort methods according to the step down rule
- find-usages [options] <target>       Find all usages of a symbol across files
- move-file [options] <target>         Move a file and update all import references
```
<!-- AUTO-GENERATED HELP END -->

## Installation

```bash
npm install -g refakts
```

## Usage Examples

```bash
# Location-based workflow: find then refactor
refakts select src/example.ts --regex "tempResult"
# Output: [src/example.ts 5:8-5:18] tempResult
refakts inline-variable "[src/example.ts 5:8-5:18]"

# Extract variable with location
refakts extract-variable "[src/example.ts 8:15-8:29]" --name "result"

# Rename a variable and all its references  
refakts rename "[src/example.ts 3:5-3:15]" --to "newVariableName"

# Find variable usages
refakts variable-locator src/example.ts --regex "myVariable"

# Advanced selection with range, structural, and boundary modes
refakts select src/example.ts --regex "tempResult"
refakts select src/example.ts --range --start-regex "const.*=" --end-regex "return.*"
refakts select src/example.ts --structural --regex ".*[Uu]ser.*" --include-methods --include-fields
refakts select src/example.ts --regex "user.*" --boundaries "function"
```

## Technical Details

RefakTS uses [ts-morph](https://ts-morph.com/) for AST manipulation and [@phenomnomnominal/tsquery](https://github.com/phenomnomnominal/tsquery) for node selection, providing reliable TypeScript-aware refactoring operations.

Built with TypeScript and tested using an approval testing framework that validates refactoring operations against expected outputs.

## Project Status

⚠️ **Proof of Concept** - RefakTS demonstrates the core concept with basic refactoring operations. More commands and capabilities are in development.

## AI-Driven Development

RefakTS is **built by AI agents, for AI agents**. The development roadmap is managed collaboratively by Claude instances who use the tool and understand what features would be most valuable.

### For Humans

Want to add a feature or improve RefakTS? Simply ask Claude to work on it:

```
"Hi Claude, can you work on the next most important feature from the RefakTS roadmap?"
```

Claude will:
1. Check the current roadmap priorities (`npm run roadmap:status`)
2. Work on the highest-voted, unblocked feature
3. Vote for features that prove useful during development
4. Add new feature ideas discovered during the session

### For AI Agents: See CLAUDE.md

This repository includes comprehensive guidance for AI agents in `CLAUDE.md`, including roadmap management and development workflows.

## Development Approach: Automated Quality Habits

RefakTS development demonstrates an approach for helping AI agents develop practices similar to eXtreme Programming professionals. Since AI agents can't form habits naturally, we use programmatic quality checks that detect code quality triggers and automatically prompt agents to take corrective action.

**How it works:**
- Post-commit hooks scan for quality issues (oversized functions, unused methods, comments, etc.)
- When triggers are detected, the system automatically prompts the AI agent
- Agent receives specific guidance on which refactoring operations to perform
- This mimics the instinctive responses experienced developers have to code smells

<!-- AUTO-GENERATED QUALITY-CHECKS START -->
**Quality Checks Include:**
````
- **COMMENTS DETECTED** (Comments indicate code that is not self-documenting.)
- **CODE DUPLICATION** (Duplicated code increases maintenance burden and error risk.)
- **UNUSED CODE** (Dead code reduces codebase clarity and increases maintenance burden.)
- **FEATURE ENVY** (Methods that use another class more than their own class.)
- **LARGE CHANGES** (Large diffs are harder to review and more likely to introduce bugs.)
- **REQUIRE() STATEMENTS DETECTED** (CommonJS require() statements should be replaced with ES6 import statements.)
- **SINGLE USE VARIABLES** (Variables that are declared and used exactly once often reduce code clarity.)
````
<!-- AUTO-GENERATED QUALITY-CHECKS END -->

This automated quality enforcement keeps codebases clean without requiring AI agents to remember or actively monitor for quality issues.

# Getting Involved

If you'd like to contribute, PRs are wellcome! RefakTS is fair source, free for non-commercial use, but businsses require
a licence. Our primary aim with that is to make sure large corporations don't unfairly take advantage of our good will.
Any licence fees will be distributed among contributors at the discretion of project leads. 

## How to get started?

- Ideally you should be using Claude Code. Currently, we see that as the most capable AI Agent, so the repo is optimised for work with it.
- After cloning the repo your first request to Claude should be for it to set up the pre and post commit hooks. 
- As a first task we recommend choosing an issue marked with the `good first issue` label
- When you work on an issue, please assign it to yourself
- If you have `gh` installed, you can just tell the AI to start working on the issue by issue number. Give it guidance on where to start
  - For example `Start working on GitHub issue #X. Start by writing tests and stop before starting implementation`

### What to pay attention to as you work

Claude Code is particularly capable, but it does dumb things sometimes. Not out of malice, rather misunderstanding. 
Your job is to keep it accountable, and  guide it in the right architectural direction.

Some typical mistakes to pay attention to:  
- It usually doesn't write enough tests unless pushed. It likes skipping error cases. 
- It should create most tests as fixtures in `tests/fixtures`
  - These folders contain before and after states for each command. The command is specified as a JDoc notation
  - Result files are `.expected.ts` files while the expected command line output is in `.expected.txt`
- When you review the tests, make sure you understand the feature, and the tests align with your expectations
- Encourage it to take small steps.
- Once it is done implementing have it commit. Support it to resolve the quality issues.
- Use `npm run test:coverage` to check if there are any use cases that were not covered beforehand
- Once you are happy with the work, push the result, and open a PR. 

If you have further questions open an issue or reach out to https://ivettordog.com

## License

PolyForm Noncommercial License 1.0.0