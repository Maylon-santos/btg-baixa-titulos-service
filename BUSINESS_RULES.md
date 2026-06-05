# BUSINESS_RULES.md

# BTG Baixa de Títulos - Regras de Negócio

## Objetivo

Este documento descreve todas as regras de negócio utilizadas pelo sistema BTG Baixa de Títulos.

Seu objetivo é garantir que futuras alterações mantenham a integridade financeira do processo.

---

# Fluxo Oficial

```txt
Planilha BTG
    ↓
Importação
    ↓
Validação
    ↓
Consulta Millennium
    ↓
Validação Financeira
    ↓
Baixa Financeira
    ↓
Relatórios
    ↓
Histórico
```

---

# Identificação do Título

Cada título é identificado por:

```txt
Número do Documento
+
CPF ou CNPJ
```

Exemplos:

```txt
123456/A
123456/B
123456/C
```

---

# Regra de Consulta

## Pessoa Física

Quando o documento possuir CPF:

```http
GET /CONSULTALANCAMENTOS
?cpf=12345678900
&n_documento=123456/A
```

---

## Pessoa Jurídica

Quando o documento possuir CNPJ:

```http
GET /CONSULTALANCAMENTOS
?cnpj=00.000.000/0001-00
&n_documento=123456/A
```

---

# Regra de Existência

## Título não encontrado

Caso o Millennium não retorne nenhum registro:

Status:

```txt
ERRO_TITULO_NAO_ENCONTRADO
```

O sistema:

* não realiza baixa
* registra no relatório de erros

---

# Regra de Título Já Baixado

Quando:

```txt
situacao = BAIXADO
```

O sistema:

* não realiza nova baixa
* não valida valores
* não gera erro

Status:

```txt
JA_BAIXADO
```

Este status é contabilizado separadamente.

---

# Regra de Validação Financeira

A validação ocorre utilizando:

```txt
valor_inicial
```

retornado pelo Millennium.

---

## Comparação

Planilha:

```txt
Valor do Título
```

Millennium:

```txt
valor_inicial
```

---

## Regra

Se:

```txt
ABS(valorPlanilha - valorInicial)
<= VALOR_TOLERANCIA
```

o título é considerado válido.

---

# Tolerância Financeira

Variável:

```env
VALOR_TOLERANCIA=0.02
```

Valor padrão:

```txt
R$ 0,02
```

Objetivo:

Evitar rejeições por arredondamento.

---

## Exemplo Aceito

Planilha:

```txt
100,01
```

Millennium:

```txt
100,00
```

Diferença:

```txt
0,01
```

Resultado:

```txt
VALIDO
```

---

## Exemplo Rejeitado

Planilha:

```txt
105,00
```

Millennium:

```txt
100,00
```

Diferença:

```txt
5,00
```

Resultado:

```txt
ERRO_DIVERGENCIA_VALOR
```

---

# Regra de Acréscimo

## Cenário

Valor Inicial:

```txt
2647,11
```

Valor Pago:

```txt
2894,11
```

Diferença:

```txt
247,00
```

---

## Regra

Quando:

```txt
valorPago > valorInicial
```

calcular:

```txt
acres_decres =
valorPago - valorInicial
```

Resultado:

```txt
247,00
```

---

## Payload

```json
{
  "valor": 2647.11,
  "valor_pago": 2894.11,
  "acres_decres": 247.00
}
```

---

# Regra de Desconto

Quando:

```txt
valorPago < valorInicial
```

calcular:

```txt
acres_decres =
valorPago - valorInicial
```

Resultado:

```txt
Valor negativo
```

Exemplo:

```txt
valorInicial = 100,00
valorPago = 95,00

acres_decres = -5,00
```

---

# Regra de Baixa

A baixa somente ocorre quando:

```txt
Título encontrado
+
Não está baixado
+
Valor válido
```

---

# Regra de Data de Pagamento

Origem:

```txt
Planilha BTG
```

Formato recebido:

```txt
DD/MM/YYYY
```

Formato enviado:

```txt
YYYY-MM-DD
```

Exemplo:

```txt
12/05/2026
```

↓

```txt
2026-05-12
```

---

# Regra de CPF/CNPJ

Antes da consulta:

Remover:

```txt
.
/
-
espaços
```

Exemplos:

```txt
73.652.158/0001-10
```

↓

```txt
73652158000110
```

---

```txt
123.456.789-00
```

↓

```txt
12345678900
```

---

# Regra de Franquias

Registros identificados como franquias:

* não seguem fluxo padrão
* são separados

Arquivo:

```txt
franquias.json
```

---

# Regra de Erros

Todo erro deve gerar:

```txt
status = ERRO
```

e ser registrado em:

```txt
erros-processamento.json
```

---

# Tipos de Erro

## Documento Não Encontrado

```txt
ERRO_TITULO_NAO_ENCONTRADO
```

---

## Divergência Financeira

```txt
ERRO_DIVERGENCIA_VALOR
```

---

## Erro Millennium

```txt
ERRO_CONSULTA
```

---

## Erro de Baixa

```txt
ERRO_BAIXA
```

---

## Erro Desconhecido

```txt
ERRO_DESCONHECIDO
```

---

# Regra de Histórico

Todo processamento deve gerar:

```txt
processamentoId
```

Formato:

```txt
BTG-YYYYMMDD-XXXXXX
```

Exemplo:

```txt
BTG-20260605-B5D7E1
```

---

# Regra de Persistência

Todo processamento deve armazenar:

```txt
status.json
dashboard.json
resultado-processamento.json
resumo-processamento.json
erros-processamento.json
```

---

# Regra de Dashboard

Indicadores obrigatórios:

```txt
Total
Sucesso
Já Baixados
Erros
Percentual
```

---

# Regra de Notificação WhatsApp

Quando habilitado:

```env
WHATSAPP_ENABLED=true
```

Ao finalizar o processamento enviar:

```txt
Processamento ID
Total
Sucesso
Já Baixados
Erros
Tempo
```

---

# Regra de Segurança

Nunca armazenar em Git:

```txt
.env
logs/
storage/
```

---

# Regras que NÃO podem ser alteradas sem validação do negócio

* Tratamento de título já baixado
* Regra de CPF/CNPJ
* Regra de tolerância financeira
* Regra de acréscimos
* Regra de descontos
* Regra de baixa financeira
* Regra de data de pagamento
* Regra de geração de relatórios

Qualquer alteração nestes itens deve ser validada pelo responsável do processo financeiro.

---

# Responsável pelas Regras

Empresa:

Join Network / OneUp

Projeto:

BTG Baixa de Títulos

Responsável Técnico:

Maylon Santos
