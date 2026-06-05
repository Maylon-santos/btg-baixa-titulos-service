# ARCHITECTURE.md

# BTG Baixa de Títulos - Arquitetura e Regras de Negócio

## Objetivo

O sistema BTG Baixa de Títulos foi desenvolvido para automatizar o processo de baixa financeira de títulos através da integração entre:

* Planilhas de retorno BTG
* ERP Millennium
* API de Baixa Financeira
* Dashboard Web
* Histórico de Processamentos
* Notificações WhatsApp

O objetivo é eliminar processos manuais de conferência e baixa financeira.

---

# Visão Geral da Arquitetura

```txt
Usuário
   │
   ▼
Frontend React
   │
   ▼
API Node.js
   │
   ├── Processamento de Planilhas
   ├── Consulta Millennium
   ├── Validação Financeira
   ├── Baixa Financeira
   ├── Relatórios
   ├── Histórico
   └── WhatsApp
   │
   ▼
Millennium ERP
```

---

# Fluxo Geral

## Etapa 1 - Upload

O usuário envia uma planilha BTG pelo frontend.

Frontend:

```txt
UploadPlanilha
```

Backend:

```txt
POST /api/planilha/processar
```

---

## Etapa 2 - Leitura da Planilha

O sistema:

* valida o arquivo
* identifica colunas
* normaliza cabeçalhos
* converte valores monetários

Resultado:

```txt
processaveis.json
```

---

## Etapa 3 - Separação de Registros

Os registros são classificados em:

### Processáveis

Títulos aptos para consulta.

### Franquias

Títulos pertencentes a franquias.

Arquivo:

```txt
franquias.json
```

### Erros

Registros inválidos.

Arquivo:

```txt
erros.json
```

---

# Consulta Millennium

## Identificação do Documento

O sistema utiliza:

```txt
Número Documento
CPF ou CNPJ
```

---

## Consulta por CPF

```http
GET /CONSULTALANCAMENTOS
?cpf=12345678900
&n_documento=12345/A
```

---

## Consulta por CNPJ

```http
GET /CONSULTALANCAMENTOS
?cnpj=00.000.000/0001-00
&n_documento=12345/A
```

---

# Regras de Validação

## Regra 1 - Documento Encontrado

Se o Millennium não retornar o título:

```txt
ERRO_TITULO_NAO_ENCONTRADO
```

---

## Regra 2 - Título Já Baixado

Se:

```txt
situacao = BAIXADO
```

Resultado:

```txt
JA_BAIXADO
```

O sistema:

* não valida valores
* não tenta baixar novamente
* contabiliza como sucesso operacional

---

## Regra 3 - Validação Financeira

Comparação:

```txt
Planilha
vs
Millennium
```

Campo utilizado:

```txt
valor_inicial
```

---

### Tolerância

Configurável:

```env
VALOR_TOLERANCIA=0.02
```

Diferenças menores que a tolerância são aceitas.

---

# Tratamento de Acréscimos

## Cenário

Planilha:

```txt
Valor Pago = 2894.11
```

Millennium:

```txt
Valor Inicial = 2647.11
```

Diferença:

```txt
247.00
```

---

## Regra

O sistema calcula:

```txt
acres_decres
=
valorPago
-
valorInicial
```

Resultado:

```txt
247.00
```

---

## Payload de Baixa

```json
{
  "valor": 2647.11,
  "valor_pago": 2894.11,
  "acres_decres": 247.00
}
```

---

# Tratamento de Descontos

Caso:

```txt
valorPago < valorInicial
```

O desconto é enviado como:

```txt
acres_decres negativo
```

---

# Data de Pagamento

Origem:

```txt
Planilha BTG
```

Conversão:

```txt
DD/MM/YYYY
↓
YYYY-MM-DD
```

Exemplo:

```txt
12/05/2026
↓
2026-05-12
```

---

# Processo de Baixa

Após validação:

```txt
CONSULTA
↓
VALIDAÇÃO
↓
BAIXA
```

---

# Atualização de Status

Durante o processamento é gerado:

```txt
status.json
```

Estrutura:

```json
{
  "processamentoId": "BTG-XXXX",
  "status": "PROCESSANDO",
  "etapa": "CONSULTANDO_TITULOS",
  "total": 746,
  "processados": 120,
  "sucesso": 90,
  "jaBaixados": 20,
  "erros": 10,
  "percentual": 16.08
}
```

---

# Dashboard

Após o processamento:

```txt
dashboard.json
```

Contém:

* Total
* Sucesso
* Já Baixados
* Erros
* Percentual

---

# Histórico

Todos os processamentos ficam armazenados.

Estrutura:

```txt
storage/processamentos/
```

Exemplo:

```txt
BTG-20260605-2CDB93
BTG-20260605-B5D7E1
```

---

# Relatórios Gerados

## Resumo

```txt
resumo-processamento.json
```

---

## Dashboard

```txt
dashboard.json
```

---

## Erros

```txt
erros-processamento.json
```

---

## Processáveis

```txt
processaveis.json
```

---

## Franquias

```txt
franquias.json
```

---

# Notificações WhatsApp

Ao finalizar:

```txt
PROCESSAMENTO FINALIZADO
```

O sistema pode enviar:

```txt
Total Processado
Sucesso
Já Baixados
Erros
Tempo
```

Configuração:

```env
WHATSAPP_ENABLED=true
```

---

# Frontend

Tecnologias:

* React
* Vite
* Axios
* Recharts

---

# Componentes Principais

## Upload

```txt
UploadPlanilha.jsx
```

---

## Dashboard

```txt
DashboardResumo.jsx
```

---

## KPIs

```txt
KpiCards.jsx
```

---

## Gráfico

```txt
ResultadoChart.jsx
```

---

## Histórico

```txt
HistoricoProcessamentos.jsx
```

---

# Backend

Arquitetura Modular

```txt
src/modules/
```

Módulos:

```txt
processamento
historico
millennium
baixa
whatsapp
```

---

# Persistência

Atualmente:

```txt
Filesystem
```

Não utiliza banco de dados.

Todos os dados são armazenados em:

```txt
storage/
```

---

# Evolução Planejada

## Fase 2

Processamento assíncrono:

```txt
Upload
↓
Fila
↓
Worker
↓
Status
```

---

## Fase 3

Autenticação:

* JWT
* Perfis

---

## Fase 4

Banco de Dados

Opções:

* PostgreSQL
* SQLite

---

## Fase 5

Dashboard Executivo

Métricas:

* Valor Total Baixado
* Taxa de Sucesso
* Tempo Médio
* Erros por Motivo

---

# Padrões de Desenvolvimento

## Backend

* Código modular
* Services
* Controllers
* Routes
* Helpers
* Winston Logs

---

## Frontend

* Componentização
* Responsivo
* Dashboard corporativo
* Histórico persistente

---

# Responsáveis

Projeto:

BTG Baixa de Títulos

Empresa:

Join Network / OneUp

Responsável Técnico:

Maylon Santos

Repositório:

https://github.com/Maylon-santos/btg-baixa-titulos-service
