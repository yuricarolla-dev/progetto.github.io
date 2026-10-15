// Dati di giocatori e portieri e regole di gioco (funzioni pure, usate anche dalla simulazione)
// ===== DATI =====
const GIOCATORI = [
  { nome: 'Matteo Rinaldi',   numero: 10, ruolo: 'Fantasista',  colore: '#1e5bd8', precisione: 92, potenza: 78, pelle: '#e0ac69', capelli: '#3b2a1a', abilita2: 'rincorsa', abilita3: 'studioPortiere' },
  { nome: 'Davide Ferraro', numero: 9,  ruolo: 'Centravanti', colore: '#d62828', precisione: 68, potenza: 94, pelle: '#f1c27d', capelli: '#111111', abilita2: 'freddezza', abilita3: 'inFiamme', esultanza: 'aereo' },
  { nome: "Lorenzo Gatti", numero: 10,  ruolo: 'Ala',         colore: '#118a7e', precisione: 95, potenza: 80, pelle: '#ffdbac', capelli: '#8b5a2b', abilita: 'cucchiaioLibero', abilita2: 'finta' },
  { nome: 'Andrea Martini',    numero: 8,  ruolo: 'Regista',     colore: '#6a4c93', precisione: 88, potenza: 90, pelle: '#ffdbac', capelli: '#c68642', abilita: 'rovesciata', abilita2: 'piattoSicuro', abilita3: 'fogliaMorta', esultanza: 'capriola' },
  { nome: 'Simone Greco',   numero: 11, ruolo: 'Bomber',      colore: '#e76f51', precisione: 58, potenza: 99, pelle: '#c68642', capelli: '#2b1d0e', abilita2: 'piattoSicuro', abilita3: 'incrocio', esultanza: 'giro' },
  { nome: 'Nicola Bianchi',   numero: 14, ruolo: 'Seconda punta', colore: '#264653', precisione: 80, potenza: 72, pelle: '#f1c27d', capelli: '#a0522d', abilita: 'paradinha', abilita2: 'freddezza' },
  { nome: 'Giovanni Morabito', numero: 30, ruolo: 'Piccante',   colore: '#9d0208', precisione: 78, potenza: 84, pelle: '#5c3a21', capelli: '#111111', abilita: 'peperoncino', abilita2: 'freddezza', abilita3: 'paura', esultanza: 'giro' },
  { nome: 'Alessio Conti', numero: 21, ruolo: 'Trequartista', colore: '#023e8a', precisione: 81, potenza: 70, pelle: '#ffdbac', capelli: '#e9c46a', abilita: 'effetto', abilita2: 'freddezza' },
  // Rigorista di piazzamento: piazza bene il pallone ma non calcia fortissimo
  { nome: 'Federico Lombardi', numero: 10, ruolo: 'Trequartista',   colore: '#4a90c2', precisione: 86, potenza: 72, pelle: '#f1c27d', capelli: '#5c3a1a', abilita: 'precisione', abilita2: 'mancino', abilita3: 'rigorePassato', esultanza: 'aereo' },
  { nome: 'Cristian Moretti',       numero: 7,  ruolo: 'Fuoriclasse',  colore: '#c8102e', precisione: 86, potenza: 88, pelle: '#e0ac69', capelli: '#111111', abilita: 'golSicuro', abilita2: 'freddezza', esultanza: 'saltoMortale' },
];
// Riflessi: quanto lontano arriva col tuffo. Presa: quanti palloni trattiene quando ci arriva.
const PORTIERI = [
  { nome: 'Stefano Colombo',      numero: 1,  ruolo: 'Leggenda',     colore: '#f2c94c', riflessi: 95, presa: 95, pelle: '#f1c27d', capelli: '#6b4f2a', paraImparabili: 0.2, abilita: 'calamita', abilita2: 'allungo' },
  { nome: 'Ivan Marchetti',  numero: 12, ruolo: 'Muro di gomma', colore: '#2d6a4f', riflessi: 84, presa: 89, pelle: '#ffdbac', capelli: '#d4a017', abilita: 'ipnosi', abilita2: 'concentrazione' },
  { nome: 'Massimo Fontana',     numero: 22, ruolo: 'Mani di colla', colore: '#457b9d', riflessi: 76, presa: 97, pelle: '#8d5524', capelli: '#111111', abilita: 'muroAlto', abilita2: 'colpoDiReni' },
  { nome: 'Bruno Caruso',       numero: 16, ruolo: 'Felino',       colore: '#343a40', riflessi: 85, presa: 80, pelle: '#8d5524', capelli: '#111111', abilita: 'intuito', abilita2: 'nerviSaldi'},
  { nome: 'Valerio Esposito',   numero: 30, ruolo: 'Para-rasoterra', colore: '#ff7f11', riflessi: 79, presa: 88, pelle: '#f1c27d', capelli: '#6b4f2a', abilita: 'muroBasso', abilita2: 'concentrazione', abilita3: 'capitano' },
  { nome: 'Fabio Serra',    numero: 31, ruolo: 'Para-angoli',  colore: '#0f4c5c', riflessi: 87, presa: 84, pelle: '#ffdbac', capelli: '#111111', abilita: 'antiPrecisione', abilita2: 'colpoDiReni', abilita3: 'secondaChance' },
  { nome: 'Luka Horvat',       numero: 1,  ruolo: 'Parata laser', colore: '#1d3557', riflessi: 99, presa: 99, pelle: '#ffdbac', capelli: '#3b2a1a', abilita: 'spettatore', abilita2: 'laser' },
  { nome: 'Kevin Galli',       numero: 24, ruolo: 'Urlatore',     colore: '#bc6c25', riflessi: 89, presa: 89, pelle: '#c68642', capelli: '#2b1d0e', abilita: 'urlo', abilita2: 'allungo', abilita3: 'balletto' },
  { nome: 'Ottavio Sala',        numero: 40, ruolo: 'Leggi-mente',  colore: '#4a4e69', riflessi: 89, presa: 90, pelle: '#ffdbac', capelli: '#9a8c98', abilita: 'copione', abilita2: 'concentrazione', abilita3: 'studiaRigorista' },
  { nome: 'Ugo Pellegrini',    numero: 0,  ruolo: 'Scarsissimo',  colore: '#8b5a2b', riflessi: 15, presa: 20, pelle: '#f1c27d', capelli: '#5c3a1a', abilita: 'sedia', abilita2: 'buttoACaso', nascosta: 'paraEVinci' },
];
// Presa 96: contro il computer il super tiro entra sempre
const IL_MURO = { nome: 'Dario Ferri', numero: 1, colore: '#f2c94c', riflessi: 85, presa: 96 };
// Entra al posto di Cristian Moretti dopo i suoi 2 gol sicuri
const SOSTITUTO = { nome: 'Paolo Riva', numero: 18, ruolo: 'Sostituto', colore: '#c8102e', precisione: 66, potenza: 64, pelle: '#f1c27d', capelli: '#8b5a2b' };
const GOL_SICURI_PER_PARTITA = 2;
const RIGORI_PASSATI_PER_PARTITA = 1;
const PEPERONCINI_PER_PARTITA = 2;
const ABILITA = {
  cucchiaioLibero: '🥄 Cucchiaio direzionabile',
  rovesciata: '🤸 Rigore in rovesciata (anche col super tiro)',
  paradinha: '👀 Paradinha: vede il tuffo prima di tirare (1 a partita)',
  fortuna: '🍀 Fortunello: su palo o traversa entra una volta su due',
  effetto: '🌀 Tiro a effetto: angoli più difficili da parare',
  ipnosi: '😵 Ipnotizzatore: chi gli tira contro sbaglia di più',
  intuito: '🕷️ Intuito: a volte capisce da che parte tirerai',
  muroBasso: '🧱 Muro basso: para quasi tutti i rasoterra dal lato giusto',
  precisione: '🎯 Tiro di precisione: mai fuori e più difficile da parare (3 a partita)',
  antiPrecisione: '🎯🧤 Para-precisione: arriva molto più lontano sui tiri angolati e di precisione',
  // Seconde abilità: effetti passivi più piccoli
  freddezza: '❄️ Freddezza: dal 5° rigore in poi sbaglia molto meno',
  rincorsa: '🏃 Rincorsa potente: +10 di potenza contro le parate',
  piattoSicuro: '🦶 Piatto sicuro: nella metà bassa della porta sbaglia la metà',
  testaDura: '🔁 Testa dura: dopo un errore il tiro dopo è più sicuro e più forte',
  caricaRapida: '🔋 Carica rapida: super tiro ogni 2 gol invece di 3',
  finta: '🎭 Finta: ogni tanto spiazza il portiere',
  nerviSaldi: '❄️ Nervi saldi: dal 5° rigore in poi arriva più lontano',
  colpoDiReni: '🔝 Colpo di reni: arriva più lontano sui tiri alti',
  allungo: '📏 Allungo: tuffo un po\' più lungo',
  concentrazione: '🧘 Concentrazione: dopo una parata trattiene meglio il tiro dopo',
  urlo: '📣 Urlo da leone: il primo rigore di ogni avversario sbaglia più facilmente',
  copione: '🪞 Leggi-mente: se tiri dalla stessa parte del rigore prima, arriva molto più lontano',
  rigorePassato: '🤝 Rigore passato (1 a partita): passa la palla a un compagno, che segna se il portiere non resta al centro',
  mancino: '🦶 Mancino: i rasoterra angolati sono più difficili da parare',
  golSicuro: '🐐 Gol sicuro: 2 gol garantiti quando vuoi, nessuno li para (poi entra un sostituto)',
  spettatore: '🔦 Parata laser: ogni 2 tiri resta fermo a guardare il pallone entrare',
  laser: '🧱 Saracinesca: para tutti i tiri di precisione e di potenza',
  sedia: '🪑 Sedia: si trasforma in una sedia e resta immobile al centro, para i tiri che la colpiscono',
  buttoACaso: '🎲 Mi butto a caso: ogni 3 rigori subiti, al rigore dopo si tuffa in un punto a caso',
  inFiamme: '🔥 In fiamme: dopo 2 gol di fila, il tiro dopo ha +15 di potenza',
  studioPortiere: '🧠 Studio del portiere: dopo una parata subita, al rigore dopo vede dove si tuffa il portiere',
  fogliaMorta: '💨 Foglia morta: i tiri alti sono difficilissimi da parare, ma rischiano di andare sopra',
  incrocio: "🎯 Rigore all'incrocio (1 a partita): il primo tiro all'incrocio non può finire fuori",
  provocazione: '😤 Provocazione: il portiere si tuffa troppo presto e arriva meno lontano',
  muroAlto: '🧱 Muro alto: para quasi tutti i tiri alti dal lato giusto',
  calamita: '🧲 Guanti calamita: i tiri che gli passano vicinissimo li attira e li para',
  balletto: '💃 Balletto sulla linea: chi tira si deconcentra e sbaglia di più',
  studiaRigorista: '📒 Studia il rigorista: ricorda dove hai tirato e prova a tuffarsi lì',
  secondaChance: '🔄 Seconda chance: ribatte i palloni che rimbalzano sul palo e a volte quelli appena fuori portata',
  peperoncino: '🌶️ Peperoncino calabrese (2 a partita): ne mangia uno e tira un pallone infuocato, fortissimo',
  paura: '😰 Paura: dopo il primo errore tira i rigori più deboli (il peperoncino gliela fa passare)',
  capitano: '🙌 Capitano: quando para, il rigorista della sua squadra segna più facilmente il rigore dopo',
};
const PARADINHE_PER_PARTITA = 1;
const TIRI_PRECISIONE_PER_PARTITA = 3;
const PROB_INTUITO = 0.3;
const MODALITA = {
  allenamento: { icona: '🎯', nome: 'Allenamento', testo: '5 rigori contro il portiere del computer' },
  oltranza:    { icona: '🔥', nome: 'Ad oltranza', testo: 'Tira finché non sbagli. Il portiere migliora a ogni gol!' },
  sfida:       { icona: '🆚', nome: '1 contro 1',  testo: 'Due giocatori, stesso schermo: 5 rigori a testa, poi a oltranza' },
  torneo:      { icona: '🏆', nome: 'Torneo',      testo: '4 o 8 squadre a eliminazione: contro il computer o tra amici' },
  portiere:    { icona: '🧤', nome: 'Fai il portiere', testo: '5 rigori dei rigoristi del computer: quanti ne pari?' },
};
const METEO = {
  sereno:  { icona: '☀️', nome: 'Sereno' },
  pioggia: { icona: '🌧️', nome: 'Pioggia', testo: 'palla veloce, più errori, il portiere trattiene meno' },
  vento:   { icona: '💨', nome: 'Vento', testo: 'il vento sposta il tiro: guarda la freccia' },
  neve:    { icona: '❄️', nome: 'Neve', testo: 'palla lenta: tiri meno forti, il portiere arriva più lontano' },
};
// Porta in percentuale del campo: più grande è più facile segnare
const STADI = {
  classico: { icona: '🏟️', nome: 'Classico' },
  notte:    { icona: '🌃', nome: 'Notturno' },
  spiaggia: { icona: '🏖️', nome: 'Spiaggia (porta grande)' },
  oratorio: { icona: '⛪', nome: 'Oratorio (porta piccola)' },
};
const TIRI_FAI_IL_PORTIERE = 5;
const RIGORI_REGOLAMENTARI = 5;

