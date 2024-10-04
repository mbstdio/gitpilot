<div align="center">
  <div>
    <img src=".github/screenshot.png" alt="GitPilot"/>
    <h1 align="center">GitPilot</h1>
  </div>
	<p>Your Git Terminal AI assistant that can write commits with ease for you.</p>
	<a href="https://www.npmjs.com/package/@mbstudio/gitpilot"><img src="https://img.shields.io/npm/v/@mbstudio/gitpilot" alt="Current version"></a>
</div>

## Installation

### npm

```bash
npm install -g @mbstudio/gitpilot
```

### yarn

```bash
yarn global add @mbstudio/gitpilot
```

### pnpm

```bash
pnpm add -g @mbstudio/gitpilot
```

## Features

- Easy to use command line interface.
- Multiple configuration options to customize to your liking
- Use popular AI providers to generate commit messages.
  - OpenAI
  - Anthropic
  - More to come...
- Edit commit messages before finalizing the commit.
- Multiple generation behaviors can be used to write commits that suit your style.
  - Natural
  - Conventional
  - Imitate

## Usage

### Initialize GitPilot

```bash
gitpilot init
```

A series of questions will be asked to configure Gitpilot. This will create a `.gitpilot` configuration file in your home directory.

### Generate a new commit

```bash
gitpilot
```

The files you have staged will be used by Gitpilot to generate commits for you. After deciding on the commit message you want, you have the option to edit it before the final commit.

### Get configuration parameters

```bash
gitpilot config <key>
```

This will return the value of the configuration key you provide.

### Set configuration parameters

```bash
gitpilot config <key> <value>
```

This will set the value of the configuration key you provide.

## Motivation

My goal in creating this project was to gain knowledge about CLI apps in Node.js, popular AI APIs, and how to maintain an open-source project.

I am looking for GitPilot to be easy to use and have all the necessary features that developers can need.

I hope you find this project useful. If you have any suggestions or issues, feel free to open an issue or a pull request.
