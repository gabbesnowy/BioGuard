(() => {
  const f    = document.getElementById('f');
  const err  = document.getElementById('err');
  const ok   = document.getElementById('ok');

  /* ───── Configuração ───── */
  const DESTINO      = 'painel.html';   // página para onde redirecionar
  const ATRASO_MS    = 1200;            // tempo mostrando "Entrando..." antes de redirecionar
  const EMAIL_DEMO   = 'admin@bioguard.gov.br';
  const SENHA_DEMO   = '1234';
  /* ──────────────────────── */

  const fail = (msg, field) => {
    ok.hidden = true;
    err.textContent = msg;
    err.hidden = false;
    field.focus();
  };

  f.addEventListener('input', () => { err.hidden = true; ok.hidden = true; });

  f.addEventListener('submit', e => {
    e.preventDefault();

    const email = f.email.value.trim();
    const senha = f.senha.value;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return fail('Digite um e-mail válido, como nome@instituicao.gov.br.', f.email);

    if (senha.length < 4)
      return fail('A senha precisa ter pelo menos 4 caracteres.', f.senha);

    /* ───── Verificação (modo demonstração) ───── */
    if (email !== EMAIL_DEMO || senha !== SENHA_DEMO)
      return fail('E-mail ou senha incorretos.', f.email);

    /* ───── Sucesso ───── */
    err.hidden = true;
    ok.textContent = 'Login aceito. Redirecionando…';
    ok.hidden = false;

    // desabilita o botão enquanto redireciona
    const btn = f.querySelector('button[type="submit"]');
    if (btn) btn.disabled = true;

    setTimeout(() => {
      window.location.href = DESTINO;
    }, ATRASO_MS);
  });
})();