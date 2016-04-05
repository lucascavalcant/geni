# Gen

Generator based in templates and json data.

## Usage

Programatic:

```bash
npm install gen --save
```

## Example

```js

const Gen = require('gen');
var gen = new Gen();

// using files
var options = {
  result: "./results/result.txt",
  template: {
    isPath: true,
    body: "./template/template.txt"
  },
  data: "./data/data.json"
};

// generates ./results/result.txt
gen.generate(options);

// as objects
var options = {
  template: {
    isPath: false,
    body: "my data @@key"
  },
  data: [
  	{ key: "123" },
  	{ key: "321" },
  ]
};

// returns : "my data 123\nmy data 321"
var result = gen.generate(options);
```

- template.txt

```txt
key: @@key
```

- data.json

```json
[
  { "key": "value1" },
  { "key": "value2" },
  { "key": "value3" }
]
```

then run:

```bash
node my-generator.js
```

- result.txt

```txt
key: value1
key: value2
key: value3
```
