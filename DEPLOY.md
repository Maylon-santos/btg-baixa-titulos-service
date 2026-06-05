# DEPLOY.md

# BTG Baixa de Títulos - Guia de Deploy e Operação

## Informações Gerais

Projeto para processamento de planilhas de retorno BTG, consulta e baixa de títulos no Millennium, geração de relatórios, dashboard web e histórico de processamentos.

---

## Produção

### URL

Frontend:

https://servicesoneup.joinnetwork.tech

API:

https://servicesoneup.joinnetwork.tech/api

Health Check:

https://servicesoneup.joinnetwork.tech/api/health

---

## Servidor

### Infraestrutura

Fornecedor: Localweb

Sistema Operacional:

Ubuntu 20.04 LTS

Recursos:

* 4 vCPUs
* 8GB RAM
* 10GB SSD

---

## Estrutura do Projeto

```txt
~/apps/
└── btg-baixa-titulos-service/
    ├── src/
    ├── btg-baixa-frontend/
    ├── storage/
    ├── logs/
    ├── Dockerfile
    ├── docker-compose.prod.yml
    ├── package.json
    └── .env
```

---

## Containers Docker

### Backend

Container:

```txt
btg-baixa-backend
```

Porta interna:

```txt
3333
```

Porta exposta localmente:

```txt
127.0.0.1:3334
```

---

### Frontend

Container:

```txt
btg-baixa-frontend
```

Porta interna:

```txt
80
```

Porta exposta localmente:

```txt
127.0.0.1:18100
```

---

## Nginx

Arquivo:

```bash
/etc/nginx/sites-available/servicesoneup
```

Link simbólico:

```bash
/etc/nginx/sites-enabled/servicesoneup
```

### Proxy API

```nginx
location /api/ {
    proxy_pass http://127.0.0.1:3334/;
}
```

### Frontend

```nginx
location / {
    proxy_pass http://127.0.0.1:18100;
}
```

---

## SSL

Certificado Let's Encrypt.

Domínio configurado:

```txt
servicesoneup.joinnetwork.tech
```

Renovar certificados:

```bash
sudo certbot renew
```

Verificar certificados:

```bash
sudo certbot certificates
```

---

# Fluxo de Deploy

## 1 - Atualizar código local

Validar:

```bash
npm test
```

Build frontend:

```bash
cd btg-baixa-frontend
npm run build
```

---

## 2 - Enviar para GitHub

```bash
git add .
git commit -m "descrição da alteração"
git push origin main
```

---

## 3 - Atualizar servidor

Conectar:

```bash
ssh joinnetwork@SERVIDOR
```

Entrar no projeto:

```bash
cd ~/apps/btg-baixa-titulos-service
```

Atualizar:

```bash
git pull origin main
```

---

## 4 - Rebuild Docker

Frontend e Backend:

```bash
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d
```

---

## Rebuild Somente Backend

```bash
docker-compose -f docker-compose.prod.yml build btg-baixa-backend
docker-compose -f docker-compose.prod.yml up -d btg-baixa-backend
```

---

## Rebuild Somente Frontend

```bash
docker-compose -f docker-compose.prod.yml build btg-baixa-frontend
docker-compose -f docker-compose.prod.yml up -d btg-baixa-frontend
```

---

# Verificações Pós Deploy

## Containers

```bash
docker ps | grep btg
```

Esperado:

```txt
btg-baixa-backend
btg-baixa-frontend
```

---

## Backend

```bash
curl http://127.0.0.1:3334/health
```

Resposta esperada:

```json
{
  "success": true,
  "status": "online"
}
```

---

## Frontend

```bash
curl -I http://127.0.0.1:18100
```

Resposta:

```txt
HTTP/1.1 200 OK
```

---

## API Pública

```bash
curl https://servicesoneup.joinnetwork.tech/api/health
```

---

# Logs

## Backend

```bash
docker logs btg-baixa-backend --tail=100
```

Acompanhar em tempo real:

```bash
docker logs -f btg-baixa-backend
```

---

## Frontend

```bash
docker logs btg-baixa-frontend --tail=100
```

---

## Logs físicos

```txt
logs/
├── app-YYYY-MM-DD.log
├── error-YYYY-MM-DD.log
```

---

# Estrutura de Armazenamento

```txt
storage/
├── entrada/
├── processamentos/
```

---

## Cada processamento gera

```txt
storage/processamentos/{PROCESSAMENTO_ID}/
```

Arquivos:

```txt
status.json
dashboard.json
resumo.json
franquias.json
processaveis.json
erros.json
resultado-processamento.json
resumo-processamento.json
erros-processamento.json
```

---

# Variáveis Importantes

Arquivo:

```txt
.env
```

Exemplos:

```env
PORT=3333

MILLENNIUM_BASE_URL=
MILLENNIUM_AUTHORIZATION=
MILLENNIUM_LICENSE_TYPE=

WHATSAPP_ENABLED=true
WHATSAPP_API_URL=
WHATSAPP_TOKEN=
WHATSAPP_NUMBER=

VALOR_TOLERANCIA=0.02
```

---

# Problemas Conhecidos

## Certbot

Caso SSL falhe:

Verificar DNS:

```bash
nslookup servicesoneup.joinnetwork.tech 8.8.8.8
nslookup servicesoneup.joinnetwork.tech 1.1.1.1
```

Resultado esperado:

```txt
191.252.1.241
```

---

## Docker Compose

Servidor utiliza:

```txt
docker-compose 1.25.0
```

Por compatibilidade:

```yaml
version: "3.7"
```

no arquivo:

```txt
docker-compose.prod.yml
```

---

# Backup

Backup recomendado:

```txt
.env
storage/
logs/
```

Não versionar:

```txt
node_modules/
logs/
storage/
.env
```

---

# Próximas Melhorias

* Processamento assíncrono real
* Login/JWT
* Dashboard executivo
* Filtros avançados
* Limpeza automática de logs
* Limpeza automática de processamentos antigos
* Relatórios WhatsApp automáticos
* Monitoramento de filas
* Testes automatizados completos

---

# Contato Técnico

Projeto mantido por:

Maylon Santos

Empresa:

Join Network / OneUp

Repositório:

https://github.com/Maylon-santos/btg-baixa-titulos-service
