// Load BackEnd/.env so DATABASE_URL is set when run via ts-node (the Prisma
// CLI loads it automatically, but PrismaClient on its own does not).
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('dotenv').config();
} catch {
  /* env already provided by the shell */
}

import { PrismaClient, Evaluation, LearningMethod, StudyMethod } from '@prisma/client';
import * as bcrypt from 'bcrypt';

// Seeds a fully-populated demo user so /inicio, /analisis and the spaced
// repetition flow have realistic data. Idempotent: re-running wipes and
// recreates the demo user (cascade deletes everything it owns).
//
// USAGE: npm run seed:demo   (user: demo / pass: Demo1234)

const prisma = new PrismaClient();

const USERNAME = 'demo';
const PASSWORD = 'Demo1234';

// Deterministic PRNG so re-runs produce comparable data.
let _s = 123456789;
const rnd = () => {
  _s = (_s * 1664525 + 1013904223) % 4294967296;
  return _s / 4294967296;
};
const pick = <T>(arr: T[]): T => arr[Math.floor(rnd() * arr.length)];
const chance = (p: number) => rnd() < p;
const between = (a: number, b: number) => Math.floor(a + rnd() * (b - a + 1));

const now = new Date();
const at = (daysAgo: number, hour: number, min = 0) => {
  const d = new Date(now);
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hour, min, 0, 0);
  return d;
};

type AR = { kind: 'activeRecall'; title: string; q: string; a: string };
type CO = {
  kind: 'cornell';
  title: string;
  principal: string;
  questions: string;
  short: string;
};
type CardSeed = AR | CO;

const ar = (title: string, q: string, a: string): AR => ({
  kind: 'activeRecall',
  title,
  q,
  a,
});
const co = (
  title: string,
  principal: string,
  questions: string,
  short: string,
): CO => ({ kind: 'cornell', title, principal, questions, short });

const MATES: CardSeed[] = [
  ar('Derivada de una constante', '¿Cuál es la derivada de f(x)=c?', '0'),
  ar('Regla de la potencia', '¿Cuál es la derivada de xⁿ?', 'n·xⁿ⁻¹'),
  ar('Teorema de Pitágoras', '¿Qué relación cumple un triángulo rectángulo?', 'a² + b² = c²'),
  ar('Identidad trigonométrica', '¿Cuánto vale sen²θ + cos²θ?', '1'),
  ar('Límite notable', '¿A qué tiende sen(x)/x cuando x→0?', '1'),
  ar('Integral de 1/x', '¿Cuál es ∫(1/x)dx?', 'ln|x| + C'),
  ar('Fórmula general', '¿Cuáles son las raíces de ax²+bx+c=0?', 'x = (−b ± √(b²−4ac)) / 2a'),
  ar('Determinante 2×2', '¿Cómo se calcula el determinante de [[a,b],[c,d]]?', 'ad − bc'),
  ar('Logaritmo de un producto', '¿A qué equivale log(xy)?', 'log x + log y'),
  co('Regla de la cadena', 'La derivada de f(g(x)) es f′(g(x))·g′(x).', '¿Cómo se deriva una función compuesta?', 'Externa por interna.'),
  co('Concepto de límite', 'Valor al que se aproxima una función cuando x tiende a un punto, exista o no allí.', '¿Qué describe un límite?', 'Tendencia, no el valor.'),
  co('Teorema fundamental del cálculo', 'Si F′=f, entonces ∫ₐᵇ f dx = F(b) − F(a).', '¿Qué conecta derivadas con integrales?', 'Integrar invierte derivar.'),
  co('Vectores', 'Tienen magnitud y dirección; se suman componente a componente.', '¿Qué define a un vector?', 'Magnitud + dirección.'),
  co('Matriz identidad', 'Tiene 1 en la diagonal y 0 fuera; A·I = A.', '¿Qué propiedad cumple I?', 'Neutro del producto.'),
  co('Probabilidad básica', 'Casos favorables entre casos totales, valor entre 0 y 1.', '¿Cómo se calcula una probabilidad simple?', 'Favorables / totales.'),
];

