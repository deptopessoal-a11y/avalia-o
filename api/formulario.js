const { initializeApp } = require('firebase/app');
const { getFirestore, doc, getDoc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyDHKonTFEuT09ZqmM6ovrt_l3Uwij9n1Ts",
  authDomain: "formulario-de-avaliacao-2a1bc.firebaseapp.com",
  projectId: "formulario-de-avaliacao-2a1bc",
  storageBucket: "formulario-de-avaliacao-2a1bc.firebasestorage.app",
  messagingSenderId: "26614328762",
  appId: "1:26614328762:web:ccd355acc24ad17c2d4183"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

module.exports = async (req, res) => {
  try {
    const { chave } = req.query;
    if (!chave) {
      return res.status(400).send('Parâmetro "chave" ausente.');
    }

    // Busca o colaborador autorizado no Firestore para descobrir o link do JotForm
    const snap = await getDoc(doc(db, 'autorizados', chave));
    if (!snap.exists()) {
      return res.status(404).send('Colaborador não encontrado.');
    }

    const link = snap.data().link;
    if (!link) {
      return res.status(404).send('Nenhum formulário cadastrado para este colaborador.');
    }

    const respostaExterna = await fetch(link);
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
