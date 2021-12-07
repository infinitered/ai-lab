import initStoryshots from '@storybook/addon-storyshots';
import path from 'path';

jest.mock('global', () =>
  Object.assign(global, { window: { STORYBOOK_HOOKS_CONTEXT: '' } })
);

initStoryshots({
  configPath: path.resolve(__dirname),
  framework: 'react',
});
