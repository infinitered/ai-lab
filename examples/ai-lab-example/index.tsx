import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AILabImage } from 'ai-lab';

const App = () => {
  return (
    <div>
      <AILabImage src={require('./storybook/dinner.jpg')} />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
