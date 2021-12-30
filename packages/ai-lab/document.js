const TypeJuice = require('typejuice');
const fs = require('fs');

const tj = new TypeJuice('./src/types.ts');

const content = tj.toMarkdown();
fs.writeFile('./README.md', content, (err) => {
  if (err) {
    console.error(err);
    return;
  }
});
