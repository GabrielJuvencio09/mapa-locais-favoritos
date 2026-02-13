📍 Mapa de Locais Favoritos
📖 Sobre o Projeto

Este projeto foi desenvolvido como parte de um desafio técnico para vaga de Desenvolvedor Front-end.

A aplicação permite que o usuário visualize um mapa interativo, busque por endereços, selecione pontos diretamente no mapa e salve locais como favoritos com um apelido personalizado (como “Casa” ou “Trabalho”).

O foco principal foi a integração com API de mapas, gerenciamento de estado da aplicação e construção de uma interface clara e funcional.

🚀 Funcionalidades

✅ Exibição de mapa interativo (Leaflet)

✅ Inicialização em Uberlândia-MG

✅ Busca de endereços utilizando API pública (Nominatim / OpenStreetMap)

✅ Centralização automática do mapa ao buscar

✅ Seleção de qualquer ponto do mapa com clique

✅ Exibição de latitude e longitude

✅ Salvamento de locais favoritos com:

Nome personalizado (apelido)

Latitude

Longitude

✅ Persistência dos favoritos no localStorage

✅ Lista lateral de locais salvos

✅ Ao clicar em um favorito:

O mapa centraliza

O popup é aberto automaticamente

✅ Tratamento de loading e erros

✅ Interface responsiva (desktop e mobile)

🛠️ Tecnologias Utilizadas

React + Vite → Estrutura base da aplicação

TailwindCSS → Estilização e responsividade

Leaflet + React Leaflet → Mapa interativo

React Query → Requisições para API de geocodificação

Zustand → Gerenciamento de estado global

Persist Middleware (Zustand) → Persistência dos favoritos

🧠 Decisões Técnicas
Gerenciamento de Estado

Optei por utilizar o Zustand por ser simples, leve e de fácil integração com projetos React menores.
A persistência foi feita com o middleware persist, salvando os dados no localStorage.

Busca e Geocodificação

Utilizei a API pública do OpenStreetMap (Nominatim) para:

Buscar endereços digitados pelo usuário

Obter o endereço aproximado ao clicar no mapa (reverse geocoding)

O React Query foi utilizado para:

Controlar requisições

Tratar estados de loading

Tratar erros

Experiência do Usuário

Algumas melhorias implementadas:

Popup abre automaticamente ao clicar em um favorito

Botão desabilitado quando o local já está salvo

Feedback visual ao salvar

Destaque visual para o favorito selecionado

Interface limpa e responsiva


📂 Como Rodar o Projeto Localmente





📌 Possíveis Melhorias Futuras

Permitir edição do nome (apelido) do favorito

Melhorar animações e microinterações

Criar backend para evitar dependência direta da API pública

Adicionar testes automatizados

Melhorar feedback visual para estados de erro

📎 Considerações Finais

Durante o desenvolvimento, busquei manter o código organizado, com separação de responsabilidades e componentes reutilizáveis.

Como desenvolvedor em início de carreira, meu objetivo foi aplicar boas práticas, utilizar ferramentas adequadas para gerenciamento de estado e requisições, além de entregar uma aplicação funcional e bem estruturada.
