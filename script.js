document.getElementById("empresaForm").addEventListener("submit", async function (event) {
  event.preventDefault();

  
  const nome = document.querySelector("input[name='nome']").value;
  const receita = parseFloat(document.querySelector("input[name='receita']").value);
  const ebitda = parseFloat(document.querySelector("input[name='ebitda']").value);
  const churn = parseFloat(document.querySelector("input[name='churn']").value);
  const ltv = parseFloat(document.querySelector("input[name='ltv']").value);

  let score = 0;
  if (receita >= 7000000) score += 25;
  if (ebitda >= 1000000) score += 25;
  if (churn <= 5) score += 25;
  if (ltv >= 3) score += 25;

  let recomendacao = "";
  if (score >= 75) {
    recomendacao = "Empresa APTA para investimento.";
  } else if (score >= 50) {
    recomendacao = "Empresa em OBSERVAÇÃO.";
  } else {
    recomendacao = "Empresa NÃO recomendada.";
  }

  // Mostrando resultado na tela
  const resultadoDiv = document.getElementById("resultado");
  resultadoDiv.innerHTML = `<strong>Resultado da IA:</strong><br/>Score: ${score}/100<br/>${recomendacao}`;

  // Enviando para o Airtable
  try {
    const resposta = await fetch("https://api.airtable.com/v0/appc3yxJyfrtp9BJZ/tbllPwIaRPZuHe6AB", {
      method: "POST",
      headers: {
        "Authorization": "Bearer patEIjjNTe4rl2EqQ.e037e6f1ed10bf170ac359f8d36e37d86d34114e904d7491936c54f4f772a684",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        fields: {
          "Nome": nome,
          "Receita (US$)": receita,
          "EBITDA (US$)": ebitda,
          "Churn (%)": churn,
          "LTV/CAC": ltv,
          "Score IA": score,
          "Recomendação": recomendacao
        }
      })
    });

    if (!resposta.ok) {
      throw new Error(`Erro HTTP: ${resposta.status}`);
    }

    alert("Empresa registrada no Airtable com sucesso!");
  } catch (error) {
    alert("Erro ao enviar para o Airtable: " + error.message);
  }
});