const BIO: CardSeed[] = [
  ar('Unidad de la vida', '¿Cuál es la unidad estructural y funcional de los seres vivos?', 'La célula'),
  ar('Material genético', '¿Qué molécula almacena la información genética?', 'El ADN'),
  ar('Fotosíntesis', '¿Qué produce a partir de CO₂, agua y luz?', 'Glucosa y oxígeno'),
  ar('Mitocondria', '¿Cuál es su función principal?', 'Producir ATP (respiración celular)'),
  ar('Cromosomas humanos', '¿Cuántos tiene una célula somática humana?', '46 (23 pares)'),
  ar('Enzimas', '¿Qué función tienen?', 'Catalizar reacciones bioquímicas'),
  ar('Cadena trófica', '¿Qué organismos la inician?', 'Los productores (autótrofos)'),
  ar('Membrana plasmática', '¿Qué regula la entrada y salida de sustancias?', 'La membrana plasmática'),
  ar('ARN mensajero', '¿Qué papel cumple el ARNm?', 'Llevar la información del ADN al ribosoma'),
  co('Mitosis', 'División celular que da dos células hijas con el mismo número de cromosomas.', '¿Qué genera la mitosis?', '2 células idénticas.'),
  co('Selección natural', 'Los mejor adaptados sobreviven y se reproducen más.', '¿En qué consiste?', 'Sobrevive el mejor adaptado.'),
  co('Homeostasis', 'Mantener condiciones internas estables pese a cambios externos.', '¿Qué es la homeostasis?', 'Equilibrio interno.'),
  co('Respiración celular', 'Degrada glucosa para obtener ATP usando oxígeno y liberando CO₂.', '¿Qué obtiene?', 'Energía (ATP) de glucosa.'),
  co('Ecosistema', 'Seres vivos y su medio físico que intercambian materia y energía.', '¿Qué lo integra?', 'Biocenosis + biotopo.'),
  co('Proteínas', 'Macromoléculas de aminoácidos con función estructural, enzimática y de transporte.', '¿De qué están hechas?', 'Cadenas de aminoácidos.'),
];

const SOFT: CardSeed[] = [
  ar('Variable', '¿Qué es una variable?', 'Espacio con nombre que guarda un valor que puede cambiar'),
  ar('Complejidad O(1)', '¿Qué significa O(1)?', 'Tiempo constante, independiente de la entrada'),
  ar('HTTP 404', '¿Qué indica el código 404?', 'Recurso no encontrado'),
  ar('Llave primaria', '¿Qué es una primary key?', 'Campo que identifica de forma única cada fila'),
  ar('git commit', '¿Qué hace git commit?', 'Registra los cambios preparados en el historial'),
  ar('Función pura', '¿Qué la caracteriza?', 'Mismo input → mismo output, sin efectos secundarios'),
  ar('API REST', '¿Sobre qué protocolo opera?', 'HTTP'),
  ar('Manejo de excepciones', '¿Para qué sirve try/catch?', 'Controlar errores en ejecución sin detener el programa'),
  ar('Búsqueda binaria', '¿Cuál es su complejidad?', 'O(log n)'),
  co('Programación orientada a objetos', 'Organiza el código en objetos con estado y comportamiento.', '¿Qué organiza la POO?', 'Objetos = datos + métodos.'),
  co('Control de versiones', 'Registra cambios del código en el tiempo y permite revertir y colaborar.', '¿Para qué sirve?', 'Historial + colaboración.'),
  co('Normalización de BD', 'Organiza tablas para reducir redundancia y mejorar integridad.', '¿Qué busca?', 'Menos redundancia.'),
  co('Recursividad', 'Una función se llama a sí misma; necesita un caso base.', '¿Qué necesita para terminar?', 'Un caso base.'),
  co('Pruebas unitarias', 'Verifican unidades pequeñas de código de forma aislada.', '¿Qué validan?', 'Unidades aisladas.'),
  co('Pila (stack)', 'Estructura LIFO: último en entrar, primero en salir.', '¿Qué orden sigue?', 'LIFO.'),
];

const DECKS = [
  { title: 'Matemáticas', body: 'Cálculo, álgebra y probabilidad — fundamentos.', cards: MATES },
  { title: 'Biología', body: 'Célula, genética y ecología — conceptos clave.', cards: BIO },
  { title: 'Desarrollo de Software', body: 'Programación, algoritmos y bases de datos.', cards: SOFT },
];

