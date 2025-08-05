const produtos = [
  { nome: "Cartão Raro", limpo: 15000, sujo: 19500, LimpoParceiro: 11250, SujoParceiro: 14625 },
  { nome: "Cartão in-Comum", limpo: 20000, sujo: 26000, LimpoParceiro: 15000, SujoParceiro: 19500 },
  { nome: "Cartão Comum", limpo: 30000, sujo: 39000, LimpoParceiro: 22500, SujoParceiro: 29250 },
  { nome: "Cartão Normal", limpo: 55000, sujo: 71500, LimpoParceiro: 41250, SujoParceiro: 53625 },
  { nome: "Cartão Lendário", limpo: 60000, sujo: 78000, LimpoParceiro: 45000, SujoParceiro: 58500 },
  { nome: "Pendrive", limpo: 65000, sujo: 84500, LimpoParceiro: 48750, SujoParceiro: 63375 },
  { nome: "Alicate", limpo: 4000, sujo: 5200, LimpoParceiro: 3000, SujoParceiro: 3900 },
  { nome: "C4", limpo: 8000, sujo: 9100, LimpoParceiro: 6000, SujoParceiro: 7800 },
  { nome: "Bloqueador", limpo: 10000, sujo: 13000, LimpoParceiro: 7500, SujoParceiro: 9750 },
  { nome: "Placa", limpo: 10000, sujo: 13000, LimpoParceiro: 7500, SujoParceiro: 9750 },
  { nome: "Ticket", limpo: 7000, sujo: 9100, LimpoParceiro: 5250, SujoParceiro: 6825 },
  { nome: "Lockpick Alumínio", limpo: 10000, sujo: 13000, LimpoParceiro: 7500, SujoParceiro: 9750 },
  { nome: "Lockpick Cobre", limpo: 15000, sujo: 19500, LimpoParceiro: 11250, SujoParceiro: 14625 },
  { nome: "Longbook/Macbook", limpo: 30000, sujo: 39000, LimpoParceiro: 22500, SujoParceiro: 29250 },
  { nome: "Nitro", limpo: 35000, sujo: 45500, LimpoParceiro: 26250, SujoParceiro: 34125 },
  { nome: "Pager", limpo: 40000, sujo: 52000, LimpoParceiro: 30000, SujoParceiro: 39000 },
  { nome: "Chip", limpo: 3000, sujo: 2500, LimpoParceiro: 2000, SujoParceiro: 1500 }
];

const quantidades = new Array(produtos.length).fill(0);
const seletorModo = document.getElementById("mode-selector");
const divTotais = document.getElementById("totais");
const tabelaProdutos = document.getElementById("produtos");

