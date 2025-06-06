const airtableUrl = "https://api.airtable.com/v0/appc3yxJyfrtp9BJZ/tbllPwIaRPZuHe6AB";
const airtableApiKey = "patEIjjNTe4rl2EqQ.e037e6f1ed10bf170ac359f8d36e37d86d34114e904d7491936c54f4f772a684"; // substitua por sua API Key
const webhookUrl = "https://n8n.isilab.com.br/webhook/795b0b92-75f8-42df-813d-c5f8936e667f";

async function carregarEmpresas() {
    const res = await fetch(airtableUrl, {
      headers: {
        Authorization: `Bearer ${airtableApiKey}`
      }
    });
    const data = await res.json();
    const container = document.getElementById("empresa-lista");
  
    data.records.forEach(record => {
      const nome = record.fields["Nome"] || "Sem nome";
      const id = record.id;
      const card = document.createElement("div");
      card.className = "col-md-6";
      card.innerHTML = `
        <div class="card">
          <h5>${nome}</h5>
          <button class="btn btn-primary mb-2" onclick="analisarEmpresa('${id}', this)">Análise EXIT</button>
          <textarea rows="4" placeholder="Resultado da análise..."></textarea>
        </div>
      `;
      container.appendChild(card);
    });
  }
  
  async function analisarEmpresa(id, button) {
    button.disabled = true;
    button.innerText = "Analisando...";
  
    const card = button.closest(".card");
    const textarea = card.querySelector("textarea");
  
    try {
      const res = await fetch(`${airtableUrl}/${id}`, {
        headers: {
          Authorization: `Bearer ${airtableApiKey}`
        }
      });
      const record = await res.json();
      const campos = record.fields;
      const info = `
  Nome: ${campos["Nome"] || "N/A"}
  Receita (US$): ${campos["Receita (US$)"] || "N/A"}
  EBITDA (US$): ${campos["EBITDA (US$)"] || "N/A"}
  Churn (%): ${campos["Churn (%)"] || "N/A"}
  LTV/CAC: ${campos["LTV/CAC"] || "N/A"}
      `.trim();
  
      const payload = { data: info };
      const response = await axios.post(webhookUrl, payload);
      const resultado = response.data;
  
      textarea.value = resultado;
  
      await fetch(`${airtableUrl}/${id}`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${airtableApiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          fields: {
            analise_exit: resultado
          }
        })
      });
    } catch (err) {
      textarea.value = "Erro ao processar: " + err.message;
    } finally {
      button.disabled = false;
      button.innerText = "Análise EXIT";
    }
  }
  
  window.onload = carregarEmpresas;