document.addEventListener("DOMContentLoaded", function () {
	// Objetivo:
	// Enviar um texto de um formulário para uma API do n8n e exibir o resultado o código html, css e colocar a animação no fundo da tela do site.

	// Passos:
	// 1. No JavaScript, pegar o evento de submit do formulário para evitar o recarregamento da página.

	const form = document.querySelector(".form-group");
	const input = document.getElementById("description");
	const htmlCode = document.getElementById("html-code");
	const cssCode = document.getElementById("css-code");
	const preview = document.getElementById("preview-section");

	form.addEventListener("submit", async function (event) {
		event.preventDefault();

		// 2. Obter o valor digitado pelo usuário no campo de texto.

		const description = input.value.trim();

		if (!description) {
			return;
		}

		setLoading(true);

		try {
			// 4. Fazer uma requisição HTTP (POST) para a API do n8n, enviando o texto do formulário no corpo da requisição em formato JSON.
			const response = await fetch("https://n8n.srv830193.hstgr.cloud/webhook/4096b767-f3fb-4244-bb3c-2df7994c2262", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ description }),
			});

			// 5. Receber a resposta da API do n8n (esperando um JSON com o código HTML/CSS do background).
			// Converte a resposta da API em um objeto JSON
			const data = await response.json();

			// 6. Se a resposta for válida, exibir o código HTML/CSS retornado na tela:
			//    - Mostrar o HTML e o CSS gerado em uma área de preview.
			//    - Inserir o CSS retornado dinamicamente na página para aplicar o background.
			// Exibe o código HTML gerado no elemento de texto (código-fonte)
			htmlCode.textContent = data.code || "";

			// Exibe o código CSS gerado no elemento de texto (código-fonte)
			cssCode.textContent = data.style || "";

			// Mostra a seção de preview tornando-a visível
			preview.style.display = "block";

			// Insere o código HTML gerado no preview para visualização imediata
			preview.innerHTML = data.code || "";

			// Tenta obter uma tag <style> existente com id "dynamic-style"
			let styleTag = document.getElementById("dynamic-style");

			// Se uma tag de estilo anterior existir, remove-a para evitar duplicação
			if (styleTag) {
				styleTag.remove();
			}

			// Se o CSS foi retornado pela API, cria e injeta um novo <style> no documento
			if (data.style) {
				// Cria uma nova tag <style>
				styleTag = document.createElement("style");

				// Define um id único para identificar a tag mais tarde
				styleTag.id = "dynamic-style";

				// Insere o CSS retornado pela API no conteúdo da tag
				styleTag.textContent = data.style;

				// Adiciona a tag <style> no head do documento para aplicar os estilos
				document.head.appendChild(styleTag);
			}
		} catch (error) {
			console.error("Erro ao gerar o fundo mágico:", error);
			htmlCode.textContent = "Não consegui gerar o HTML. Tente novamente.";
			cssCode.textContent = "Não consegui gerar o CSS. Tente novamente.";
			preview.innerHTML = "";
		} finally {
			setLoading(false);
		}
	});

	// 3. Exibir um indicador de carregamento enquanto a requisição está sendo processada.
	function setLoading(isLoading) {
		const button = document.getElementById("btn-text");

		if (isLoading) {
			button.innerHTML = "Gerando Background...";
		} else {
			button.innerHTML = "Gerar Background Mágico";
		}
	}
});