// Gera a tabela dinamicamente
produtos.forEach((produto, index) => {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td>${produto.nome}</td>
    <td class="preco preco-limpo">R$ ${produto.limpo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
    <td class="preco preco-sujo">R$ ${produto.sujo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
    <td class="preco preco-limpoparceiro">R$ ${produto.LimpoParceiro.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
    <td class="preco preco-sujoparceiro">R$ ${produto.SujoParceiro.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
    <td>
      <div class="quantidade-wrapper">
        <button onclick="incrementarQuantidade(${index}, -1)">−</button>
        <input type="number" min="0" value="0" onchange="atualizaValor(${index}, this.value)" id="input-qtd-${index}">
        <button onclick="incrementarQuantidade(${index}, 1)">+</button>
      </div>
    </td>
  `;
  tabelaProdutos.appendChild(tr);
});

function getValorUnit(produto, modo) {
  return produto[
    modo === "limpo" ? "limpo" :
    modo === "sujo" ? "sujo" :
    modo === "Limpo-Parceiro" ? "LimpoParceiro" :
    modo === "Sujo-Parceiro" ? "SujoParceiro" :
    ""
  ] || 0;
}

function atualizaValor(index, quantidade) {
  quantidades[index] = parseInt(quantidade) || 0;
  atualizarTotais();
}

function incrementarQuantidade(index, delta) {
  const input = document.getElementById(`input-qtd-${index}`);
  let valorAtual = parseInt(input.value) || 0;
  let novoValor = Math.max(0, valorAtual + delta);
  input.value = novoValor;
  atualizaValor(index, novoValor);
}

function atualizarVisibilidadeColunas(modo) {
  const mapModoClasse = {
    limpo: 'preco-limpo',
    sujo: 'preco-sujo',
    'Limpo-Parceiro': 'preco-limpoparceiro',
    'Sujo-Parceiro': 'preco-sujoparceiro'
  };

  document.querySelectorAll('.preco').forEach(td => td.style.display = 'none');

  if (mapModoClasse[modo]) {
    document.querySelectorAll(`.${mapModoClasse[modo]}`).forEach(td => td.style.display = '');
    
    // Atualiza os cabeçalhos também
    const ths = document.querySelectorAll('thead th');
    ['preco-limpo', 'preco-sujo', 'preco-limpoparceiro', 'preco-sujoparceiro'].forEach((classe, i) => {
      ths[i + 1].style.display = classe === mapModoClasse[modo] ? '' : 'none';
    });
  }
}

function atualizarTotais() {
  const modo = seletorModo.value;

  atualizarVisibilidadeColunas(modo);

  if (!modo) {
    divTotais.innerHTML = "Selecione um modo de cálculo";
    return;
  }

  let total = 0;
  let itensSelecionados = [];

  produtos.forEach((produto, i) => {
    const qtd = quantidades[i];
    if (qtd > 0) {
      const valorUnit = getValorUnit(produto, modo);
      const subtotal = valorUnit * qtd;
      total += subtotal;
      itensSelecionados.push(`${qtd}x ${produto.nome}`);
    }
  });

  const comissao = total * 0.10;

  divTotais.innerHTML = `
    🛒 <strong>Tipo de Venda:</strong> ${modo.replace("-", " ")}<br>
    🧾 <strong>Itens:</strong> ${itensSelecionados.length > 0 ? itensSelecionados.join(', ') : 'Nenhum item selecionado'}<br>
    💵 <strong>Valor Total:</strong> R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}<br>
    💸 <strong>Comissão (10%):</strong> R$ ${comissao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
}

function limparFormulario() {
  document.querySelectorAll("input[type=number]").forEach(input => input.value = 0);
  quantidades.fill(0);
  atualizarTotais();
  document.getElementById("numero-pedido").value = '';
  document.getElementById("brinde").value = '';
  document.getElementById("comprador").value = '';
  document.getElementById("vendedor").value = '';
  seletorModo.value = '';
  divTotais.innerHTML = "Selecione um modo de cálculo";

  // Oculta todas as colunas de preço ao resetar
  atualizarVisibilidadeColunas('');
}

function enviarResumoManual() {
  const modo = seletorModo.value;
  const pedido = document.getElementById("numero-pedido").value || "N/D";
  const vendedor = document.getElementById("vendedor").value || "N/D";
  const comprador = document.getElementById("comprador").value || "N/D";
  const brinde = document.getElementById("brinde").value || "#N/A";
  const botao = document.getElementById("botao-enviar");

  if (!modo) return alert("Selecione um modo de venda.");
  if (!vendedor || !comprador) return alert("Preencha vendedor e comprador.");

  let total = 0, listaItens = [];

  produtos.forEach((produto, i) => {
    const qtd = quantidades[i];
    if (qtd > 0) {
      const valorUnit = getValorUnit(produto, modo);
      const subtotal = valorUnit * qtd;
      total += subtotal;
      listaItens.push(`${qtd}x ${produto.nome}`);
    }
  });

  if (listaItens.length === 0) return alert("Adicione pelo menos um item ao pedido.");

  const comissao = total * 0.10;

  const mensagem = `📄 **Nova Nota!**

🧾 **Pedido Nº**: ${pedido}
👨‍💼 **Vendedor**: ${vendedor}
🧑‍💼 **Comprador**: ${comprador}
📦 **Itens**: ${listaItens.join(', ')}
🎁 **Brinde**: ${brinde}
💵 **Valor**: R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
💸 **Comissão (10%)**: R$ ${comissao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

  botao.disabled = true;
  botao.innerText = "⏳ Enviando...";

  fetch(webhookURL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content: mensagem })
  }).then(() => {
    alert("✅ Pedido enviado com sucesso!");
    let proximoNumero = parseInt(pedido);
    if (!isNaN(proximoNumero)) {
      localStorage.setItem("numeroPedido", proximoNumero + 1);
    } else {
      localStorage.setItem("numeroPedido", pedido);
    }
    botao.disabled = false;
    botao.innerText = "📤 Enviar para o Discord";
  }).catch(() => {
    alert("❌ Erro ao enviar o pedido.");
    botao.disabled = false;
    botao.innerText = "📤 Enviar para o Discord";
  });
}

seletorModo.addEventListener("change", atualizarTotais);

window.addEventListener("DOMContentLoaded", () => {
  const numeroSalvo = localStorage.getItem("numeroPedido");
  if (numeroSalvo) {
    document.getElementById("numero-pedido").value = numeroSalvo;
  }
  atualizarVisibilidadeColunas('');
});