const GOL_PER_SUPER = 3;
const PRESA_ANTI_SUPER = 97; // solo i portieri con almeno questa presa possono parare il super tiro
const ESITI_GOL = ['gol', 'imparabile', 'super', 'paloGol', 'traversaGol', 'sicuro', 'guardato', 'passato'];
const ESITI_PARATA = ['parato', 'miracolo', 'laser', 'ribattuta'];
const RIGORI_PER_BUTTARSI = 3; // ogni 3 rigori subiti, al rigore dopo Ugo Pellegrini si butta a caso
// ===== FINE DATI =====

// ===== MOTORE =====
// Funzioni pure: niente DOM, così le usa anche la simulazione di bilanciamento.

// 0 = punto sicuro, 1 = attaccato a palo o traversa
function rischioBordo(p, width) {
  const bordo = Math.min(p.x, width - p.x, p.y);
  return Math.max(0, (40 - bordo) / 40);
}

function tuffoCPU(width, height) {
  if (Math.random() < 0.15) return { x: width / 2, y: height * 0.75 };
  return { x: width * (0.1 + Math.random() * 0.8), y: height * (0.2 + Math.random() * 0.7) };
}

// La Sedia si butta a caso solo al 4°, 7°, 10°... rigore che affronta
function sediaSiButta(tiriSubiti) {
  return tiriSubiti > 0 && tiriSubiti % RIGORI_PER_BUTTARSI === 0;
}

