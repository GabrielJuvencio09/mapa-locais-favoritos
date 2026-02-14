# Mapa de Locais Favoritos

Aplicação desenvolvida como parte de um desafio técnico para a vaga de Desenvolvedor Front-end. 

O objetivo do projeto é permitir que o usuário visualize um mapa interativo, busque por endereços, selecione pontos no mapa e salve seus locais favoritos com apelidos personalizados (como “Casa” ou “Trabalho”). O foco principal do desenvolvimento foi a integração com APIs de mapas e geocodificação, além do gerenciamento de estado da aplicação.

🔗 **[Acessar a aplicação online](https://mapa-locais-favoritos.vercel.app)**

## Funcionalidades

- Exibição de mapa interativo via Leaflet (inicializado em Uberlândia-MG).
- Busca de endereços e centralização automática utilizando a API pública Nominatim (OpenStreetMap).
- Seleção de pontos no mapa via clique (com exibição de latitude/longitude).
- Salvamento de favoritos (nome personalizado e coordenadas) com persistência via `localStorage`.
- Lista lateral interativa: ao clicar em um local salvo, o mapa centraliza e abre o popup correspondente.
- Interface responsiva com tratamentos de loading e estados de erro.

## Tecnologias Utilizadas

- **React + Vite:** Estrutura base e build tool.
- **TailwindCSS:** Estilização utilitária e responsividade.
- **Leaflet + React Leaflet:** Renderização do mapa interativo.
- **React Query:** Gerenciamento de requisições assíncronas, cache e estados (loading/error) da API de geocodificação.
- **Zustand:** Gerenciamento de estado global (incluindo o middleware `persist` para o localStorage).

## Decisões Técnicas

**Gerenciamento de Estado:**
Optei pelo Zustand no lugar de alternativas como Redux ou Context API por ser uma biblioteca leve, com baixo boilerplate e excelente integração para projetos React deste escopo. A persistência dos locais salvos foi resolvida de forma nativa com o middleware `persist`.

**Busca e Geocodificação:**
Utilizei a API pública do Nominatim para a busca de endereços e para o *reverse geocoding* (obter o endereço aproximado ao clicar no mapa). O React Query foi fundamental aqui para abstrair o controle de requisições, evitando chamadas desnecessárias e facilitando o feedback visual (loading/erros) para o usuário.

## Como Rodar Localmente

1. Clone o repositório:
\`\`\`bash
git clone https://github.com/GabrielJuvencio09/mapa-locais-favoritos.git
\`\`\`

2. Acesse o diretório:
\`\`\`bash
cd mapa-locais-favoritos
\`\`\`

3. Instale as dependências:
\`\`\`bash
npm install
\`\`\`

4. Inicie o servidor de desenvolvimento:
\`\`\`bash
npm run dev
\`\`\`
A aplicação estará rodando em `http://localhost:5173`.

## Possíveis Melhorias Futuras
- Permitir edição do nome/apelido de um favorito já salvo.
- Criar um backend/proxy próprio para evitar a dependência direta e os limites de *rate* da API pública do Nominatim.
- Implementar testes automatizados (Jest/Testing Library).
- Refinar as microinterações e o feedback visual para casos de falha de rede.

## Considerações Finais
Durante o desenvolvimento, busquei manter o código organizado, priorizando a separação clara de responsabilidades e a criação de componentes reutilizáveis. Como um desenvolvedor em início de carreira, meu objetivo central foi aplicar boas práticas, justificar a escolha das ferramentas de estado/requisições e entregar uma interface limpa e funcional. Este desafio foi uma excelente oportunidade para consolidar conceitos fundamentais de React e integração com APIs externas.