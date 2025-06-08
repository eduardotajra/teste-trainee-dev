# Relatório Técnico - [Eduardo de Morais Tajra]

## 1. Visão Geral da Solução

Este relatório detalha o processo de recuperação e aprimoramento de uma aplicação de gerenciamento de tarefas em Angular. O projeto foi recebido em um estado incompleto e instável, com erros que impediam sua inicialização. O trabalho realizado envolveu três etapas principais:

1. **Estabilização do Ambiente:** Diagnóstico e correção dos erros de configuração e dependências que bloqueavam a execução do projeto.
2. **Correção de Bugs:** Análise e solução de uma lista de 13 bugs funcionais e de usabilidade identificados pela equipe de QA, garantindo que a aplicação se comportasse de acordo com o esperado.
3. **Implementação de Melhorias:** Desenvolvimento de 6 novas funcionalidades para modernizar a aplicação, melhorar a experiência do usuário e adicionar novos recursos valiosos, como exportação para PDF e filtros de conteúdo.

O resultado final é uma aplicação robusta, funcional e com uma experiência de usuário aprimorada, pronta para ser utilizada.

## 2. Como Executar a Aplicação

**Pré-requisitos:**

* Node.js (versão 16 ou superior)
* NPM (geralmente instalado com o Node.js)
* Angular CLI (opcional, para comandos `ng`)

**Passos para execução:**

1. **Clone o repositório para sua máquina local:**

   **Bash**

   ```
   git clone https://github.com/eduardotajra/teste-trainee-dev
   ```
2. **Acesse o diretório do projeto:**

   **Bash**

   ```
   cd teste-trainee-dev
   ```
3. **Instale as dependências do projeto:**

   **Bash**

   ```
   npm install
   ```
4. **Inicie o servidor de desenvolvimento:**

   **Bash**

   ```
   npm start
   ```

   A aplicação estará disponível no seu navegador em `http://localhost:4200/`.

## 3. Correção dos Erros Iniciais (`npm start`)

A aplicação, no estado em que foi recebida, não iniciava com o comando `npm start`. Foram identificados os seguintes problemas:

* **Erro 1: Script "start" ausente no `package.json`**

  * **Descrição:** O `package.json` não possuía o script `start` na sua seção de `"scripts"`.
  * **Solução:** Adicionei a linha `"start": "ng serve"` ao objeto de scripts, estabelecendo o comando padrão do Angular para iniciar a aplicação.
* **Erro 2: Dependências não instaladas ou referenciadas incorretamente**

  * **Descrição:** O build falhava ao tentar resolver caminhos de bibliotecas (ex: `fontawesome-free`) que não estavam instaladas ou cujas referências no arquivo `angular.json` estavam incorretas.
  * **Solução:** Instalei as dependências faltantes via `npm install` e corrigi os caminhos na seção `styles` do `angular.json` para que o compilador pudesse encontrar os arquivos CSS necessários.
* **Erro 3: Nome de classe incorreto em `HeaderComponent`**

  * **Descrição:** No arquivo `header.component.ts`, a classe estava nomeada incorretamente como "`HeadeComponent`", o que impedia o Angular de reconhecer e compilar o componente.
  * **Solução:** Corrigi o nome da classe para `HeaderComponent`, alinhando-o com as convenções e referências do restante do projeto.
* **Erro 4: Falta de importação do `TodoService` em `new-task.component.ts`**

  * **Descrição:** O componente `NewTaskComponent` utilizava o `TodoService` para adicionar tarefas, mas o serviço não havia sido importado no arquivo, resultando em um erro de referência.
  * **Solução:** Adicionei a declaração `import { TodoService } from ...` no topo do arquivo e injetei o serviço corretamente através do construtor da classe, resolvendo a dependência.

## 4. Relatório de Correção de Bugs

A seguir, a lista detalhada dos bugs corrigidos, suas causas e as soluções implementadas.

* **Bug: Tarefa adicionada duas vezes ao clicar em "Salvar".**
  * **Causa Raiz:** A função de salvar era acionada por dois eventos simultâneos: `(ngSubmit)` no formulário e `(click)` no botão.
  * **Solução Implementada:** Removi o evento `(click)` do botão, mantendo `(ngSubmit)` como o único gatilho para a adição, resolvendo a duplicidade.
