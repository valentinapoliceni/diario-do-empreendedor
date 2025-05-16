const airtableApiKey = 'pat9bprAIaHqCLZyM.3cd21365becc516f98da489d9707d51c59710e12cc6a17850f5c10ed0ab120fe'; // use seu token aqui
const airtableBaseId = 'appc3yxJyfrtp9BJZ'; // esse é o ID da sua base
const tableName = 'tbllPwIaRPZuHe6AB';

const tabelaDiv = document.getElementById("tabelaEmpresas");
const ctx = document.getElementById("graficoScoreIA").getContext("2d");

fetch(`https://api.airtable.com/v0/${airtableBaseId}/${tableName}`, {
  headers: {
    Authorization: `Bearer ${airtableApiKey}`
  }
})
.then(res => res.json())
.then(data => {
  const empresas = data.records;

  // TABELA
  let html = "<table><tr><th>Nome</th><th>Score IA</th><th>Recomendação</th><th>Rating</th><th>Approval</th><th>Status</th></tr>";
  const labels = [];
  const scores = [];

  empresas.forEach(item => {
    const nome = item.fields["Nome"];
    const score = item.fields["Score IA"];
    const recomendacao = item.fields["Recomendação"];
    const rating = item.fields["Rating"] || "-";
    const approval = item.fields["Approval"] || "-";

    // Definir cor do status
    let cor = "⚪️";
    if (recomendacao === "Empresa APTA para investimento.") cor = "🟢";
    else if (recomendacao === "Empresa em OBSERVAÇÃO.") cor = "🟡";
    else if (recomendacao === "Empresa NÃO recomendada.") cor = "🔴";

    html += `<tr>
      <td>${nome}</td>
      <td>${score}</td>
      <td>${recomendacao}</td>
      <td>${rating}</td>
      <td>${approval}</td>
      
      <td style="font-size: 20px">${cor}</td>
    </tr>`;

    labels.push(nome);
    scores.push(score);
  });

  html += "</table>";
  tabelaDiv.innerHTML = html;

  // GRÁFICO
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Score IA',
        data: scores,
        backgroundColor: '#0077cc'
      }]
    },
    options: {
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
})
.catch(err => {
  tabelaDiv.innerHTML = "Erro ao carregar dados: " + err;
});