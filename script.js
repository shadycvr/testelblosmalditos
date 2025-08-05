const produtos = [
    { nome: "Cartão Raro", limpo: 15000, sujo: 12000, limpoParc: 11250, sujoParc: 9000 },
    { nome: "Cartão in-Commum", limpo: 20000, sujo: 16000, limpoParc: 15000, sujoParc: 12000 },
    { nome: "Cartão Comum", limpo: 30000, sujo: 25000, limpoParc: 22500, sujoParc: 18750 },
    { nome: "Cartão Normal", limpo: 45000, sujo: 37500, limpoParc: 41250, sujoParc: 33750 },
    { nome: "Cartão Lendário", limpo: 100000, sujo: 80000, limpoParc: 75000, sujoParc: 60000 },
    { nome: "Pendrive", limpo: 9000, sujo: 6000, limpoParc: 7500, sujoParc: 6000 },
    { nome: "Alicate", limpo: 4000, sujo: 3000, limpoParc: 3750, sujoParc: 3000 },
    { nome: "Celular", limpo: 50000, sujo: 40000, limpoParc: 37500, sujoParc: 30000 },
    { nome: "Bloqueador", limpo: 7000, sujo: 6000, limpoParc: 5250, sujoParc: 4500 },
    { nome: "Notebook", limpo: 9000, sujo: 8000, limpoParc: 7500, sujoParc: 6000 },
    { nome: "Ticket", limpo: 2000, sujo: 1500, limpoParc: 1000, sujoParc: 750 },
    { nome: "Lockpick Alumínio", limpo: 3000, sujo: 2500, limpoParc: 2000, sujoParc: 1500 },
    { nome: "Lockpick Cobre", limpo: 4000, sujo: 3000, limpoParc: 2500, sujoParc: 2000 },
    { nome: "note", limpo: 15000, sujo: 12000, limpoParc: 11250, sujoParc: 9000 },
    { nome: "not", limpo: 20000, sujo: 16000, limpoParc: 18000, sujoParc: 15000 },
    { nome: "chip", limpo: 5000, sujo: 4000, limpoParc: 4500, sujoParc: 4000 },
    { nome: "Chip", limpo: 3000, sujo: 2500, limpoParc: 2000, sujoParc: 1500 }
  ];

  const quantidades = new Array(produtos.length).fill(0);
  const seletorModo = document.getElementById("mode-selector");
  const divTotais = document.getElementById("totais");
  const tabelaProdutos = document.getElementById("produtos");
  const webhookURL = "https://discord.com/api/webhooks/1400936108434391132/moZC9CNnNzNQlRfK9pjq8iIIucC7q3f-B0u4-VU40Z6GsW1F90PnYskV6BSvu-rDv03D";

  // Cria tabela
  produtos.forEach((produto, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${produto.nome}</td>
      <td class="limpo">R$ ${produto.limpo}</td>
      <td class="sujo">R$ ${produto.sujo}</td>
      <td class="limpo-parc">R$ ${produto.limpoParc}</td>
      <td class="sujo-parc">R$ ${produto.sujoParc}</td>
      <td><input type="number" min="0" value="0" onchange="atualizaValor(${index}, this.value)"></td>
    `;
    tabelaProdutos.appendChild(tr);
  });

  // Atualiza ao alterar quantidade
  function atualizaValor(index, quantidade) {
    quantidades[index] = parseInt(quantidade) || 0;
    atualizarTotais();
  }

  // Calcula total + envia para Discord
  function atualizarTotais() {
    const modo = seletorModo.value;
    let total = 0;
    let mensagem = `📦 **Resumo do Pedido (${modo})**\n`;

    produtos.forEach((produto, i) => {
      const qtd = quantidades[i];
      if (qtd > 0) {
        let valorUnit = 0;
        if (modo === "limpo") valorUnit = produto.limpo;
        else if (modo === "sujo") valorUnit = produto.sujo;
        else if (modo === "limpo-parc") valorUnit = produto.limpoParc;
        else if (modo === "sujo-parc") valorUnit = produto.sujoParc;

        const subtotal = valorUnit * qtd;
        total += subtotal;
        mensagem += `• ${produto.nome} x${qtd} = R$ ${subtotal.toLocaleString('pt-BR')}\n`;
      }
    });

    const totalFinal = total * 0.90; // aplica 10%
    const totalTexto = modo
      ? `💰 **Total com 10% de comissão:** R$ ${totalFinal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
      : "Selecione um modo de cálculo";

    divTotais.textContent = totalTexto;

    if (modo && total > 0) {
      mensagem += `\n${totalTexto}`;
      enviarParaDiscord(mensagem);
    }
  }

  // Envia para webhook Discord
  function enviarParaDiscord(mensagem) {
    fetch(webhookURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: mensagem })
    }).catch(error => console.error("Erro ao enviar para o Discord:", error));
  }

  // Atualiza total ao mudar modo
  seletorModo.addEventListener("change", atualizarTotais);
</script>

</body>
</html>