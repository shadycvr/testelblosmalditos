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

function getValorUnit(produto, modo) {
  return produto[
    modo === "limpo" ? "limpo" :
    modo === "sujo" ? "sujo" :
    modo === "Limpo-Parceiro" ? "LimpoParceiro" :
    modo === "Sujo-Parceiro" ? "SujoParceiro" : ""
  ] || 0;
}

window.addEventListener("DOMContentLoaded", () => {
  const seletorModo = document.getElementById("mode-selector");
  const divTotais = document.getElementById("totais");
  const tabelaProdutos = document.getElementById("produtos");
  const numeroSalvo = localStorage.getItem("numeroPedido");
if (numeroSalvo) {
  document.getElementById("numero-pedido").value = numeroSalvo;
}

  produtos.forEach((produto, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${produto.nome}</td>
      <td class="col-limpo">R$ ${produto.limpo.toLocaleString('pt-BR')}</td>
      <td class="col-sujo">R$ ${produto.sujo.toLocaleString('pt-BR')}</td>
      <td class="col-limpo-parceiro">R$ ${produto.LimpoParceiro.toLocaleString('pt-BR')}</td>
      <td class="col-sujo-parceiro">R$ ${produto.SujoParceiro.toLocaleString('pt-BR')}</td>
      <td>
        <button class="btn-menos" data-index="${index}">−</button>
        <input type="number" min="0" value="0" data-index="${index}" readonly style="width: 40px; text-align: center;">
        <button class="btn-mais" data-index="${index}">+</button>
      </td>
    `;
    tabelaProdutos.appendChild(tr);
  });

  tabelaProdutos.addEventListener("click", (e) => {
    const index = parseInt(e.target.dataset.index);
    if (e.target.classList.contains("btn-mais")) {
      quantidades[index]++;
    } else if (e.target.classList.contains("btn-menos") && quantidades[index] > 0) {
      quantidades[index]--;
    } else {
      return;
    }
    const input = document.querySelector(`input[data-index="${index}"]`);
    input.value = quantidades[index];
    atualizarTotais();
  });

  seletorModo.addEventListener("change", () => {
    atualizarTotais();
    atualizarVisibilidadeColunas(seletorModo.value);
  });

  atualizarVisibilidadeColunas(""); // inicia ocultando todas

  function atualizarTotais() {
    const modo = seletorModo.value;
    if (!modo) {
      divTotais.innerHTML = "Selecione um modo de cálculo";
      return;
    }

    let total = 0;
    let itensSelecionados = [];

    produtos.forEach((produto, i) => {
      const qtd = quantidades[i];
      if (qtd > 0) {
        let valorUnit = getValorUnit(produto, modo);
        const subtotal = valorUnit * qtd;
        total += subtotal;
        itensSelecionados.push(`${qtd}x ${produto.nome}`);
      }
    });

    const comissao = total * 0.10;

    divTotais.innerHTML = `
      🛒 <strong>Tipo de Venda:</strong> ${modo.replace("-", " ")}<br>
      🧾 <strong>Itens:</strong> ${itensSelecionados.length > 0 ? itensSelecionados.join(', ') : 'Nenhum item'}<br>
      💵 <strong>Total:</strong> R$ ${total.toLocaleString('pt-BR')}<br>
      💸 <strong>Comissão (10%):</strong> R$ ${comissao.toLocaleString('pt-BR')}
    `;
  }

  function atualizarVisibilidadeColunas(modo) {
    // Oculta todas
    const classes = ['col-limpo', 'col-sujo', 'col-limpo-parceiro', 'col-sujo-parceiro'];
    classes.forEach(cls => {
      document.querySelectorAll(`.${cls}`).forEach(el => el.style.display = "none");
    });

    // Mostra só a coluna correta
    const map = {
      "limpo": "col-limpo",
      "sujo": "col-sujo",
      "Limpo-Parceiro": "col-limpo-parceiro",
      "Sujo-Parceiro": "col-sujo-parceiro"
    };

    const classeParaMostrar = map[modo];
    if (classeParaMostrar) {
      document.querySelectorAll(`.${classeParaMostrar}`).forEach(el => el.style.display = "");
    }
  }
});

function enviarResumoManual() {
  const seletorModo = document.getElementById("mode-selector"); // ← ADICIONADA AQUI!
  const modo = seletorModo.value;
  const pedido = document.getElementById("numero-pedido").value || "N/D";
  const vendedor = document.getElementById("vendedor").value || "N/D";
  const comprador = document.getElementById("comprador").value || "N/D";
  const brinde = document.getElementById("brinde").value || "N/A";
  const botao = document.getElementById("botao-enviar");
  let proximoNumero = parseInt(pedido);
if (!isNaN(proximoNumero)) {
  localStorage.setItem("numeroPedido", proximoNumero + 1);
}

  if (!modo) return alert("Selecione um modo de venda.");
  if (!vendedor || !comprador) return alert("Preencha vendedor e comprador.");

  let total = 0;
  let listaItens = [];

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
💵 **Valor**: ${total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
💸 **Comissão (10%)**: ${comissao.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
`;

  botao.disabled = true;
  botao.innerText = "⏳ Enviando...";
  fetch(webhookURL = "config.js", { 
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content: mensagem })
  }).then(() => {
    alert("✅ Pedido enviado com sucesso!");

    // Salvar número do pedido automaticamente
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
function limparFormulario() {
  document.getElementById('numero-pedido').value = '';
  document.getElementById('comprador').value = '';
  document.getElementById('vendedor').value = '';
  document.getElementById('brinde').value = '';
  document.getElementById('mode-selector').value = '';
}
document.querySelectorAll('input[type="number"]').forEach(input => input.value = 0);
document.getElementById('totais').innerText = 'Selecione um modo de cálculo';

function atualizarColunasPorModo(modoSelecionado) {
  const colunas = {
    limpo: document.querySelectorAll('.col-limpo'),
    sujo: document.querySelectorAll('.col-sujo'),
    'Limpo-Parceiro': document.querySelectorAll('.col-limpo-parceiro'),
    'Sujo-Parceiro': document.querySelectorAll('.col-sujo-parceiro'),
  };

  // Oculta todas
  Object.values(colunas).forEach(coluna => {
    coluna.forEach(celula => celula.style.display = 'none');
  });

  // Mostra apenas a coluna do modo escolhido
  if (colunas[modoSelecionado]) {
    colunas[modoSelecionado].forEach(celula => celula.style.display = 'table-cell');
  }

  atualizarTotal(); // Atualiza o valor total exibido
}