* **Bug: Só era possível salvar uma tarefa por vez.**
  * **Causa Raiz:** O campo de texto não era limpo após a adição, mantendo o mesmo valor e impedindo novas submissões sem um F5.
  * **Solução Implementada:** Após a adição da tarefa, a variável ligada ao input (`[(ngModel)]`) agora é resetada para uma string vazia (`''`), liberando o campo para novas inserções.
* **Bug: Botão de limpar todas as tarefas com texto em inglês.**
  * **Causa Raiz:** O texto estava "hardcoded" em inglês no template.
  * **Solução Implementada:** O texto foi traduzido para "Limpar Todas as Tarefas" diretamente no arquivo `.html` do componente.
* **Bug: Botões "Exibir/Ocultar Tarefas Concluídas" com comportamento invertido.**
  * **Causa Raiz:** A lógica booleana na função de toggle estava invertida.
  * **Solução Implementada:** Corrigi a função para que ela alterne corretamente o estado da variável `showCompletedTasks` e criei um *getter* (`visibleTodos`) que retorna a lista filtrada ou completa sem modificar o array original, garantindo que o filtro funcione corretamente em ambos os sentidos.
* **Bug: "Limpar Tarefas Concluídas" não pedia confirmação.**
  * **Causa Raiz:** A função de limpar era executada diretamente no clique.
  * **Solução Implementada:** Implementei a biblioteca **SweetAlert2** para exibir um modal de confirmação antes de executar a ação, conforme detalhado na seção de melhorias.
* **Bug: "Limpar Tarefas Concluídas" removia as tarefas erradas.**
  * **Causa Raiz:** A lógica do método `.filter()` estava incorreta, mantendo as tarefas concluídas em vez das não concluídas.
  * **Solução Implementada:** Ajustei o filtro para `this.todos.filter(task => !task.completed)`, garantindo que apenas as tarefas não concluídas permaneçam na lista.
* **Bug: Botão "Editar" não funcional.**
  * **Causa Raiz:** Não havia lógica para gerenciar o estado de edição.
  * **Solução Implementada:** Criei um fluxo de edição completo:
    1. Ao clicar em "Editar", o componente filho emite um evento com a tarefa.
    2. O componente pai recebe o evento, armazena a tarefa em uma variável de estado (`editingTodo`) e preenche o campo de input com o título atual.
    3. A função de salvar foi tornada "inteligente": ela verifica se `editingTodo` existe. Se sim, atualiza a tarefa; senão, cria uma nova.
    4. Após salvar, o estado de edição é limpo.
* **Bug: Botão "Editar" desalinhado e cor do "Remover" incorreta.**
  * **Causa Raiz:** Problemas de estilização CSS.
  * **Solução Implementada:** Utilizei CSS Flexbox para alinhar os botões "Editar" e "Remover" lado a lado e apliquei a cor vermelha (`background-color: #d33`) ao botão "Remover" para indicar uma ação destrutiva.
* **Bug: Lista de tarefas sem barra de rolagem.**
  * **Causa Raiz:** O contêiner da lista não tinha `max-height` e `overflow` definidos.
  * **Solução Implementada:** Apliquei as propriedades CSS `max-height: 400px` e `overflow-y: auto` ao contêiner da lista, fazendo a barra de rolagem aparecer automaticamente quando o conteúdo excede a altura máxima.
* **Bug: Adição de itens em branco (vazio ou apenas com espaços).**
  * **Causa Raiz:** Ausência de validação no input antes de salvar.
  * **Solução Implementada:** Adicionei uma verificação no início da função de salvar (`if (!title || !title.trim())`) que impede a execução caso o título seja vazio ou contenha apenas espaços.

## 5. Relatório de Implementação de Melhorias

* **Melhoria: Ordenar de A a Z**
  * **Abordagem Técnica:** Criei um método no componente que utiliza `Array.prototype.sort()` com a função `localeCompare()` para reordenar a lista de tarefas principal. `localeCompare` foi escolhido por lidar corretamente com acentos e capitalização.
  * **Bibliotecas:** Nenhuma biblioteca externa foi necessária.
* **Melhoria: Adicionar tarefa com a tecla "Enter"**
  * **Abordagem Técnica:** No elemento `<input>` do formulário, adicionei o evento `(keyup.enter)` do Angular, que aciona a mesma função de salvar do botão principal.
  * **Bibliotecas:** Nenhuma biblioteca externa foi necessária.
