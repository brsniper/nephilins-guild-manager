# ✅ Setup Completo - Nephilins Guild Manager

## 🎉 Parabéns! Seu repositório está pronto!

Seu projeto foi configurado com sucesso no GitHub e está pronto para ser publicado. Aqui está tudo que você precisa saber para começar a usar.

---

## 📍 Informações do Seu Projeto

| Informação | Valor |
|-----------|-------|
| **Repositório** | https://github.com/brsniper/nephilins-guild-manager |
| **URL do Site** | https://brsniper.github.io/nephilins-guild-manager/ |
| **Branch Principal** | `main` |
| **Tecnologia** | React + TypeScript + Vite |
| **Integração** | Google AI Studio (Gemini API) |

---

## 🚀 Próximos Passos

### 1️⃣ Ativar GitHub Pages (IMPORTANTE!)

Você precisa fazer isso **UMA VEZ** para ativar o GitHub Pages:

1. Vá para: https://github.com/brsniper/nephilins-guild-manager/settings
2. Procure por **"Pages"** no menu lateral esquerdo
3. Em **"Source"**, selecione:
   - **Branch**: `gh-pages`
   - **Folder**: `/ (root)`
4. Clique em **"Save"**

✅ **Pronto!** O GitHub Pages agora está ativado. O site será publicado automaticamente quando você fizer push para `main`.

### 2️⃣ Testar o Deploy

Após ativar o GitHub Pages:

1. Vá para: https://github.com/brsniper/nephilins-guild-manager/actions
2. Aguarde o workflow `Deploy to GitHub Pages` ser concluído (deve ficar verde ✅)
3. Acesse: https://brsniper.github.io/nephilins-guild-manager/
4. Seu site deve estar ao vivo! 🎉

---

## 🔄 Como Atualizar o Site

### Opção A: Via Google AI Studio (Recomendado para você)

1. **Abra o Google AI Studio:**
   - https://ai.studio/apps/drive/1zV8q_Xs1tvnOP_aQ4eVQf9SFd6n_E_X8

2. **Faça suas alterações** no AI Studio

3. **Exporte o projeto:**
   - Clique em "Export" ou "Download"
   - Escolha "Download as ZIP"

4. **Extraia o arquivo ZIP** em uma pasta no seu computador

5. **Copie os arquivos atualizados** para a pasta do seu repositório local

6. **Faça upload para o GitHub:**
   ```bash
   # Na pasta do seu projeto
   git add .
   git commit -m "Descrição das mudanças"
   git push origin main
   ```

7. **Aguarde 2-3 minutos** e acesse o site para ver as mudanças

### Opção B: Via Git Localmente

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/brsniper/nephilins-guild-manager.git
   cd nephilins-guild-manager
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Faça suas alterações** nos arquivos

4. **Teste localmente:**
   ```bash
   npm run dev
   ```
   - Acesse: http://localhost:3000

5. **Faça commit e push:**
   ```bash
   git add .
   git commit -m "Descrição das mudanças"
   git push origin main
   ```

6. **Aguarde o deploy automático** (2-3 minutos)

---

## 🔐 Configurar a Chave da API do Gemini

### Para Desenvolvimento Local

1. **Obtenha sua chave de API:**
   - Acesse: https://ai.google.dev/
   - Clique em "Get API Key"
   - Crie uma chave para seu projeto

2. **Configure a chave localmente:**
   - Crie um arquivo `.env.local` na raiz do projeto:
   ```
   GEMINI_API_KEY=sua_chave_aqui
   ```

3. **Importante:**
   - ⚠️ **Nunca** faça commit do arquivo `.env.local`
   - Ele já está no `.gitignore` (protegido)
   - A chave é usada apenas localmente

### Para Produção (GitHub Pages)

- A chave é lida do arquivo `.env.local` durante o build
- No GitHub Actions, usamos um placeholder durante o build
- Se precisar usar a API em produção, você precisará de um backend seguro

---

## 📊 Estrutura do Projeto

