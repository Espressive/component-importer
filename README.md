<p align="center">
  <img src="assets/component-importer-logo.png" width="88" height="85" alt="Component Importer" />
</p>

<div align="center">
    <h1>Component Importer</h1>
    <h3>Tooling to import your production <br> design system into Framer</h3>
</div>

<br>

[![npm version](https://badge.fury.io/js/%40framerjs%2Fcomponent-importer.svg)](https://badge.fury.io/js/%40framerjs%2Fcomponent-importer) [![Join the Community](https://withspectrum.github.io/badge/badge.svg)](https://spectrum.chat/framer/bug-reports)



The `component-importer` is a command-line tool that makes it easy to import React-based design systems into Framer X. It analyzes your production design system's source code and generates readable React components that can be loaded by [Framer X](https://framer.com). It currently supports components written in TypeScript, Flow or vanilla JavaScript (via PropTypes).

Let's take a quick look at the generated code.

#### Example: importing a button from the office-ui-fabric-react design system

```ts
import * as React from "react"
import * as Fabric from "office-ui-fabric-react"
import { addPropertyControls, ControlType } from "framer"

function Button(props) {
    return <Fabric.Button {...props} />
}

addPropertyControls(Button, { // <=== Inferred Property Controls
    kind: {
        type: ControlType.Enum,
        defaultValue: "primary",
        options: ["primary", "secondary"]
    },
    label: { type: ControlType.String },
    isLoading: { type: ControlType.Boolean, defaultValue: false },
})
```

By analyzing the button component's TypeScript definitions, we can infer its [property controls](https://www.framer.com/api/property-controls/), similar to React Storybook's [knobs](https://github.com/storybookjs/storybook/tree/master/addons/knobs). This means you can now drag your button to the Framer X canvas and modify it using a GUI that everyone can understand:

![Import Button Example](assets/readme-import-button-example.gif)

## Why?

Design Systems lower engineering costs by keeping a single source of truth for your company's visual language. They have been successfully adopted by the industry's most sophisticated players like [Google](https://material.io/design/), [Microsoft](https://developer.microsoft.com/en-us/fabric#/) and [Uber](https://baseweb.design/). Even the [UK](https://design-system.service.gov.uk/components/) and [US](https://designsystem.digital.gov/) government have one!

There's still one big problem though: production design systems are typically only accesible to technical designers, comfortable enough with the command line and familiar with web development tooling like Webpack, TypeScript/Flow, React/Angular, etc. This means that designers often end up having to maintain their own copy which is expensive to keep in sync.

The `component-importer` makes it possible to import your company's design system into Framer X, so designers can start prototyping with components that behave just like they do in production.

## Getting started

To install run:

```
yarn global add @framerjs/component-importer
```

This will globally install the `component-importer` executable.

### Example: importing the [Fabric UI](https://developer.microsoft.com/en-us/fabric#/get-started/web) design system

Let's go through the process of importing the Fabric UI design system from scratch.

### **Step 1**: project setup

Create a Framer X [folder-backed project](https://www.framer.com/support/using-framer-x/folder-backed-projects/):

 - Create a new Framer X project
 - Hold Option and click File › Save As
 - In the save dialog, click the File Format dropdown and select "Framer X (Folder)"
 - Click Save

**NOTE**: `.framerfx` projects are regular NPM projects. Go to your favorite text editor and try to open the folder we just created. The contents will look something like this:

```
build/
code/
design/
metadata/
node_modules/
package.json
README.md
tsconfig.json
yarn.lock
```

As you can see, it's a good ol' NPM package with its `package.json` and `node_modules`. It also has a `tsconfig.json` file as Framer X supports TypeScript by default. By convention, all code components live in the `code/` folder.

### **Step 2**: add dependencies

Before we import Fabric UI, we will first need to add it as a dependency:

```bash
# cd into the project created in the previous step.
cd ~/my-project.framerfx

# Fabric UI's npm package name is `office-ui-fabric-react`
yarn add office-ui-fabric-react
```

### **Step 3**: run the `component-importer`

In order to configure the component importer you will need to setup a configuration file at the root of your project.

The `component-importer init` command will help you setup appropriate defaults for your project.

The general syntax is `component-importer init <packageName>`. For example, `component-importer init @blueprintjs/core` will try to import the `@blueprintjs/core` package into your Framer X project.

Note that by default, the component importer will run in TypeScript mode and expect to find a type definitions file in the package you've pointed it to. If your components are written in a different flavor of JavaScript, you can use the `--mode` argument to pick a different mode. The available modes are:
* `--mode flow` for Flow-typed components
* `--mode plain` for components written in plain JavaScript with props described in a static `propTypes` property on the exported component.

Now you can run the following command for your design system of choice:

```bash
# Make sure to run this command at the root of your Framer X project
component-importer init office-ui-fabric-react
```

After the command has run successfully, you should see two changes:

1. An `importer.config.json` file will be created at the root of your project. This file stores the configuration for the component importer. You can read more about configuring the importer [here](docs/configuration.md).
1. The `code/` folder is now filled with React components.

### **Step 4**: Tweaking the generated components and keeping in sync with your design system

Production design systems are meant to be consumed by engineers, not design tools, so you will need to spend some time adjusting the generated code. This means removing components that don't make much sense inside of Framer X and adjusting the UX of the generated property controls.

You can use the `generate` command to re-run the component importer and get the latest changes from the upstream design system. The importer uses a simple mechanism for resolving & merging conflicts which you can read more about [here](docs/re-importing.md).

```bash
# Make sure to run this command at the root of your Framer X project.
component-importer generate
```

## Examples

Looking for projects using the `component-importer`?

- [Base Web](https://baseweb.design/): Uber's design system.
  - [Source Code](https://github.com/framer/baseui.framerfx)
  - [Framer X package](https://packages.framer.com/package/lily/baseui)
- [Office UI Fabric](https://developer.microsoft.com/en-us/fabric): Microsoft's design system.
  - [Source Code](https://github.com/framer/office-ui-fabric.framerfx)
- [Grommet](https://v2.grommet.io/): A mobile-first, themeable design system used by companies like IBM, Netflix and Sony.
  - [Source Code](https://github.com/framer/grommet.framerfx)
  - [Framer X package](https://packages.framer.com/package/fhur/grommet)
- [Salesforce Lightning](https://github.com/salesforce/design-system-react)
  - [Source Code](https://github.com/framer/salesforce-lightning.framerfx)

## Documentation

Looking to dive deeper into the `component-importer`? These guides are here to help:

- [Configuration](docs/configuration.md): Fine tuning the importer with the `importer.config.json`.
- [Re-importing](docs/re-importing.md): How to keep your Framer X project in sync with your design system.
- [Library](docs/library.md): (**Experimental**) how to use the component importer as a TypeScript library.

## External resources & articles

Want to learn more about design systems?

- [Measuring Impact](https://medium.com/@didoo/measuring-the-impact-of-a-design-system-7f925af090f7)
  Cristiano Rastelli measures the impact of moving Badoo to a design system, filled with colorful charts 📊 and graphs 📈.
- [Estimating Costs & Value](https://uxdesign.cc/how-much-is-a-design-system-worth-d72e2ededf76)
  Trying to convince your manager about building a design system? Bryn Rozzier explains a simple technique to estimate the [ROI](https://en.wikipedia.org/wiki/Return_on_investment) 💰 of building a design system.
- [Driving Adoption](https://segment.com/blog/driving-adoption-of-a-design-system/)
  Got a design system, but nobody is using it? Jeroen from segment.io explains what it took to convince other engineers to adopt [Evergreen](https://evergreen.segment.com/components/) 💗.

# Local Development

Are you working on the `component-importer`? These commands will help you get started,

#### How to build?

```bash
yarn run build
```

#### How to run tests?

```bash
yarn run test
```

#### How to test the importer locally?

```bash
yarn build
# creates a symbolic link to the current build of the component importer.
ln -s "$(realpath build/cli.js)" /usr/local/bin/importer

# You can now run anywhere in your file system
importer --help
```

#### How can I publish a new version of the `component-importer`

1. Run `yarn publish` and pick a new version. Keep the version at 0.0.X until we reach a stable state.

2. Run `yarn changelog` to re-write the changelog.

