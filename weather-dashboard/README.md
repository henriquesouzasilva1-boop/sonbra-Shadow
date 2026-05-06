# 🌤️ Weather Dashboard Pro

## Descrição
Dashboard profissional de previsão do tempo com integração com a API OpenWeatherMap. Oferece visualização completa de dados meteorológicos em tempo real.

## ✨ Funcionalidades

### 🌡️ Clima Atual
- Temperatura atual e sensação térmica
- Descrição detalhada do clima
- Umidade, pressão, visibilidade
- Velocidade e direção do vento
- Ponto de orvalho calculado
- Índice UV estimado
- Horários de nascer e pôr do sol

### 📊 Análise de Dados
- **Gráfico de Temperatura**: Evolução da temperatura nas próximas horas
- **Gráfico de Umidade**: Variação da umidade relativa
- **Gráfico de Vento**: Velocidade do vento ao longo do tempo
- **Gráfico de Precipitação**: Previsão de chuva/neve

### 📅 Previsões
- Previsão horária (24 horas)
- Previsão de 5 dias
- Ícones para cada tipo de clima

### 🔍 Busca Avançada
- Busca por nome de cidade
- Autocomplete com sugestões
- Geolocalização automática (pede permissão)

### 💾 Histórico
- Armazena últimas 10 buscas
- Acesso rápido a cidades favoritas
- Dados salvos no LocalStorage

### 🌍 Comparação de Cidades
- Comparar clima de múltiplas cidades
- Visualização lado a lado
- Adicionar/remover cidades dinamicamente

### ⚠️ Alertas Inteligentes
- Alerta de calor extremo (>35°C)
- Alerta de frio extremo (<0°C)
- Alerta de vento forte (>36 km/h)
- Alerta de pressão baixa (<1000 hPa)
- Alerta de precipitação
- Alerta de visibilidade reduzida

### 🎨 Tema
- Tema claro/escuro
- Alternância com um clique
- Preferência salva no navegador

## 🚀 Como Usar

### 1. Obter Chave API Gratuita

1. Acesse: https://openweathermap.org/api
2. Crie uma conta gratuita
3. Vá para "API keys"
4. Copie sua chave padrão

### 2. Configurar a Chave

Abra `script.js` e procure:
```javascript
const API_KEY = 'SUA_CHAVE_API_AQUI';
```

Substituia por sua chave real:
```javascript
const API_KEY = 'abc123def456...';
```

### 3. Executar Localmente

**Opção 1: Abrir Direto**
```bash
open index.html
# ou
start index.html  # Windows
```

**Opção 2: Servidor Python**
```bash
python -m http.server 8000
# Acesse: http://localhost:8000
```

**Opção 3: Servidor Node (http-server)**
```bash
npm install -g http-server
http-server
```

**Opção 4: Live Server (VS Code)**
- Instale a extensão "Live Server"
- Clique com botão direito → "Open with Live Server"

## 📁 Estrutura dos Arquivos

```
weather-dashboard/
├── index.html       # Estrutura HTML
├── styles.css       # Estilos CSS (tema claro/escuro)
├── script.js        # Lógica JavaScript
├── README.md        # Este arquivo
└── .gitignore       # Arquivos ignorados pelo Git
```

## 🔧 Tecnologias Utilizadas

- **HTML5**: Semântica e acessibilidade
- **CSS3**: Gradientes, animações, Grid, Flexbox
- **JavaScript Vanilla**: Sem dependências (exceto Chart.js)
- **Chart.js**: Gráficos interativos
- **OpenWeatherMap API**: Dados meteorológicos em tempo real
- **LocalStorage API**: Armazenamento local de dados
- **Geolocation API**: Localização automática do usuário

## 📱 Responsividade

- ✅ Desktop (1200px+)
- ✅ Tablet (768px - 1199px)
- ✅ Mobile (480px - 767px)
- ✅ Pequenos dispositivos (<480px)

## 🎯 Casos de Uso

1. **Planejamento de Viagens**: Verifique o clima de diferentes cidades
2. **Análise de Tendências**: Veja gráficos de temperatura e umidade
3. **Alertas de Segurança**: Receba avisos sobre condições extremas
4. **Comparação Regional**: Compare clima entre múltiplas localidades
5. **Monitoramento**: Acompanhe mudanças climáticas em tempo real

## ⚙️ Configurações Avançadas

### Limites da API Gratuita
- 1.000 chamadas por dia
- Atualização a cada 3 horas (alguns dados)
- Sem suporte premium

### Melhorias Futuras
- Integração com banco de dados
- Histórico de clima por data
- Notificações push
- PWA (Progressive Web App)
- Múltiplos idiomas
- Exportar dados em CSV/PDF

## 🐛 Troubleshooting

### "Chave API inválida"
- Verifique se copiou a chave corretamente
- Aguarde 5-10 minutos após criar a chave
- Regenere a chave se necessário

### "Cidade não encontrada"
- Digite o nome da cidade em português ou inglês
- Tente com a sigla do estado/país
- Use o autocomplete para sugestões

### "Erro de geolocalização"
- Permita acesso à localização no navegador
- Verifique se tem conexão com internet
- Tente novamente mais tarde

### Gráficos não aparecem
- Verifique se Chart.js foi carregado
- Abra o console (F12) para ver erros
- Certifique-se de ter dados disponíveis

## 📊 Formato dos Dados

### Resposta da API
```json
{
  "name": "São Paulo",
  "country": "BR",
  "main": {
    "temp": 25.5,
    "feels_like": 26.1,
    "humidity": 65,
    "pressure": 1013
  },
  "weather": [
    {
      "main": "Clouds",
      "description": "nublado",
      "icon": "04d"
    }
  ]
}
```

## 🔐 Segurança

- Chave API armazenada localmente no script
- Nenhum dado sensível no LocalStorage
- Comunicação HTTPS com a API
- Sem rastreamento de usuários

## 📝 Licença

Código aberto e livre para usar/modificar.

## 🤝 Contribuições

Sinta-se livre para fazer fork, melhorar e submeter pull requests!

## 📧 Suporte

Para dúvidas ou problemas:
1. Verifique a documentação da API: https://openweathermap.org/api
2. Consulte o console do navegador (F12)
3. Teste a API diretamente: https://api.openweathermap.org/data/2.5/weather?q=london&appid=YOUR_KEY

---

**Desenvolvido com ❤️ por Henrique Silva**

**Última atualização**: 2026-05-06