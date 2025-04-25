# 🧾 Orçamento ClickArte

Sistema simples em Angular standalone para orçamentos gráficos da ClickArte Gráfica Rápida.

---

## 🌐 Acesse online

👉 [Clique aqui para abrir o sistema](https://leonardombr89.github.io/orcamento-clickarte/)

---

## 🚀 Tecnologias

- [Angular 17+ Standalone](https://angular.io/)
- [Bootstrap 5](https://getbootstrap.com/)
- HTML + CSS responsivo
- Deploy via GitHub Pages

---

## 📦 Como rodar localmente

```bash
# Clone o repositório
git clone git@github.com:leonardombr89/orcamento-clickarte.git

# Acesse a pasta
cd orcamento-clickarte

# Instale as dependências
npm install

# Rode localmente
ng serve
```

Abra no navegador:  
[http://localhost:4200](http://localhost:4200)

---

## 🛠️ Como publicar no GitHub Pages

```bash
# Gera o build na pasta docs/
ng build --output-path docs --base-href /orcamento-clickarte/

# (Se estiver usando SSR, copie os arquivos da pasta browser)
cp -r docs/browser/* docs/

# Adiciona o fallback 404.html
cp docs/index.html docs/404.html
```

Depois:

```bash
git add .
git commit -m "Deploy para GitHub Pages"
git push
```

---

Pronto! O sistema estará online no link abaixo:

📎 https://leonardombr89.github.io/orcamento-clickarte/

---

## ✨ Funcionalidades atuais

- [x] Formulário de orçamento para adesivos
- [x] Navegação por categorias (Adesivos, Placas, Outros)
- [x] Layout responsivo e moderno
- [x] Troca de formulário sem recarregar a página
- [x] Logo da empresa otimizada


