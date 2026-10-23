(() => {
  const f = document.getElementById('f'), err = document.getElementById('err'), ok = document.getElementById('ok');
  const fail = (msg, field) => { ok.hidden = true; err.textContent = msg; err.hidden = false; field.focus(); };
  f.addEventListener('input', () => { err.hidden = true; ok.hidden = true; });
  f.addEventListener('submit', e => {
    e.preventDefault();
    const email = f.email.value.trim(), senha = f.senha.value;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail('Digite um e-mail válido, como nome@instituicao.gov.br.', f.email);
    if (senha.length < 4) return fail('A senha precisa ter pelo menos 4 caracteres.', f.senha);
    err.hidden = true;
    ok.textContent = '';
    ok.hidden = false;
    /* Aqui entra a verificação da conta, quando o grupo ligar as partes do projeto. */
  });
})();