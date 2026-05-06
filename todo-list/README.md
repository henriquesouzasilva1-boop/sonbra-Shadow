# ✅ To-Do List Pro

## Descrição
Aplicativo profissional de gerenciamento de tarefas com armazenamento local (localStorage). Organize suas tarefas com prioridades, categorias e datas de vencimento.

## ✨ Funcionalidades

### 📝 Gerenciamento de Tarefas
- ✅ Criar novas tarefas
- ✍️ Editar tarefas existentes (via modal)
- 🗑 Deletar tarefas
- ✔️ Marcar como concluídas
- 🔄 Desmarcar tarefas completadas

### 🟼 Prioridades
- 🔴 **Alta Prioridade** - Destaque em vermelho
- 🟼 **Média Prioridade** - Destaque em laranja (padrão)
- 🟍 **Baixa Prioridade** - Destaque em verde

### 📋 Categorias
- 📋 Trabalho
- 👤 Pessoal
- 🛍 Compras
- 📚 Saúde
- 📚 Estudo
- 📌 Outro

### 📅 Datas de Vencimento
- Define data limite para tarefas
- Alerta visual para tarefas vencidas (⚠️)
- Filtro por "Hoje"

### 📅 Filtros Avançados
- 📋 **Todas** - Mostra todas as tarefas
- 🔄 **Ativas** - Apenas não concluídas
- ✅ **Concluídas** - Apenas tarefas finalizadas
- 🔴 **Alta Prioridade** - Apenas alta prioridade
- 📅 **Hoje** - Apenas para hoje

### 🗄 Abas de Categorias
- Filtro rápido por categoria
- Visualização organizada

### 📈 Ordenação
- **Mais Recente** - Ùltimas tarefas adicionadas
- **Prioridade** - Ordenado por alta/média/baixa
- **Data de Vencimento** - Mais próximas primeiro
- **Ordem Alfabética** - A-Z

### 📈 Estatísticas
- Total de Tarefas
- Tarefas Concluídas
- Tarefas Pendentes
- Taxa de Conclusão (%)

### 📄 Ações em Lote
- 🗑 Limpar Concluídas - Remove todas as tarefas finalizadas
- 💾 Exportar - Salva tarefas em arquivo JSON
- 📋 Importar - Carrega tarefas de arquivo JSON

### 💀 Armazenamento Local
- Salva automaticamente no localStorage
- Persiste entre sessões do navegador
- Não requer servidor

### 🎨 Tema
- Tema Claro
- Tema Escuro
- Alternância com 1 clique
- Preferência salva

## 🚀 Como Usar

### 1. Abrir o Aplicativo
```bash
# Clone o repositório
git clone https://github.com/henriquesouzasilva1-boop/sonbra-Shadow.git
cd sonbra-Shadow/todo-list

# Abra em seu navegador
open index.html

# Ou use um servidor local
python -m http.server 8000
# Acesse: http://localhost:8000
```

### 2. Adicionar Tarefa
1. Digite o texto da tarefa no campo "Adicione uma nova tarefa..."
2. Selecione a prioridade (Baixa, Média, Alta)
3. Escolha a categoria (Trabalho, Pessoal, etc.)
4. (Opcional) Defina uma data de vencimento
5. Clique em "+ Adicionar" ou pressione Enter

### 3. Gerenciar Tarefas
- **Completar**: Clique no checkbox
- **Editar**: Clique em "✏️ Editar"
- **Deletar**: Clique em "🗑 Deletar"

### 4. Filtrar e Organizar
- Use os botões de filtro no topo
- Selecione categorias nas abas
- Escolha a ordenação desejada

### 5. Exportar/Importar
- **Exportar**: Clique em "📥 Exportar" para salvar em JSON
- **Importar**: Clique em "📤 Importar" para carregar arquivo

## 📁 Estrutura dos Arquivos

```
todo-list/
├── index.html       # Estrutura HTML
├── styles.css       # Estilos CSS (claro/escuro)
├── script.js        # Lógica JavaScript
├── README.md        # Este arquivo
└── .gitignore       # Arquivos ignorados
```

## 🔧 Tecnologias Utilizadas

- **HTML5**: Semântica e acessibilidade
- **CSS3**: Gradientes, animações, flexbox, grid
- **JavaScript Vanilla**: Sem dependências externas
- **LocalStorage API**: Armazenamento local

## 📱 Responsividade

- ✅ Desktop (1200px+)
- ✅ Tablet (768px - 1199px)
- ✅ Mobile (480px - 767px)
- ✅ Pequenos dispositivos (<480px)

## 🎆 Formato de Dados

Cada tarefa é armazenada com:
```json
{
  "id": 1234567890,
  "text": "Comprar leite",
  "completed": false,
  "priority": "high",
  "category": "shopping",
  "dueDate": "2026-05-10",
  "createdAt": "2026-05-06T10:30:00.000Z"
}
```

## 📚 Casos de Uso

1. **Lista de Compras**: Crie tarefas na categoria "Compras"
2. **Planejamento de Trabalho**: Use categoria "Trabalho" com prioridades
3. **Metas Pessoais**: Acompanhe progressão com a taxa de conclusão
4. **Estudo**: Organize tarefas de estudo por data e prioridade
5. **Saúde**: Gerencie lembretes de médico e exercícios

## ⚙️ Dicas

- Use **Alta Prioridade** para tarefas urgentes
- Defina **datas de vencimento** para não esquecer
- Use **Filtro de Hoje** para focar no presente
- **Exporte regularmente** suas tarefas como backup
- Use o **Tema Escuro** para menos cansaço nos olhos

## 🐛 Troubleshooting

### "Tarefas desaparecem"
- Verifique se o LocalStorage está ativado no navegador
- Tente limpar cache e cookies
- Considere exportar como backup

### "Não consigo editar"
- Clique em "✏️ Editar" para abrir o modal
- Preencha os dados
- Clique em "Salvar"

### "Filtro não funciona"
- Verifique se há tarefas que correspondem ao filtro
- Tente resetar os filtros

## 💪 Melhorias Futuras

- Sincronização com nuvem (Firebase, etc.)
- Notificações de lembrete
- Compartilhamento de listas
- Recorrências de tarefas
- Múltiplos idiomas
- Gráficos de produtividade
- Integração com calendário

## 🔐 Segurança

- Sem dados enviados para servidor
- Dados armazenados localmente apenas
- Sem rastreamento de usuários
- Escapa HTML para prevenir XSS

## 📝 Licença

Código aberto e livre para usar/modificar.

## 📧 Suporte

Para dúvidas ou problemas:
1. Verifique a documentação acima
2. Abra o console do navegador (F12)
3. Verifique se o LocalStorage está ativado

---

**Desenvolvido com ❤️ por Henrique Silva**

**Última atualização**: 2026-05-06