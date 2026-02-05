# 🚀 Guia de Deployment - Nephilins Guild Manager

## ✅ Status Atual

Seu site está **pronto para ser acessado publicamente**! 

### 📍 URL do Site
```
https://brsniper.github.io/nephilins-guild-manager/
```

---

## 🔄 Como Atualizar o Site

### Opção 1: Atualizar via Google AI Studio (Recomendado)

1. **Abra o Google AI Studio:**
   - Acesse: https://ai.studio/apps/drive/1zV8q_Xs1tvnOP_aQ4eVQf9SFd6n_E_X8

2. **Faça suas alterações** no AI Studio

3. **Exporte o projeto:**
   - Clique em "Export" ou "Download"
   - Escolha "Download as ZIP"

4. **Extraia o arquivo ZIP** e copie os arquivos atualizados para seu computador

5. **Faça upload para o GitHub:**
   ```bash
   # No seu computador, na pasta do projeto
   git add .
   git commit -m "Descrição das mudanças"
   git push origin main
   ```

6. **Aguarde o deploy automático** (2-3 minutos)
   - Verifique o status em: https://github.com/brsniper/nephilins-guild-manager/actions

---

### Opção 2: Atualizar via Git Localmente

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

6. **Aguarde o deploy automático**

---

## 🔐 Variáveis de Ambiente

### Para usar a API do Gemini (Google AI Studio)

1. **Obtenha sua chave de API:**
   - Acesse: https://ai.google.dev/
   - Clique em "Get API Key"
   - Crie uma chave para seu projeto

2. **Configure a chave localmente:**
   - Crie um arquivo `.env.local` na raiz do projeto:
   ```
   GEMINI_API_KEY=sua_chave_aqui
   ```

3. **⚠️ IMPORTANTE:**
   - **Nunca** faça commit do arquivo `.env.local`
   - Ele já está no `.gitignore` (protegido)
   - A chave é usada apenas localmente durante o desenvolvimento

4. **Para produção:**
   - Se precisar usar a API em produção, você precisará de um backend seguro
   - Isso evita expor a chave no frontend

---

## 📊 Estrutura do Projeto

```
nephilins-guild-manager/
├── .github/
│   └── workflows/
│       └── deploy.yml          # Workflow de deploy automático
├── components/
│   └── PTCard.tsx              # Componentes React
├── App.tsx                      # Componente principal
├── index.tsx                    # Entrada da aplicação
├── index.html                   # HTML base
├── vite.config.ts              # Configuração do Vite
├── tsconfig.json               # Configuração do TypeScript
├── package.json                # Dependências do projeto
└── .env.local                  # Variáveis de ambiente (não fazer commit)
```

---

## 🚀 Workflow de Deploy Automático

Quando você faz `git push origin main`:

1. ✅ GitHub Actions detecta a mudança
2. ✅ Instala as dependências (`npm install`)
3. ✅ Faz o build do projeto (`npm run build`)
4. ✅ Gera os arquivos estáticos na pasta `dist/`
5. ✅ Faz deploy automático no GitHub Pages
6. ✅ Site atualizado em 2-3 minutos

**Acompanhe o progresso:** https://github.com/brsniper/nephilins-guild-manager/actions

---

## 🔗 Links Úteis

- **Site ao vivo:** https://brsniper.github.io/nephilins-guild-manager/
- **Repositório:** https://github.com/brsniper/nephilins-guild-manager
- **Google AI Studio:** https://ai.studio/apps/drive/1zV8q_Xs1tvnOP_aQ4eVQf9SFd6n_E_X8
- **Google AI API:** https://ai.google.dev/
- **Documentação Vite:** https://vitejs.dev/
- **Documentação React:** https://react.dev/

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

---

## 📞 Suporte

Se tiver dúvidas ou problemas:
1. Verifique o status do deploy em: https://github.com/brsniper/nephilins-guild-manager/actions
2. Procure por erros na aba "Actions"
3. Verifique se o `package.json` está correto
4. Certifique-se de que o `npm install` funciona localmente

---

**Última atualização:** 05/02/2026
**Status:** ✅ Pronto para usar!
