import { addons } from '@storybook/addons';
import { themes } from '@storybook/theming';

addons.setConfig({
  theme: {
    ...themes.dark,
    brandTitle: 'AI-Lab',
    brandUrl: 'https://infinitered.github.io/ai-lab/',
    brandImage:
      'https://raw.githubusercontent.com/infinitered/ai-lab/master/assets/images/ai-lab.jpg',
  },
});
