const apiKey = 'patEIjjNTe4rl2EqQ.e037e6f1ed10bf170ac359f8d36e37d86d34114e904d7491936c54f4f772a684'; // substitua por sua API Key
const baseId = 'appc3yxJyfrtp9BJZ';
const tableName = 'tbllPwIaRPZuHe6AB';

const url = `https://api.airtable.com/v0/${baseId}/${tableName}`;

fetch(url, {
  headers: {
    Authorization: `Bearer ${apiKey}`
  }
})
  .then(response => response.json())
  .then(data => {
    console.log(data);
    const tbody = document.getElementById('dados-tabela');

    let divAnalises = document.getElementById("analises");
    let row = '';
    data.records.forEach(record => {
      console.log('lendo dados...');
      const nome = record.fields['Nome'] || '-';
      const receita = record.fields['Receita (US$)'] || '-';
      const ebitda = record.fields['EBITDA (US$)'] || '-';
      const churn = record.fields['Churn (%)'] || '-';
      const ltvCAC = record.fields['LTV/CAC'] || '-';
      const scoreIA = record.fields['Score IA'] || '-';
      const recomendacao = record.fields['Recomendação'] || '-';
      const analise = record.fields['Analise'] || '-';

      console.log(nome)
      row += `
      Nome : ${nome} <br/>
      <p> Receita : ${receita} <br/> 
        EBITDA : ${ebitda} <br/>
        Churn : ${churn} <br/>
        LTV/CAC : ${ltvCAC} <br/>
        Score IA : ${scoreIA} </p>
      
      <p>Recomendação : <strong>${recomendacao}</strong> </p>
      <p>Análise IA: <strong>${analise}</strong> </p>
      <hr/`;
    });
    divAnalises.innerHTML = row;
  })
  .catch(error => {
    console.error('Erro ao buscar dados do Airtable:', error);
  });
