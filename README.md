# mr-change
A change log generator for npm and GitHub projects.

## About

This project is based on [@dylang's changelog](https://github.com/dylang/changelog) and is currently a work in progress.

The source is written in ES6 without any transpiling and tries to use loose-coupling and modular principles to make
contributions easier for contributors.

Currently, mr-change outupts in JSON (to cwd) and retrieving versions (releases) does not work. You can try out the CLI
and contribute to this project to make the ncessecary improvements.

## Example Usage

```bash
# 1. Fork the repo
# 2. Run npm install
npm install
# 3. Run Mr change with npm
node bin/mrchange -p npm
# or Run Mr change with GitHub user/repo
node bin/mrchange -p mr-change/mr-change
# or Run Mr Change with GitHub git URL
node bin/mrchange -p https://github.com/mr-change/mr-change.git
```