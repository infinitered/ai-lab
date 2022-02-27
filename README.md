[![Docs Working](https://github.com/infinitered/ai-lab/actions/workflows/storybook.yml/badge.svg)](https://infinitered.github.io/ai-lab/)

# ![AI-Lab](assets/images/ai-lab.jpg) Bring the power of AI to Web easily.  (currently in _ALPHA_).


This project wires together frameworks for Artificial Intelligence on the edge.  The current focus is popular computer vision models in TensorFlow.js on React.  The goal is to support React Native, and multiple web frameworks.

## Quick Look

To play with AI-Lab, check out the latest [storybook build](https://infinitered.github.io/ai-lab/).
<center>

| React Native (broken for now)                 | React                                         |
| --------------------------------------------- | --------------------------------------------- |
| ![app example](assets/images/app-example.png) | ![web example](assets/images/web-example.png) |

</center>

## Install

```
yarn add ai-lab @tensorflow/tfjs
```

Then add it

```tsx
import React from 'react';
import { AILabImage } from 'ai-lab';
```

## Dev Requirements

The packages in this repository require Node v14+ and `pnpm`.

## Examples

### 📷 _AILabImage_

The following code automatically runs the SSD model and places bounding boxes for detections.
```tsx
  <AILabImage
    model={SSD_MODEL_HERE}
    modelConfig={{
      modelType: 'ssd'
    }}
    src={require('./cat.jpeg')}
    visual
  />  
```

### 📺 _AILabLocalVideo_

This code runs the model on the supplied video and logs the results

```tsx
  <AILabLocalVideo
    model={ClassificationModel}
    onInference={console.log}
    modelConfig={{
      modelType: 'classification',
    }}
    src={theVideo}
  />
```

### 🕸🎥 _AILabWebCam_

This code runs the model on the webcam feed and logs the results

```tsx
    <AILabWebCam
      model={BlazePoseModel}
      onInference={console.log}
      modelConfig={{
        modelType: 'pose',
      }}
    />
```

## Installation

### Check Requirements

_Assure Node > v14 Installed_

```shell
node -v
```

_Assure TypeScript Installed_

```shell
tsc -v
```

_Assure/Install PNPM_

```shell
npm install -g pnpm
```

If you ran yarn/npm - delete all `node_modules` from those and start fresh.

**Install project code at project root**

```shell
pnpm install
```

> **Windows Users**: The package tsconfig files are symlinks. If you're looking for a quick fix, you can copy the contents of the `shared/tsconfig.json` to these files as a temporary fix. These should not be committed like this, and should be reverted or linked in Windows.

```shell
pnpm build
```

Now you can run example projects that are depending on

_E.G. of running the `ai-lab-example` example_

```shell
cd examples/ai-lab-example
pnpm start
```

<br>

## Contributing

Working within this repository requires Node v14. A Node Version Manager is recommended, such as [`nvm`](https://github.com/nvm-sh/nvm#installing-and-updating).

This repository is a monorepo, and managed by [`pnpm`](https://pnpm.io). To install it, run:

```console
$ npm install pnpm -g
```

From the repository root directory, run the following command to install all dependencies:

```console
$ pnpm install
```

Once install completes, development can begin.

### _Stacks we use_ :

[tsdx](https://tsdx.io/)

[storybook](https://storybook.js.org/)

[pnpm](https://pnpm.io/)

<br>

#### ⁉️ If you run into problems, first search the issues in this repository. Otherwise you can <a href="https://github.com/infinitered/ai-lab/issues">report the bug</a>.