```
nephilins-guild-manager/
├── .github/
│   └── workflows/
│       └── deploy.yml              # Workflow de deploy automático
├── components/
│   └── PTCard.tsx                  # Componentes React
├── App.tsx                         # Componente principal
├── index.tsx                       # Entrada da aplicação
├── index.html                      # HTML base
├── vite.config.ts                  # Configuração do Vite
├── tsconfig.json                   # Configuração do TypeScript
├── package.json                    # Dependências do projeto
├── .env.local                      # Variáveis de ambiente (não fazer commit)
├── .gitignore                      # Arquivos a ignorar
├── README.md                       # Documentação
└── DEPLOYMENT_GUIDE.md             # Guia de deployment
```

---

## 🔄 Workflow de Deploy Automático

Quando você faz `git push origin main`:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. GitHub Actions detecta o push                            │
├─────────────────────────────────────────────────────────────┤
│ 2. Instala as dependências (npm install)                    │
├─────────────────────────────────────────────────────────────┤
│ 3. Faz o build do projeto (npm run build)                   │
├─────────────────────────────────────────────────────────────┤
│ 4. Gera os arquivos estáticos na pasta dist/                │
├─────────────────────────────────────────────────────────────┤
│ 5. Faz deploy automático no GitHub Pages                    │
├─────────────────────────────────────────────────────────────┤
│ 6. Site atualizado em 2-3 minutos ✅                        │
└─────────────────────────────────────────────────────────────┘
```

**Acompanhe o progresso:** https://github.com/brsniper/nephilins-guild-manager/actions

---

## 🔗 Links Úteis

| Recurso | Link |
|---------|------|
| **Site ao vivo** | https://brsniper.github.io/nephilins-guild-manager/ |
| **Repositório** | https://github.com/brsniper/nephilins-guild-manager |
| **Google AI Studio** | https://ai.studio/apps/drive/1zV8q_Xs1tvnOP_aQ4eVQf9SFd6n_E_X8 |
| **Google AI API** | https://ai.google.dev/ |
| **Documentação Vite** | https://vitejs.dev/ |
| **Documentação React** | https://react.dev/ |
| **GitHub Pages Docs** | https://docs.github.com/en/pages |

---

## ❓ Perguntas Frequentes

### P: Quanto tempo leva para o site atualizar?
**R:** Geralmente 2-3 minutos após fazer `git push`.

### P: Como desfaço uma alteração?
**R:** Use `git revert` ou `git reset` para voltar a uma versão anterior.

### P: Posso usar um domínio customizado?
**R:** Sim! Vá em Settings > Pages no repositório e configure um domínio personalizado.

### P: Como compartilho o site com a guild?
**R:** Envie o link: https://brsniper.github.io/nephilins-guild-manager/

### P: O que fazer se o deploy falhar?
**R:** 
1. Verifique o status em: https://github.com/brsniper/nephilins-guild-manager/actions
2. Procure por erros na aba "Actions"
3. Verifique se o `npm install` funciona localmente
4. Certifique-se de que o código está correto

### P: Como usar a API do Gemini?
**R:** 
1. Configure a chave em `.env.local`
2. Use `process.env.GEMINI_API_KEY` no código
3. A chave é carregada automaticamente durante o build

---

## 🎯 Checklist de Configuração

- [ ] Repositório criado no GitHub
- [ ] Código enviado para o GitHub
- [ ] GitHub Pages ativado (Settings > Pages)
- [ ] Workflow de deploy configurado
- [ ] Site acessível em: https://brsniper.github.io/nephilins-guild-manager/
- [ ] Chave da API do Gemini configurada (se necessário)
- [ ] Testado localmente com `npm run dev`

---

## 📞 Próximas Ações

1. **Ative o GitHub Pages** (se ainda não fez)
2. **Teste o site** acessando: https://brsniper.github.io/nephilins-guild-manager/
3. **Compartilhe o link** com sua guild
4. **Comece a atualizar** o site via Google AI Studio ou Git

---

**Status:** ✅ Pronto para usar!  
**Última atualização:** 05/02/2026

Boa sorte com seu site da guild! 🚀