// La Sedia ferma occupa il centro della porta: sedile, schienale e manine (in px dal basso della porta)
function colpisceSedia(tiro, width, height) {
  return Math.abs(tiro.x - width / 2) < 30 && tiro.y > height - 80;
}

// Ugo Pellegrini resta ferma al centro, oppure si butta in un punto qualsiasi
function tuffoSedia(width, height, aCaso) {
  if (aCaso) return { x: Math.random() * width, y: Math.random() * height };
  return { x: width / 2, y: height * 0.6 };
}

// Il portiere del computer usa le sue abilità di lettura
function tuffoIntelligente(width, height, numero1, tiro, tiroPrecedente) {
  if (tiro && numero1.abilita === 'intuito' && Math.random() < PROB_INTUITO) {
    const terzo = Math.min(2, Math.floor(tiro.x / (width / 3)));
    return { x: (terzo + Math.random()) * width / 3, y: height * (0.2 + Math.random() * 0.7) };
  }
  if (haAbilita(numero1, 'studiaRigorista') && tiroPrecedente && Math.random() < 0.6) {
    return {
      x: Math.min(width, Math.max(0, tiroPrecedente.x + (Math.random() - 0.5) * 50)),
      y: Math.min(height, Math.max(0, tiroPrecedente.y + (Math.random() - 0.5) * 40)),
    };
  }
  return tuffoCPU(width, height);
}

