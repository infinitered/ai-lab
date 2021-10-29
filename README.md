# AI-Lab

AI-lab is a set of components and tools built on TensorFlow JS for React and React Native!

## Quick Look


<center>

| App                                           | Web                                           |
| --------------------------------------------- | --------------------------------------------- |
| ![app example](assets/images/app-example.png) | ![web example](assets/images/web-example.png) |

</center>

## Example


### _AILabImage_

```tsx
import React from 'react';
import { AILabImage } from 'ai-lab';

const MyAIComponent = ({ src }) => {
  return <AILabImage perf perfCallback={perf => console.log(perf)} src={src} />;
};
```

### _Properties_

| Prop         | Type                                      | Description                         |
| ------------ | ----------------------------------------- | ----------------------------------- |
| perf         | boolean                                   | Display performance metrics overlay |
| prefCallback | (perfInfo: PerfInfo) => Promise<PerfInfo> | Get performance metrics in callback |
| src          | string                                    | URI to image file                   |

<br>

## Installation


coming soon

<br>

## Contributing


### _Stacks we use_ :

[tsdx](https://tsdx.io/)

[storybook](https://storybook.js.org/)

[lerna](https://lerna.js.org/)

<br>

  
#### ⁉️ If you run into problems, first search the issues in this repository. Otherwise you can <a href="https://github.com/infinitered/ai-lab/issues">report the bug</a>.