* **Melhoria: Adição de múltiplas tarefas com `|`**
  * **Abordagem Técnica:** Na função de salvar, implementei uma lógica que verifica se a string de entrada contém o caractere `|`. Se contiver, `String.prototype.split('|')` é usado para criar um array de títulos, que são então iterados e adicionados como tarefas individuais, após uma verificação para remover strings vazias.
  * **Bibliotecas:** Nenhuma biblioteca externa foi necessária.
* **Melhoria: Filtro de Palavras Obscenas**
  * **Abordagem Técnica:** Antes de salvar a tarefa, o texto de entrada é verificado. Para tornar o filtro eficaz em português, criei um array customizado com termos relevantes e o adicionei à instância do filtro. A verificação também converte o texto do usuário para minúsculas (`.toLowerCase()`) para ser case-insensitive.
  * **Bibliotecas:**  **`bad-words`** .
* **Melhoria: Exportar para PDF**
  * **Abordagem Técnica:** Criei um método que instancia um novo documento PDF. Ele itera sobre a lista de tarefas *visíveis* na tela (`visibleTodos`), formata cada tarefa com seu status (Pendente/Concluída) e título, e a adiciona ao documento, gerenciando a posição vertical e a quebra de linha para textos longos. Ao final, o método `doc.save()` é chamado.
  * **Bibliotecas:**  **`jspdf`** .
* **Melhoria: Substituir `alert` e `confirm` nativos**
  * **Abordagem Técnica:** Todas as chamadas `confirm()` foram substituídas por `Swal.fire({..., showCancelButton: true})`, com a lógica de negócio movida para dentro do bloco `.then(result => { if (result.isConfirmed) ... })`. Todas as chamadas `alert()` foram substituídas por modais `Swal.fire()` com ícones apropriados (erro, aviso, sucesso).
  * **Bibliotecas:**  **`sweetalert2`** .

## 6. Relatório de Débito Técnico

* Felizmente, todos os itens da lista de bugs e melhorias foram concluídos com sucesso dentro do escopo deste desafio.

## 7. Relatório de Melhorias Futuras

Para evoluir o sistema, sugiro as seguintes funcionalidades:

* **Persistência de Dados Aprimorada:** Embora o `localStorage` tenha sido usado, a próxima etapa seria conectar a aplicação a um backend com um banco de dados (ex: Firebase, Node.js + PostgreSQL), permitindo que os dados sejam acessados de qualquer lugar.
* **Autenticação de Usuários:** Implementar um sistema de login/cadastro para que cada usuário tenha sua própria lista de tarefas privada.
* **Datas de Vencimento e Prioridades:** Adicionar campos de data de vencimento e níveis de prioridade (ex: Baixa, Média, Alta) às tarefas, com indicadores visuais.
* **Arrastar e Soltar (Drag and Drop):** Permitir que os usuários reordenem as tarefas arrastando-as na lista, utilizando bibliotecas como o Angular CDK.
* **Design Responsivo:** Aprimorar o CSS para garantir uma experiência de uso perfeita em dispositivos móveis.

## 8. Decisões e Considerações

A principal decisão de arquitetura tomada neste projeto foi a de utilizar o **`TodoService` como um mediador de estado compartilhado (Shared State / State Broker)** para a comunicação entre componentes.

Em vez de um fluxo estrito de `parent -> child` com `@Input` e `child -> parent` com `@Output` para a funcionalidade de edição, optei por uma abordagem onde o `TodoService` detém o estado do título da tarefa que está sendo digitada (`sharedTaskTitle`). O componente de formulário (`NewTaskComponent`) é responsável por atualizar esse estado no serviço, enquanto o componente do item da lista (`TodoItemComponent`) lê esse estado diretamente do serviço para executar a atualização.

Essa abordagem foi escolhida por permitir uma comunicação direta entre dois componentes "irmãos" sem a necessidade de passar os dados através do componente pai, simplificando a implementação da funcionalidade de edição específica que foi solicitada.

Um desafio interessante que surgiu desta abordagem foi a  **duplicação da lógica do filtro de palavras obscenas** , que está presente tanto no `NewTaskComponent` (para criar tarefas) quanto no `TodoItemComponent` (para editar tarefas). Uma evolução futura do projeto seria centralizar essa lógica de validação em um único local, possivelmente no próprio `TodoService` ou em um serviço de utilitários, para seguir o princípio DRY (Don't Repeat Yourself) e facilitar a manutenção.
