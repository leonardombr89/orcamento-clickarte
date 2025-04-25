# Define o repositório e o nome da aplicação
REPO=orcamento-clickarte

# Comando para gerar o build Angular
build:
	ng build --output-path docs --base-href /$(REPO)/

# Se tiver SSR (pasta browser/), copia os arquivos para docs/
copy:
	@if [ -d "docs/browser" ]; then \
		echo "Copiando arquivos da pasta browser/ para docs/ ..."; \
		cp -r docs/browser/* docs/; \
	fi

# Garante que o 404.html está no lugar
fix-404:
	@if [ -f "docs/index.html" ]; then \
		cp docs/index.html docs/404.html; \
	fi

# Comando para adicionar, commitar e fazer push
push:
	git add .
	git commit -m "Deploy atualizado para GitHub Pages"
	git push

# Comando completo: build -> copy -> fix 404 -> push
deploy: build copy fix-404 push
