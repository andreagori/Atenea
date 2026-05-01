import { SectionHeader } from "./SectionHeader";

/**
 * Section 01 — Three card formats (Repaso Activo, Cornell, Visual)
 * laid out as a bento with a large gradient panel + two stacked panels.
 */
export const SectionMethods = () => (
  <section
    id="metodos"
    className="max-w-[1340px] mx-auto px-10 py-[100px] border-t border-v2-line"
  >
    <SectionHeader
      eyebrow="01 · MÉTODOS DE ESTUDIO"
      title={
        <>
          Tres formas de estudiar. <em>Una</em> sola plataforma.
        </>
      }
      lede="Cada concepto pide su forma. Atenea te deja crear los tres tipos dentro del mismo mazo, así estudias como mejor te conviene."
    />

    <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-5">
      {/* Big card: Repaso Activo */}
      <div
        className="p-[30px] rounded-[22px] text-white flex flex-col min-h-[360px] lg:min-h-[740px] border-0"
        style={{
          background:
            "linear-gradient(160deg, var(--color-v2-primary), var(--color-v2-primary-deep))",
        }}
      >
        <div>
          <div className="font-v2-mono text-[11px] tracking-[1.5px] text-white/70 mb-3">
            01 · REPASO ACTIVO
          </div>
          <h3 className="font-v2-serif italic font-normal text-[38px] leading-[1.1] tracking-[-0.5px] m-0 mb-2.5">
            Pregunta al frente, respuesta al reverso.
          </h3>
          <p className="m-0 text-[15px] text-white/85 leading-[1.55]">
            El método clásico, refinado. Perfecto para definiciones, fórmulas y
            vocabulario. Toca para voltear, marca si recordaste, y la cola de
            repaso aprende contigo.
          </p>
        </div>

        {/* Card preview */}
        <div className="mt-8 bg-white/10 border border-white/25 rounded-2xl p-[26px] backdrop-blur-md">
          <div className="text-[10px] text-white/70 font-v2-mono tracking-[1.5px] mb-3.5">
            CARTA 4 / 12
          </div>
          <div className="text-[28px] font-medium leading-[1.2] min-h-[110px]">
            ¿Cuál es la derivada de sin(x)?
          </div>
          <div className="flex justify-between items-center mt-6">
            <div className="text-[11px] text-white/70 font-v2-mono tracking-[1px]">
              ↻ TOCA PARA VOLTEAR
            </div>
            <div className="flex gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
              <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
              <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
              <span className="w-[18px] h-1.5 rounded-full bg-white/95" />
              <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
            </div>
          </div>
        </div>
      </div>

      {/* Right column: stacked Cornell + Visual */}
      <div className="flex flex-col gap-5">
        {/* Cornell */}
        <div
          className="p-[30px] rounded-[22px] flex flex-col min-h-[360px]"
          style={{
            background: "var(--color-v2-paper)",
            borderColor: "#E0DCCC",
            borderWidth: "1px",
            borderStyle: "solid",
          }}
        >
          <div className="font-v2-mono text-[11px] tracking-[1.5px] text-v2-ink-3 mb-3">
            02 · CORNELL
          </div>
          <h3 className="text-[28px] font-medium leading-[1.1] tracking-[-0.5px] m-0 mb-2.5">
            Tres zonas, una estructura.
          </h3>
          <p className="m-0 text-[14px] text-v2-ink-2 leading-[1.55]">
            Ideas clave a la izquierda, notas detalladas a la derecha, resumen
            abajo. Para temas complejos que necesitan organizarse antes de
            memorizarse.
          </p>
          {/* Mini Cornell preview */}
          <div className="flex-1 mt-5 bg-white rounded-[12px] p-3 grid grid-rows-[1fr_auto] gap-1.5">
            <div className="grid grid-cols-[1fr_1.4fr] gap-1.5">
              <div className="bg-v2-bg rounded-lg p-2.5">
                <div className="font-v2-mono text-[9px] tracking-[1.5px] text-v2-ink-3 uppercase mb-1">
                  IDEAS
                </div>
                <div className="text-[11px] text-v2-ink-2 leading-[1.4]">
                  • Encapsulamiento
                  <br />• Herencia
                  <br />• Polimorfismo
                </div>
              </div>
              <div className="bg-v2-bg rounded-lg p-2.5">
                <div className="font-v2-mono text-[9px] tracking-[1.5px] text-v2-ink-3 uppercase mb-1">
                  NOTAS
                </div>
                <div className="text-[11px] text-v2-ink-2 leading-[1.4]">
                  El encapsulamiento protege datos exponiendo solo lo necesario.
                </div>
              </div>
            </div>
            <div className="bg-v2-primary-pale rounded-lg px-2.5 py-2">
              <div className="font-v2-mono text-[9px] tracking-[1.5px] text-v2-ink-3 uppercase mb-0.5">
                RESUMEN
              </div>
              <div className="text-[11px] text-v2-ink leading-[1.4]">
                Los 4 pilares de la POO.
              </div>
            </div>
          </div>
        </div>

        {/* Visual */}
        <div
          className="p-[30px] rounded-[22px] flex flex-col min-h-[360px]"
          style={{
            background:
              "linear-gradient(160deg, rgba(166,131,255,0.08), rgba(192,85,231,0.04))",
            borderColor: "rgba(166,131,255,0.2)",
            borderWidth: "1px",
            borderStyle: "solid",
          }}
        >
          <div className="font-v2-mono text-[11px] tracking-[1.5px] text-v2-ink-3 mb-3">
            03 · VISUAL
          </div>
          <h3 className="text-[28px] font-medium leading-[1.1] tracking-[-0.5px] m-0 mb-2.5">
            Una imagen vale 100 cartas.
          </h3>
          <p className="m-0 text-[14px] text-v2-ink-2 leading-[1.55]">
            Imagen al centro, descripción debajo. Para diagramas, fórmulas,
            mapas conceptuales — todo lo que se entiende mejor con los ojos.
          </p>
          <div className="flex-1 mt-5 bg-white rounded-[12px] p-3.5 flex flex-col gap-2 min-h-[100px]">
            <div
              className="flex-1 rounded-lg flex items-center justify-center p-4"
              style={{
                background:
                  "linear-gradient(160deg, var(--color-v2-primary-pale), rgba(166,131,255,0.12))",
              }}
            >
              <div className="font-v2-serif italic text-[36px] text-v2-primary-deep">
                ∫ƒ(x)dx
              </div>
            </div>
            <div className="text-[11px] text-v2-ink-2 text-center">
              Integral indefinida
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);