function zonaIncrocio(p, width) {
  return p.y < 40 && (p.x < 50 || p.x > width - 50);
}

// Eventi del meteo, decisi prima del tiro (non toccano gol sicuro e rigore passato):
// raffica di vento che porta via il pallone, oppure pallone che resta basso nella neve
const PROB_EVENTO_METEO = 0.3;
function effettoMeteo(tiro, meteo, height) {
  if (tiro.sicuro || tiro.passato) return tiro;
  if (meteo === 'vento' && Math.random() < PROB_EVENTO_METEO) return { ...tiro, portatoVia: true };
  if (meteo === 'neve' && Math.random() < PROB_EVENTO_METEO) return { ...tiro, y: height * 0.92, basso: true };
  return tiro;
}

function haAbilita(g, nome) {
  return Boolean(g) && (g.abilita === nome || g.abilita2 === nome || g.abilita3 === nome);
}

function golPerSuper(g) {
  return g.abilita2 === 'caricaRapida' ? 2 : GOL_PER_SUPER;
}

// Luka Horvat resta a guardare al 2°, 4°, 6°... tiro che affronta
function portiereSpettatore(numero1, tiriSubiti) {
  return numero1.abilita === 'spettatore' && tiriSubiti % 2 === 1;
}

// ctx: { width, height, bonusPortata, decisivo, dopoErrore, dopoParata, primoTiro, tiroPrecedente, tiriSubiti,
//        serieGol, incrocioDisponibile, bonusCapitano, meteo }
function calcolaEsito(tiro, tuffo, tiratore, numero1, ctx) {
  const { width, height } = ctx;
  // Gol sicuro di Cristian Moretti: non sbaglia e nessuno lo para
  if (tiro.sicuro) return 'sicuro';
  // Rigore passato: il compagno segna a porta vuota, a meno che il portiere sia rimasto basso al centro
  if (tiro.portatoVia) return 'portatoVia';
  if (tiro.passato) {
    const restaAlCentro = Math.abs(tuffo.x - width / 2) < width * 0.1 && tuffo.y > height * 0.5;
    return restaAlCentro ? 'parato' : 'passato';
  }
  // Il vento può portare il pallone fuori dallo specchio
  if (tiro.x < 0 || tiro.x > width) return 'fuori';
  const errore = (110 - tiratore.precisione) / 60;

  // Precisione oltre 90: rischio massimo (attaccato a palo o traversa) dal 15% a 91 fino al 7% a 100
  let rischio = tiratore.precisione > 90
    ? Math.max(0.005, rischioBordo(tiro, width) * (0.15 - (tiratore.precisione - 91) / 9 * 0.08))
    : (0.02 + rischioBordo(tiro, width) * 0.55) * errore;
  if (tiro.cucchiaio) rischio += 0.03 * errore;
  if (tiro.rovesciata) rischio += 0.2; // gesto spettacolare ma difficile
  if (numero1.abilita === 'ipnosi') rischio = rischio * 1.4 + 0.05;
  if (numero1.abilita === 'urlo' && ctx.primoTiro) rischio += 0.08;
  // Seconde abilità di chi tira
  if (tiratore.abilita2 === 'freddezza' && ctx.decisivo) rischio *= 0.4;
  if (tiratore.abilita2 === 'piattoSicuro' && tiro.y > height / 2) rischio *= 0.5;
  if (tiratore.abilita2 === 'testaDura' && ctx.dopoErrore) rischio *= 0.5;
  if (haAbilita(tiratore, 'fogliaMorta') && tiro.y < height / 3) rischio += 0.05;
  if (haAbilita(numero1, 'balletto')) rischio = rischio * 1.2 + 0.04;
  if (ctx.meteo === 'pioggia') rischio += 0.03;
  if (ctx.bonusCapitano) rischio *= 0.5;
  if (haAbilita(tiratore, 'incrocio') && ctx.incrocioDisponibile && zonaIncrocio(tiro, width)) rischio = 0;
  if (tiro.mirato) rischio = 0; // tiro di precisione: mai fuori

  if (tiro.super) rischio = 0; // super tiro: precisione 100%
  if (Math.random() < rischio) {
    const versoTraversa = tiro.y < Math.min(tiro.x, width - tiro.x);
    const fortunato = tiratore.abilita === 'fortuna';
    const legno = Math.random() < (fortunato ? 0.6 : 0.35);
    let entra = legno && fortunato && Math.random() < 0.5;
    // Seconda chance: il pallone che torna dal legno lo ribatte il portiere
    if (entra && haAbilita(numero1, 'secondaChance')) return 'ribattuta';
    if (versoTraversa) return entra ? 'traversaGol' : legno ? 'traversa' : 'alta';
    return entra ? 'paloGol' : legno ? 'palo' : 'fuori';
  }

  // Spettatore: se il tiro è nello specchio, lo guarda entrare
  if (portiereSpettatore(numero1, ctx.tiriSubiti || 0)) return 'guardato';

  // Parata laser: ferma i tiri di precisione e quelli di potenza
  const laser = numero1.abilita2 === 'laser';
  if (laser && (tiro.mirato || tiro.super)) return 'laser';

  // Super tiro: solo un portiere con presa da 97 in su ha una chance
  if (tiro.super && numero1.presa < PRESA_ANTI_SUPER) return 'super';

  // Sedia ferma: para solo i palloni che la colpiscono
  if (numero1.abilita === 'sedia' && !sediaSiButta(ctx.tiriSubiti || 0)) {
    return colpisceSedia(tiro, width, height) ? 'parato' : 'gol';
  }

  const distanza = Math.hypot(tiro.x - tuffo.x, (tiro.y - tuffo.y) * 0.7);

  // Cucchiaio: palla lenta, il portiere la prende solo se è già lì
  if (tiro.cucchiaio) return distanza < 60 && Math.random() < 0.9 ? 'parato' : 'gol';

  // Potenza oltre 90: 30% di tiro imparabile (se è nello specchio)
  if (tiratore.potenza > 90 && Math.random() < 0.3) {
    if (laser) return 'laser';
    // Alcuni portieri (Stefano Colombo) riescono a volte a parare anche l'imparabile
    const p = numero1.paraImparabili || 0;
    return Math.random() < p ? 'miracolo' : 'imparabile';
  }

  // Muro basso: i rasoterra dal lato giusto finiscono quasi sempre tra le sue braccia
  const stessoLato = Math.abs(tiro.x - tuffo.x) < width / 3;
  if (numero1.abilita === 'muroBasso' && tiro.y > height * 2 / 3 && stessoLato && Math.random() < 0.7) return 'parato';
  if (haAbilita(numero1, 'muroAlto') && tiro.y < height / 3 && stessoLato && Math.random() < 0.45) return 'parato';
  // Guanti calamita: i tiri che passano vicinissimo li attira sempre
  if (haAbilita(numero1, 'calamita') && distanza < 30) return 'parato';

  let portata = 40 + numero1.riflessi * 0.65 + (ctx.bonusPortata || 0); // px raggiunti col tuffo
  if (tiro.rovesciata) portata *= 0.5; // il portiere resta sorpreso
  if (tiro.piccante) portata *= 0.75; // pallone infuocato: il portiere non ci arriva bene
  if (tiro.basso) portata *= 1.15; // frenato dalla neve: il portiere ha più tempo
  if (tiratore.abilita === 'effetto' && Math.abs(tiro.x - width / 2) > width / 6) portata *= 0.65;
  const rasoterraAngolato = tiro.y > height * 2 / 3 && Math.abs(tiro.x - width / 2) > width / 6;
  if (haAbilita(tiratore, 'mancino') && rasoterraAngolato) portata *= 0.8;
  // Il para-precisione legge i tiri angolati e annulla il vantaggio del tiro di precisione
  const angolato = tiro.mirato || rischioBordo(tiro, width) > 0;
  if (numero1.abilita === 'antiPrecisione' && angolato) portata *= 1.4;
  else if (tiro.mirato) portata *= 0.8;
  // Leggi-mente: punisce chi tira due volte di fila nello stesso terzo di porta
  const terzo = x => Math.min(2, Math.floor(x / (width / 3)));
  if (numero1.abilita === 'copione' && ctx.tiroPrecedente && terzo(ctx.tiroPrecedente.x) === terzo(tiro.x)) portata *= 1.6;
  // Seconde abilità del portiere
  if (numero1.abilita2 === 'nerviSaldi' && ctx.decisivo) portata *= 1.12;
  if (numero1.abilita2 === 'colpoDiReni' && tiro.y < height / 3) portata *= 1.15;
  if (numero1.abilita2 === 'allungo') portata *= 1.06;
  // Seconde abilità di chi tira contro la parata
  if (tiratore.abilita2 === 'testaDura' && ctx.dopoErrore) portata *= 0.9;
  if (tiratore.abilita2 === 'finta' && Math.random() < 0.15) portata *= 0.5;
  if (haAbilita(tiratore, 'fogliaMorta') && tiro.y < height / 3) portata *= 0.7;
  if (haAbilita(tiratore, 'provocazione')) portata *= 0.88;
  if (ctx.bonusCapitano) portata *= 0.9;
  if (ctx.meteo === 'neve') portata *= 1.08;

  if (distanza < portata) {
    const bonusPotenza = (tiratore.abilita2 === 'rincorsa' ? 10 : 0)
      + (tiro.piccante ? 25 : 0)
      - (haAbilita(tiratore, 'paura') && ctx.haSbagliato && !tiro.piccante ? 25 : 0)
      + (haAbilita(tiratore, 'inFiamme') && ctx.serieGol >= 2 ? 15 : 0)
      - (ctx.meteo === 'neve' ? 10 : 0);
    const potenza = Math.min(100, tiratore.potenza + bonusPotenza);
    const presaBase = numero1.presa
      + (numero1.abilita2 === 'concentrazione' && ctx.dopoParata ? 8 : 0)
      - (ctx.meteo === 'pioggia' ? 10 : 0);
    const presa = 0.6 + presaBase * 0.004;
    const pParata = (0.95 - (distanza / portata) * 0.6) * (1.3 - potenza / 200) * presa;
    if (Math.random() < pParata) return 'parato';
  }
  // Seconda chance: ogni tanto ribatte un tiro appena fuori portata
  if (haAbilita(numero1, 'secondaChance') && distanza < portata + 30 && Math.random() < 0.08) return 'ribattuta';
  return 'gol';
}
// Quanti gol di fila alla fine della lista
function serieFinale(lista) {
  let n = 0;
  for (let i = lista.length - 1; i >= 0 && lista[i]; i--) n++;
  return n;
}

