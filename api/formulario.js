if (!respostaExterna.ok) {
      return res.status(502).send('Não foi possível carregar o formulário no momento.');
    }
 
    let html = await respostaExterna.text();
 
    // Injeta uma tag <base> para que imagens, CSS e scripts relativos continuem
    // sendo carregados do JotForm normalmente, mesmo servindo a página pelo nosso domínio
    if (!/<base[\s>]/i.test(html)) {
      html = html.replace(/<head([^>]*)>/i, `<head$1><base href="${link}">`);
    }
 
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    // Evita que essa resposta fique guardada em cache do navegador ou de CDN
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).send(html);
 
  } catch (e) {
    console.error('[api/formulario] erro:', e);
    return res.status(500).send('Erro interno ao carregar o formulário.');
  }
};
