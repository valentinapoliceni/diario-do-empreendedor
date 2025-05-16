// ⚠️ Substitua pela sua chave da API do Airtable
const apiKey = 'https://airtable.com/appc3yxJyfrtp9BJZ/tbllPwIaRPZuHe6AB/'; 

const baseId = 'appc3yxJyfrtp9BJZ';
const empresaTable = 'tbllPwIaRPZuHe6AB';
const ddTable = 'tblNBE6pyFoQzBdKP';

async function carregarEmpresas() {
  const url = `https://api.airtable.com/v0/${baseId}/${empresaTable}`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${apiKey}`
    }
  });
  const data = await response.json();
  const select = document.getElementById("empresa");

  data.records.forEach((record) => {
    const option = document.createElement("option");
    option.value = record.fields.Nome;
    option.text = record.fields.Nome;
    select.appendChild(option);
  });
}

document.getElementById("dueForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const dados = {
    empresa: document.getElementById("empresa").value,
    tipo: document.getElementById("tipo").value,
    item: document.getElementById("item").value,
    status: document.getElementById("status").value,
    comentario: document.getElementById("comentario").value,
    link_doc: document.getElementById("link_doc").value,
    risco: document.getElementById("risco").value
  };

  const response = await fetch(`https://api.airtable.com/v0/${baseId}/${ddTable}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ fields: dados })
  });

  const msg = document.getElementById("msg");
  if (response.ok) {
    msg.textContent = "Dados enviados com sucesso!";
    msg.style.color = "green";
    document.getElementById("dueForm").reset();
  } else {
    msg.textContent = "Erro ao enviar dados.";
    msg.style.color = "red";
  }
});

carregarEmpresas();
