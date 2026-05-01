import { SectionHeader } from "./SectionHeader";

/**
 * Section 03 — Session modes (Pomodoro + Prueba Simulada).
 * Two large cards with mock UI for each mode.
 */
export const SectionModes = () => (
  <section
    id="modos"
    className="max-w-[1340px] mx-auto px-10 py-[100px] border-t border-v2-line"
  >
    <SectionHeader
      eyebrow="03 · MODOS DE SESIÓN"
      title={
        <>
          Cuatro modos. <em>Tu</em> ritmo de hoy.
        </>
      }
      lede="Repaso libre, Pomodoro, Prueba simulada o sesión rápida. Elige según el día."
    />

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* Pomodoro card */}
      <div
        className="rounded-[22px] p-9 min-h-[420px] flex flex-col justify-between"
        style={{
          background:
            "linear-gradient(160deg, rgba(166,131,255,0.10), rgba(166,131,255,0.04))",
          border: "1px solid rgba(166,131,255,0.22)",
        }}
      >
        <div>
          <div className="font-v2-mono text-[11px] tracking-[2px] uppercase text-v2-ink-3">
            POMODORO
          </div>
          <h3 className="text-[32px] font-medium m-0 my-3.5 tracking-[-0.5px] leading-[1.1]">
            25 minutos. Sin notificaciones. Sin excusas.
          </h3>
          <p className="text-v2-ink-2 text-[14px] leading-[1.55] m-0">
            Bloques cronometrados con descansos automáticos. Concentración pura.
          </p>
        </div>
        <div className="flex items-center gap-[18px] mt-8">
          <div
            className="w-[110px] h-[110px] rounded-full bg-white flex flex-col items-center justify-center"
            style={{ border: "5px solid var(--color-v2-violet)" }}
          >
            <div className="font-v2-serif italic text-[30px] text-v2-ink leading-none">
              14:32
            </div>
            <div className="font-v2-mono text-[9px] tracking-[2px] uppercase text-v2-ink-3 mt-1">
              RESTAN
            </div>
          </div>
          <div>
            <div className="flex gap-1.5 mb-2">
              <div className="w-2.5 h-2.5 rounded-full bg-v2-violet" />
              <div className="w-2.5 h-2.5 rounded-full bg-v2-violet" />
              <div className="w-2.5 h-2.5 rounded-full bg-v2-line-2" />
              <div className="w-2.5 h-2.5 rounded-full bg-v2-line-2" />
            </div>
            <div className="font-v2-mono text-[10px] tracking-[2px] uppercase text-v2-ink-3">
              SESIÓN 2 / 4
            </div>
          </div>
        </div>
      </div>

      {/* Prueba simulada card */}
      <div
        className="rounded-[22px] p-9 min-h-[420px] flex flex-col justify-between"
        style={{
          background:
            "linear-gradient(160deg, rgba(192,85,231,0.10), rgba(192,85,231,0.04))",
          border: "1px solid rgba(192,85,231,0.22)",
        }}
      >
        <div>
          <div className="font-v2-mono text-[11px] tracking-[2px] uppercase text-v2-ink-3">
            PRUEBA SIMULADA
          </div>
          <h3 className="text-[32px] font-medium m-0 my-3.5 tracking-[-0.5px] leading-[1.1]">
            El examen, antes del examen.
          </h3>
          <p className="text-v2-ink-2 text-[14px] leading-[1.55] m-0">
            Test cronometrado, calificación final, identificación de huecos.
          </p>
        </div>
        <div
          className="bg-white rounded-[14px] px-[22px] py-5 mt-7"
          style={{ boxShadow: "0 8px 24px -12px rgba(27,29,45,0.12)" }}
        >
          <div className="flex justify-between font-v2-mono text-[11px] text-v2-ink-3 tracking-[1px] mb-3.5">
            <span>PREGUNTA 7/20</span>
            <span className="text-v2-magenta">⏱ 12:42</span>
          </div>
          <div className="text-[16px] font-medium text-v2-ink mb-3.5 leading-[1.4]">
            ¿Qué es una antiderivada?
          </div>
          <div className="flex flex-col gap-1.5">
            <div
              className="px-3.5 py-2.5 rounded-[10px] text-[13px] flex items-center gap-2.5"
              style={{
                border: "1.5px solid var(--color-v2-magenta)",
                background: "rgba(192,85,231,0.06)",
              }}
            >
              <span className="w-[22px] h-[22px] rounded-full bg-v2-magenta text-white inline-flex items-center justify-center text-[11px] font-semibold">
                A
              </span>
              F(x) si F'(x) = f(x)
            </div>
            <div className="px-3.5 py-2.5 rounded-[10px] text-[13px] text-v2-ink-2 border border-v2-line">
              <span className="inline-block w-[22px] h-[22px] rounded-full bg-v2-bg text-v2-ink-3 text-center leading-[22px] text-[11px] mr-2.5">
                B
              </span>
              Una integral con límites
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);
