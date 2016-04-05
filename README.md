# Gen

Generator based in templates and json data.

## Usage

Programatic:
```bash
npm install gen --save
```

## Example

```js
// gen_result_file.js

var Gen = require('gen');

Gen({
  result: "./results/result_file.sql", 
  template: {
    header: './templates/template_header.sql', // optional header
    body: './templates/template_corpo.sql' // must have
  },
  data: './data/data.json' // optional
});
```

```sql

-- ./templates/template_corpo.sql

insert into cadastro.cliente_motorista (
  motorista
  , cpf
  , senha
  , ativo
  , cliente
  , usuario
  , evento
  , limite
  , limite_disponivel
  )
  select
  '@@nome'
  , '@@cpf'
  , '@@senha'
  , '@@ativo'
  , codigo
  , usuario
  , current_timestamp
  , 0
  , 0
  from clientes
  where cnpj = '@@cli_ds_cnpj'
```

```json
[
  {
    "nome": "João",
    "cpf": "123.123.123-23",
    "senha": "123456",
    "ativo": "S",
    "cli_ds_cnpj": "00.000.000/0001-00"
  },
  {
    "nome": "Breno",
    "cpf": "123.123.123-23",
    "senha": "123456",
    "ativo": "S",
    "cli_ds_cnpj": "11.111.111/0001-00"
  }
]
```

```sql

  insert into cadastro.cliente_motorista (
    clm_ds_cliente_motorista
    , clm_ds_cpf
    , clm_ds_senha
    , clm_fl_ativo
    , clm_cd_cliente
    , clm_cd_usuario
    , clm_ts_evento
    , clm_vl_limite
    , clm_vl_limite_disponivel
  )
  select
    'João'
    , '123.123.123-23'
    , '123456'
    , 'S'
    , codigo
    , usuario
    , current_timestamp
    , 0
    , 0
  from clientes
  where cnpj = '00.000.000/0001-00'

  insert into cadastro.cliente_motorista (
    clm_ds_cliente_motorista
    , clm_ds_cpf
    , clm_ds_senha
    , clm_fl_ativo
    , clm_cd_cliente
    , clm_cd_usuario
    , clm_ts_evento
    , clm_vl_limite
    , clm_vl_limite_disponivel
  )
  select
    'Breno'
    , '123.123.123-23'
    , '123456'
    , 'S'
    , codigo
    , usuario
    , current_timestamp
    , 0
    , 0
  from clientes
  where cnpj = '11.111.111/0001-00'
```
