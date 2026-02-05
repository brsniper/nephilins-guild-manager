# 🚀 Deploy no Vercel - Nephilins Guild Manager

Seu projeto está pronto para ser deployado no Vercel! Aqui está como fazer:

## 📋 Pré-requisitos

- ✅ Repositório GitHub criado: https://github.com/brsniper/nephilins-guild-manager
- ✅ Código enviado para o GitHub
- ✅ Conta no Vercel (crie em https://vercel.com se não tiver)

## 🎯 Passo a Passo para Deploy

### 1️⃣ Acessar o Vercel

1. Vá para: https://vercel.com
2. Clique em **"Sign Up"** (ou **"Sign In"** se já tiver conta)
3. Escolha **"Continue with GitHub"**
4. Autorize o Vercel a acessar seus repositórios

### 2️⃣ Importar o Repositório

1. Após fazer login, você verá a página de dashboard
2. Clique em **"Add New..."** → **"Project"**
3. Procure por **"nephilins-guild-manager"** na lista
4. Clique em **"Import"**

### 3️⃣ Configurar Variáveis de Ambiente

1. Na tela de configuração do projeto, procure por **"Environment Variables"**
2. Adicione a seguinte variável:
   - **Name:** `GEMINI_API_KEY`
   - **Value:** Sua chave da API do Google AI (obtenha em https://ai.google.dev/)
3. Clique em **"Add"**

### 4️⃣ Deploy

1. Clique em **"Deploy"**
2. Aguarde 2-3 minutos enquanto o Vercel faz o build
3. Pronto! Seu site estará ao vivo! 🎉

## 📍 Acessar seu Site

Após o deploy, você terá uma URL como:
- `https://nephilins-guild-manager.vercel.app`

Ou um domínio customizado se configurar.

## 🔄 Atualizar o Site

Toda vez que você fizer `git push` para o `main`:

1. O Vercel detecta automaticamente
2. Faz o build do projeto
3. Faz deploy automático
4. Seu site atualiza em 2-3 minutos

**Nenhuma ação manual necessária!** ✨

## 🔐 Configurar a Chave da API do Gemini

### Obter a Chave

1. Vá para: https://ai.google.dev/
2. Clique em **"Get API Key"** ou **"Create API Key"**
3. Siga as instruções para criar uma chave
4. Copie a chave gerada

### Adicionar no Vercel

1. Vá para seu projeto no Vercel
2. Clique em **"Settings"**
3. Procure por **"Environment Variables"**
4. Adicione ou atualize:
   - **Name:** `GEMINI_API_KEY`
   - **Value:** Sua chave copiada
5. Clique em **"Save"**
6. Clique em **"Redeploy"** para aplicar a mudança

## 📝 Como Atualizar o Site

### Opção 1: Via Google AI Studio

1. Faça as alterações no Google AI Studio
2. Exporte como ZIP
3. Extraia e copie os arquivos para seu repositório local
4. Execute:
   ```bash
   git add .
   git commit -m "Descrição das mudanças"
   git push origin main
   ```
5. O Vercel faz deploy automaticamente!

### Opção 2: Via Git Localmente

1. Clone o repositório:
   ```bash
   git clone https://github.com/brsniper/nephilins-guild-manager.git
   cd nephilins-guild-manager
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Faça suas alterações

4. Teste localmente:
   ```bash
   npm run dev
   ```

5. Faça commit e push:
   ```bash
   git add .
   git commit -m "Descrição das mudanças"
   git push origin main
   ```

6. O Vercel faz deploy automaticamente!

## 🔗 Links Úteis

| Recurso | Link |
|---------|------|
| **Seu Repositório** | https://github.com/brsniper/nephilins-guild-manager |
| **Vercel Dashboard** | https://vercel.com/dashboard |
| **Google AI Studio** | https://ai.studio/ |
| **Google AI API** | https://ai.google.dev/ |
| **Documentação Vercel** | https://vercel.com/docs |

## ❓ Perguntas Frequentes

### P: Quanto tempo leva para o site atualizar?
**R:** Geralmente 2-3 minutos após fazer `git push`.

### P: Como vejo os logs do deploy?
**R:** No Vercel, clique no seu projeto → "Deployments" → clique no deploy → "Logs"

### P: Como desfaço uma alteração?
**R:** Use `git revert` ou `git reset` para voltar a uma versão anterior e faça push novamente.

### P: Posso usar um domínio customizado?
**R:** Sim! No Vercel, vá em "Settings" → "Domains" e configure seu domínio.

### P: O que fazer se o deploy falhar?
**R:** 
1. Verifique os logs no Vercel
2. Certifique-se de que o código funciona localmente com `npm run dev`
3. Verifique se o `package.json` está correto
4. Tente fazer um novo push

### P: Como adicionar mais variáveis de ambiente?
**R:** No Vercel, vá em "Settings" → "Environment Variables" e adicione quantas precisar.

## ✅ Checklist

- [ ] Conta no Vercel criada
- [ ] Repositório importado no Vercel
- [ ] Variável `GEMINI_API_KEY` configurada
- [ ] Deploy realizado com sucesso
- [ ] Site acessível em https://nephilins-guild-manager.vercel.app
- [ ] Testado localmente com `npm run dev`

## 🎉 Pronto!

Seu site está configurado e pronto para ser compartilhado com a guild! Basta fazer push para o GitHub e o Vercel cuida do resto! 🚀

---

**Status:** ✅ Pronto para Vercel!  
**Última atualização:** 05/02/2026
