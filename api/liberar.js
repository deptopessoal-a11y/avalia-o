// Libera (apaga) o bloqueio de um colaborador mediante um código de
// liberação, verificado aqui no servidor. O código correto vive só numa
// variável de ambiente do Vercel (RELEASE_PASSWORD) — nunca chega no
// navegador. O apagamento usa o Firebase Admin SDK (credencial de conta
// de serviço), que ignora as regras do Firestore: é assim que essa rota
// consegue apagar o bloqueio mesmo com "delete" restrito a admin logado
// nas regras — só quem tem esse código (dado pelo RH) chega até aqui.
const admin = require('firebase-admin');

if (!admin.apps.length) {
  const credencial = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
  admin.initializeApp({ credential: admin.credential.cert(credencial) });
}
const db = admin.firestore();

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, erro: 'Método não permitido.' });
  }

  try {
    const { chave, senha } = req.body || {};

    if (!chave || !senha) {
      return res.status(400).json({ ok: false, erro: 'Parâmetros ausentes.' });
    }

    const senhaCorreta = process.env.RELEASE_PASSWORD;
    if (!senhaCorreta || senha !== senhaCorreta) {
      return res.status(401).json({ ok: false, erro: 'Código incorreto.' });
    }

    await db.collection('bloqueados').doc(chave).delete();
    return res.status(200).json({ ok: true });

  } catch (e) {
    console.error('[api/liberar] erro:', e);
    return res.status(500).json({ ok: false, erro: 'Erro interno ao liberar.' });
  }
};