// 0 o 1 se c'è un vincitore della serie di rigori, altrimenti null
function vincitoreDi(tiri, vittoriaIstantanea) {
  if (vittoriaIstantanea !== null) return vittoriaIstantanea;
  const [a, b] = tiri;
  const ga = a.filter(Boolean).length;
  const gb = b.filter(Boolean).length;
  const N = RIGORI_REGOLAMENTARI;
  if (a.length <= N && b.length <= N) {
    if (ga + (N - a.length) < gb) return 1;
    if (gb + (N - b.length) < ga) return 0;
    if (a.length < N || b.length < N) return null;
  }
  // Oltranza: si decide solo dopo che entrambi hanno tirato
  if (a.length === b.length && ga !== gb) return ga > gb ? 0 : 1;
  return null;
}

function mescola(lista) {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

// Simula una serie di rigori tra due squadre del computer, senza animazioni.
// Usata dal torneo e dalla simulazione di bilanciamento.
function simulaPartita(A, B, meteo = 'sereno') {
  const W = 324, H = 144;
  const lati = [A, B].map(sq => ({
    g: sq.rigorista, tiri: [], superUsati: 0, precisioni: 0, sicuri: 0, passati: 0, paradinhe: 0, peperoncini: 0,
    incrocioUsato: false, ultimo: null, ultimoTiro: null,
  }));
  const port = [A.portiere, B.portiere];
  let istantanea = null;
  let t = Math.random() < 0.5 ? 0 : 1;
  for (let n = 0; n < 200; n++) {
    const lato = lati[t];
    const numero1 = port[1 - t];
    if (lato.g.abilita === 'golSicuro' && lato.sicuri >= GOL_SICURI_PER_PARTITA) lato.g = SOSTITUTO;
    const g = lato.g;
    const gol = lato.tiri.filter(Boolean).length;
    let tiro = { x: W * (0.08 + Math.random() * 0.84), y: H * (0.12 + Math.random() * 0.83) };
    if (g.abilita === 'golSicuro' && lato.sicuri < GOL_SICURI_PER_PARTITA) {
      tiro.sicuro = true; lato.sicuri++;
    } else if (Math.floor(gol / golPerSuper(g)) - lato.superUsati > 0) {
      tiro.super = true; lato.superUsati++;
      if (g.abilita === 'rovesciata') tiro.rovesciata = true;
    } else if (g.abilita === 'precisione' && lato.precisioni < TIRI_PRECISIONE_PER_PARTITA) {
      tiro.mirato = true; lato.precisioni++;
    } else if (haAbilita(g, 'rigorePassato') && lato.passati < RIGORI_PASSATI_PER_PARTITA && Math.random() < 0.3) {
      tiro.passato = true; lato.passati++;
    } else if (haAbilita(g, 'peperoncino') && lato.peperoncini < PEPERONCINI_PER_PARTITA && Math.random() < 0.5) {
      tiro.piccante = true; lato.peperoncini++;
    }
    let tuffo;
    if (numero1.abilita === 'sedia') tuffo = tuffoSedia(W, H, sediaSiButta(lato.tiri.length));
    else if (portiereSpettatore(numero1, lato.tiri.length)) tuffo = { x: W / 2, y: H * 0.75 };
    else tuffo = tuffoIntelligente(W, H, numero1, tiro, lato.ultimoTiro);
    // Paradinha o studio del portiere: il rigorista vede il tuffo e tira lontano
    const studio = haAbilita(g, 'studioPortiere') && ESITI_PARATA.includes(lato.ultimo);
    const paradinha = g.abilita === 'paradinha' && lato.paradinhe < PARADINHE_PER_PARTITA;
    if (paradinha && !studio) lato.paradinhe++;
    if ((studio || paradinha) && !tiro.sicuro && !tiro.passato) {
      tiro.x = tuffo.x < W / 2 ? W * (0.65 + Math.random() * 0.2) : W * (0.15 + Math.random() * 0.2);
      tiro.y = H * (0.35 + Math.random() * 0.55);
    }
    const altro = lati[1 - t];
    tiro = effettoMeteo(tiro, meteo, H);
    const esito = calcolaEsito(tiro, tuffo, g, numero1, {
      width: W, height: H, bonusPortata: 0,
      decisivo: lato.tiri.length >= RIGORI_REGOLAMENTARI - 1,
      dopoErrore: lato.ultimo !== null && !ESITI_GOL.includes(lato.ultimo),
      dopoParata: ESITI_PARATA.includes(lato.ultimo),
      primoTiro: lato.tiri.length === 0,
      tiroPrecedente: lato.ultimoTiro,
      tiriSubiti: lato.tiri.length,
      serieGol: serieFinale(lato.tiri),
      incrocioDisponibile: !lato.incrocioUsato,
      haSbagliato: lato.tiri.includes(false),
      bonusCapitano: haAbilita(port[t], 'capitano') && ESITI_PARATA.includes(altro.ultimo),
      meteo,
    });
    if (haAbilita(g, 'incrocio') && zonaIncrocio(tiro, W)) lato.incrocioUsato = true;
    lato.ultimo = esito;
    lato.ultimoTiro = tiro;
    lato.tiri.push(ESITI_GOL.includes(esito));
    if (numero1.abilita === 'sedia' && esito === 'parato') istantanea = 1 - t;
    const v = vincitoreDi([lati[0].tiri, lati[1].tiri], istantanea);
    if (v !== null) {
      return {
        vincitore: v,
        gol: lati.map(l => l.tiri.filter(Boolean).length),
        tiri: lati.map(l => l.tiri.length),
        istantanea: istantanea !== null,
      };
    }
    t = 1 - t;
  }
  return { vincitore: Math.random() < 0.5 ? 0 : 1, gol: lati.map(l => l.tiri.filter(Boolean).length), tiri: lati.map(l => l.tiri.length), istantanea: false };
}
// ===== FINE MOTORE =====
