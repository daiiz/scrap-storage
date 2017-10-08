# ScrapStorage

Save text data to Scrapbox

[![https://gyazo.com/7091b7cec4e7b85d9372e1c39a1e0aa6](https://gyazo.com/7091b7cec4e7b85d9372e1c39a1e0aa6/thumb/250)](Gyazo)

### Usage
```js
const ScrapStorage = require('scrap-storage')

// set Scrapbox projectName
const scrapStorage = new scrapStorage('daiiz')

// save text data to Scrapbox page
// `key` means an unique pageName
const data = ['[hello]', 'world', '#scrapbox']
scrapStorage.lines.put({
  key: 'HelloWorld',
  lines: data,
  metas: []
})

// get text data from Scrapbox page
const lines = await scrapStorage.lines.get('HelloWorld')
```