const EVALS: Evaluation[] = ['dificil', 'masomenos', 'bien', 'facil'];
// Interval (minutes) by evaluation — feeds the retention chart sensibly.
const INTERVAL_MIN: Record<Evaluation, number> = {
  dificil: 60,
  masomenos: 1440,
  bien: 4320,
  facil: 8640,
};

async function main() {
  console.log('🌱 Sembrando usuario demo…');

  const existing = await prisma.user.findUnique({ where: { username: USERNAME } });
  if (existing) {
    console.log('   Usuario demo existente: eliminando para regenerar…');
    await prisma.user.delete({ where: { userId: existing.userId } });
  }

  const user = await prisma.user.create({
    data: {
      username: USERNAME,
      passwordHash: await bcrypt.hash(PASSWORD, 10),
      createdAt: at(90, 9),
    },
  });

  let totalSessions = 0;
  let totalStudyMin = 0;

  for (const deckSeed of DECKS) {
    const deck = await prisma.deck.create({
      data: {
        userId: user.userId,
        title: deckSeed.title,
        body: deckSeed.body,
        createdAt: at(85, 10),
      },
    });

    const cardIds: number[] = [];
    for (const c of deckSeed.cards) {
      const card = await prisma.card.create({
        data: {
          deckId: deck.deckId,
          title: c.title,
          learningMethod:
            c.kind === 'activeRecall'
              ? LearningMethod.activeRecall
              : LearningMethod.cornell,
          ...(c.kind === 'activeRecall'
            ? { activeRecall: { create: { questionTitle: c.q, answer: c.a } } }
            : {
                cornell: {
                  create: {
                    principalNote: c.principal,
                    noteQuestions: c.questions,
                    shortNote: c.short,
                  },
                },
              }),
        },
      });
      cardIds.push(card.cardId);
    }

    // ── Study sessions across the last ~80 days ───────────────
    for (let dayOffset = 80; dayOffset >= 1; dayOffset--) {
      if (!chance(0.42)) continue;

      const progress = (80 - dayOffset) / 80; // 0 early → 1 recent
      const hour = pick([8, 9, 16, 18, 20, 21]);
      const method = chance(0.55)
        ? StudyMethod.spacedRepetition
        : chance(0.55)
          ? StudyMethod.pomodoro
          : StudyMethod.simulatedTest;

      const learningMethod: LearningMethod[] =
        method === StudyMethod.spacedRepetition
          ? [LearningMethod.activeRecall, LearningMethod.cornell]
          : [LearningMethod.activeRecall];

      const startTime = at(dayOffset, hour, between(0, 50));

      if (method === StudyMethod.spacedRepetition) {
        const minDuration = between(15, 40);
        const session = await prisma.studySession.create({
          data: {
            userId: user.userId,
            deckId: deck.deckId,
            startTime,
            endTime: new Date(startTime.getTime() + minDuration * 60000),
            minDuration,
            learningMethod,
            studyMethod: method,
            activeRecall: { create: { numCardsSpaced: between(6, 12) } },
          },
        });

        const reviewed = [...cardIds]
          .sort(() => rnd() - 0.5)
          .slice(0, between(6, 10));
        for (const cardId of reviewed) {
          // Better grades become more likely as the user progresses.
          const roll = rnd() + progress * 0.45;
          const evaluation: Evaluation =
            roll > 1.05 ? 'facil' : roll > 0.75 ? 'bien' : roll > 0.45 ? 'masomenos' : 'dificil';
          const interval = INTERVAL_MIN[evaluation];
          const reviewedAt = new Date(
            startTime.getTime() + between(0, minDuration) * 60000,
          );
          await prisma.cardReview.create({
            data: {
              sessionId: session.sessionId,
              cardId,
              userId: user.userId,
              evaluation,
              reviewedAt,
              nextReviewAt: new Date(reviewedAt.getTime() + interval * 60000),
              intervalMinutes: interval,
              timeSpent: between(4, 28),
            },
          });
        }
        totalSessions++;
        totalStudyMin += minDuration;
      } else if (method === StudyMethod.pomodoro) {
        const cycles = between(2, 4);
        const studyMin = cycles * 25;
        const session = await prisma.studySession.create({
          data: {
            userId: user.userId,
            deckId: deck.deckId,
            startTime,
            endTime: new Date(startTime.getTime() + (studyMin + cycles * 5) * 60000),
            minDuration: studyMin,
            learningMethod,
            studyMethod: method,
            pomodoro: {
              create: {
                numCards: between(8, 16),
                studyMinutes: 25,
                restMinutes: 5,
                currentCycle: cycles,
                totalStudyTimeMin: studyMin,
                totalBreakTimeMin: cycles * 5,
              },
            },
          },
        });
        void session;
        totalSessions++;
        totalStudyMin += studyMin;
      } else {
        const numQuestions = between(8, 12);
        const accuracy = 0.45 + progress * 0.45; // improves over time
        const correct = Math.round(numQuestions * accuracy);
        const testMin = between(10, 20);
        const session = await prisma.studySession.create({
          data: {
            userId: user.userId,
            deckId: deck.deckId,
            startTime,
            endTime: new Date(startTime.getTime() + testMin * 60000),
            minDuration: testMin,
            learningMethod,
            studyMethod: method,
            simulatedTest: {
              create: {
                numQuestions,
                testDurationMin: testMin,
                correctAnswers: correct,
                incorrectAnswers: numQuestions - correct,
              },
            },
            sessionResult: {
              create: {
                score: Math.round((correct / numQuestions) * 100),
                testDate: startTime,
              },
            },
          },
        });

        const qCards = [...cardIds].sort(() => rnd() - 0.5).slice(0, numQuestions);
        for (let i = 0; i < qCards.length; i++) {
          const isCorrect = i < correct;
          const others = cardIds.filter((c) => c !== qCards[i]);
          await prisma.testQuestion.create({
            data: {
              testId: session.sessionId,
              cardId: qCards[i],
              userAnswer: isCorrect ? qCards[i] : pick(others),
              isCorrect,
              optionsOrder: [0, 1, 2],
              timeSpent: between(8, 40),
            },
          });
        }
        totalSessions++;
        totalStudyMin += testMin;
      }
    }

    // ── Exams tied to this deck (improving scores) ────────────
    const examPlan = [
      { daysAgo: 72, score: 58 },
      { daysAgo: 50, score: 69 },
      { daysAgo: 29, score: 80 },
      { daysAgo: 8, score: 90 },
    ];
    for (const e of examPlan) {
      await prisma.exam.create({
        data: {
          userId: user.userId,
          deckId: deck.deckId,
          subject: deckSeed.title,
          examDate: at(e.daysAgo, 12),
          examScore: e.score,
          maxScore: 100,
          note: e.score >= 80 ? 'Buen resultado' : 'A reforzar',
          createdAt: at(e.daysAgo, 18),
        },
      });
    }

    // ── Final memory state per card (some due today) ──────────
    for (let i = 0; i < cardIds.length; i++) {
      const cardId = cardIds[i];
      const due = i % 3 === 0; // ~1/3 of cards are due now
      const level = due ? between(1, 3) : between(2, 6);
      const lastReviewedAt = at(due ? between(8, 20) : between(1, 4), 19);
      const intervalMinutes = [0, 1440, 2880, 5760, 10080, 30240, 43200][
        Math.min(level, 6)
      ];
      await prisma.cardMemoryState.create({
        data: {
          userId: user.userId,
          cardId,
          level,
          repsInLearning: level === 0 ? between(0, 2) : 0,
          facilPending: false,
          lastReviewedAt,
          nextReviewAt: due
            ? at(between(0, 2), 8) // today or earlier → shows in "para repasar hoy"
            : at(-1 * between(1, 6), 9), // future
          intervalMinutes,
        },
      });
    }

    console.log(`   ✓ ${deckSeed.title}: 15 cartas + sesiones + exámenes`);
  }

  await prisma.userStats.create({
    data: {
      userId: user.userId,
      totalSessions,
      totalStudyMin,
      mostUsedLearningM: LearningMethod.activeRecall,
      mostUsedStudyM: StudyMethod.spacedRepetition,
    },
  });

  console.log(
    `✅ Listo. Usuario: ${USERNAME} / ${PASSWORD} — ${totalSessions} sesiones, ${totalStudyMin} min, 12 exámenes, 45 cartas.`,
  );
}

main()
  .catch((e) => {
    console.error('❌ Error sembrando datos:', e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
