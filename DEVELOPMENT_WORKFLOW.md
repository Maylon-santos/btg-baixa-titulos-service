# DEVELOPMENT_WORKFLOW.md

# Fluxo de Desenvolvimento e Publicação

## Objetivo

Este documento descreve o processo oficial para realizar alterações no projeto e publicá-las em produção com segurança.

Seguir este fluxo evita:

* perda de código
* divergência entre ambientes
* deploys incompletos
* indisponibilidade do sistema

---

# Arquitetura dos Ambientes

```txt
Máquina Local
      ↓
GitHub
      ↓
Servidor Produção
      ↓
Docker
      ↓
Usuário Final
```

Toda alteração deve seguir esse fluxo.

---

# Regra Principal

NUNCA alterar diretamente arquivos da aplicação em produção.

Toda alteração deve ser realizada:

```txt
Máquina Local
↓
GitHub
↓
Servidor
```
# Sempre comece o dia com 
git pull origin main
# Depois

desenvolver
↓
testar
↓
git add .
↓
git commit
↓
git push
---

# Cenário 1

## Alteração simples de Frontend

Exemplo:

Alterar:

```txt
btg-baixa-frontend/index.html
```

De:

```html
<title>Oneup-btg-retorno</title>
```

Para:

```html
<title>BTG Retorno Financeiro</title>
```

---

## Passo 1

Realizar alteração local.

---

## Passo 2

Testar localmente.

Entrar no frontend:

```bash
cd btg-baixa-frontend
```

Executar:

```bash
npm run dev
```

Verificar:

```txt
http://localhost:5173
```

---

## Passo 3

Validar build.

```bash
npm run build
```

Se gerar:

```txt
dist/
```

sem erros, continuar.

---

## Passo 4

Salvar no Git.

```bash
git add .
```

```bash
git commit -m "feat: altera titulo da aplicacao"
```

---

## Passo 5

## Passo 5

Enviar para GitHub.

```bash
git push origin main
---

## Passo 6

Acessar servidor.

```bash
ssh joinnetwork@SERVIDOR
```

---

## Passo 7

Entrar no projeto.

```bash
cd ~/apps/btg-baixa-titulos-service
```

---

## Passo 8

Atualizar código.

```bash
git pull origin main
```

---

## Passo 9

Rebuild frontend.

```bash
docker-compose -f docker-compose.prod.yml build btg-baixa-frontend
```

---

## Passo 10

Reiniciar frontend.

```bash
docker-compose -f docker-compose.prod.yml up -d btg-baixa-frontend
```

---

## Passo 11

Validar.

```bash
curl -I http://127.0.0.1:18100
```

Resultado esperado:

```txt
HTTP/1.1 200 OK
```

---

## Passo 12

Validar produção.

Abrir:

```txt
https://servicesoneup.joinnetwork.tech
```

---

# Cenário 2

## Alteração Backend

Exemplo:

```txt
src/modules/processamento/processamento.service.js
```

---

## Fluxo

Local:

```bash
git add .
git commit -m "fix: corrige processamento"
git push origin main
```

Servidor:

```bash
git pull origin main
```

---

## Rebuild backend

```bash
docker-compose -f docker-compose.prod.yml build btg-baixa-backend
```

---

## Reiniciar backend

```bash
docker-compose -f docker-compose.prod.yml up -d btg-baixa-backend
```

---

## Testar

```bash
curl http://127.0.0.1:3334/health
```

Resultado esperado:

```json
{
  "success": true
}
```

---

# Cenário 3

## Alteração Frontend + Backend

Quando ambos forem alterados.

Servidor:

```bash
git pull origin main
```

```bash
docker-compose -f docker-compose.prod.yml build
```

```bash
docker-compose -f docker-compose.prod.yml up -d
```

---

# Cenário 4

## Alteração somente .env

Exemplo:

```env
WHATSAPP_NUMBER=
VALOR_TOLERANCIA=
```

Não precisa rebuild.

Executar:

```bash
docker-compose -f docker-compose.prod.yml up -d --force-recreate btg-baixa-backend
```

ou

```bash
docker restart btg-baixa-backend
```

---

# Cenário 5

## Alteração Nginx

Arquivo:

```txt
/etc/nginx/sites-available/servicesoneup
```

Após alterar:

```bash
sudo nginx -t
```

Se OK:

```bash
sudo systemctl reload nginx
```

---

# Validação Pós Deploy

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

---

## Frontend

```bash
curl -I http://127.0.0.1:18100
```

---

## Produção

```txt
https://servicesoneup.joinnetwork.tech
```

---

# Verificação de Logs

Backend:

```bash
docker logs btg-baixa-backend --tail=100
```

Frontend:

```bash
docker logs btg-baixa-frontend --tail=100
```

Tempo real:

```bash
docker logs -f btg-baixa-backend
```

---

# Recuperação de Emergência

## Ver último commit

```bash
git log --oneline -10
```

---

## Voltar um commit

```bash
git reset --hard HEAD~1
```

---

## Rebuild

```bash
docker-compose -f docker-compose.prod.yml build
```

```bash
docker-compose -f docker-compose.prod.yml up -d
```

---

# Checklist Antes de Publicar

Sempre confirmar:

```txt
☑ Código testado localmente
☑ npm run build sem erros
☑ Commit realizado
☑ Push realizado
☑ git pull no servidor
☑ Containers reconstruídos
☑ Health check OK
☑ Site acessível
☑ Logs sem erros
```

---

# Fluxo Oficial Resumido

```txt
Alterar código
      ↓
Testar local
      ↓
npm run build
      ↓
git add .
      ↓
git commit
      ↓
git push
      ↓
Servidor
      ↓
git pull
      ↓
docker-compose build
      ↓
docker-compose up -d
      ↓
Validação
      ↓
Produção
```
