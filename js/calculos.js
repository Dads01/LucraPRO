document.addEventListener('DOMContentLoaded', function() {
  // Elementos do formulário
  const form = document.getElementById('form-calculadora');
  const nomeProduto = document.getElementById('nome-produto');
  const quantidade = document.getElementById('quantidade');
  const custoMaterial = document.getElementById('custo-material');
  const maoObra = document.getElementById('mao-obra');
  const despesasGerais = document.getElementById('despesas-gerais');
  const impostos = document.getElementById('impostos');
  const margemRange = document.getElementById('margem-range');
  const margemValue = document.getElementById('margem-value');
  
  // Elementos de resultado
  const resultadoNomeProduto = document.getElementById('resultado-nome-produto');
  const resultadoQuantidade = document.getElementById('resultado-quantidade');
  const precoVenda = document.getElementById('preco-venda');
  const custoUnitarioTotal = document.getElementById('custo-unitario-total');
  const detMaterial = document.getElementById('det-material');
  const detMaoObra = document.getElementById('det-mao-obra');
  const detDespesas = document.getElementById('det-despesas');
  const detImpostos = document.getElementById('det-impostos');
  const detLucro = document.getElementById('det-lucro');
  const lucroTotal = document.getElementById('lucro-total');
  const detMargem = document.getElementById('det-margem');
  const lucroUnitario = document.getElementById('lucro-unitario');
  
  // Histórico
  const historicoBody = document.getElementById('historico-body');
  const btnSalvar = document.getElementById('salvar-calculo');
  
  // Atualizar valor do range
  margemRange.addEventListener('input', function() {
    margemValue.textContent = this.value + '%';
  });
  
  // Formatar moeda
  function formatarMoeda(valor) {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }
  
  // Formatar porcentagem
  function formatarPorcentagem(valor) {
    return valor.toFixed(1).replace('.', ',') + '%';
  }
  
  // Calcular preço de venda
  function calcularPrecoVenda(event) {
    event.preventDefault();
    
    // Validar campos
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    
    // Obter valores
    const qtd = parseFloat(quantidade.value);
    const custoMat = parseFloat(custoMaterial.value);
    const maoObraVal = parseFloat(maoObra.value);
    const despesasVal = parseFloat(despesasGerais.value);
    const impostosPercent = parseFloat(impostos.value) / 100;
    const margemDesejada = parseFloat(margemRange.value) / 100;
    
    // Calcular custos unitários
    const custoUnitario = (custoMat + maoObraVal + despesasVal) / qtd;
    const lucroUnitarioVal = custoUnitario * margemDesejada;
    const precoVendaSemImpostos = custoUnitario + lucroUnitarioVal;
    const valorImpostos = precoVendaSemImpostos * impostosPercent;
    const precoVendaFinal = precoVendaSemImpostos + valorImpostos;
    
    // Calcular totais
    const lucroTotalVal = lucroUnitarioVal * qtd;
    
    // Atualizar UI
    resultadoNomeProduto.textContent = nomeProduto.value || "Produto sem nome";
    resultadoQuantidade.textContent = `Quantidade: ${qtd}`;
    precoVenda.textContent = formatarMoeda(precoVendaFinal);
    custoUnitarioTotal.textContent = formatarMoeda(custoUnitario);
    detMaterial.textContent = formatarMoeda(custoMat / qtd);
    detMaoObra.textContent = formatarMoeda(maoObraVal / qtd);
    detDespesas.textContent = formatarMoeda(despesasVal / qtd);
    detImpostos.textContent = `${formatarMoeda(valorImpostos)} (${formatarPorcentagem(impostosPercent * 100)})`;
    detLucro.textContent = `${formatarMoeda(lucroUnitarioVal)} (${formatarPorcentagem(margemDesejada * 100)})`;
    lucroTotal.textContent = formatarMoeda(lucroTotalVal);
    detMargem.textContent = formatarPorcentagem(margemDesejada * 100);
    lucroUnitario.textContent = formatarMoeda(lucroUnitarioVal);
  }
  
  // Salvar cálculo no histórico
  function salvarCalculo() {
    if (precoVenda.textContent === 'R$ 0,00') {
      alert('Calcule um preço antes de salvar!');
      return;
    }
    
    const nome = nomeProduto.value || "Produto sem nome";
    const qtd = quantidade.value;
    const custoUnit = custoUnitarioTotal.textContent.replace('R$', '').trim();
    const preco = precoVenda.textContent.replace('R$', '').trim();
    const lucroUnit = lucroUnitario.textContent.replace('R$', '').trim();
    const margem = detMargem.textContent;
    
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
      <td>${nome}</td>
      <td>${qtd}</td>
      <td>R$ ${custoUnit}</td>
      <td>R$ ${preco}</td>
      <td>R$ ${lucroUnit}</td>
      <td>${margem}</td>
    `;
    
    historicoBody.insertBefore(newRow, historicoBody.firstChild);
    
    // Limitar histórico a 10 itens
    if (historicoBody.children.length > 10) {
      historicoBody.removeChild(historicoBody.lastChild);
    }
    
    // Feedback visual
    btnSalvar.innerHTML = '<i class="fas fa-check"></i> Salvo com sucesso!';
    btnSalvar.classList.add('btn-success');
    setTimeout(() => {
      btnSalvar.innerHTML = '<i class="fas fa-save"></i> Salvar Cálculo';
      btnSalvar.classList.remove('btn-success');
    }, 2000);
  }
  
  // Event listeners
  form.addEventListener('submit', calcularPrecoVenda);
  btnSalvar.addEventListener('click', salvarCalculo);
  
  // Simular cálculo inicial para demonstração
  setTimeout(() => {
    nomeProduto.value = "Brigadeiro Gourmet";
    quantidade.value = 100;
    custoMaterial.value = 15.50;
    maoObra.value = 8.20;
    despesasGerais.value = 3.80;
    impostos.value = 12;
    margemRange.value = 30;
    margemValue.textContent = "30%";
    
    // Disparar evento de cálculo
    const event = new Event('submit');
    form.dispatchEvent(event);
  }, 500);
});