type Props = { onClose: () => void };

// Card de "novedades" para usuarios que YA usaron la app (no re-dispara el onboarding completo).
export function WhatsNew({ onClose }: Props) {
  return (
    <div className="fixed inset-0 z-[68] flex items-center justify-center bg-navy-deep/90 px-4 backdrop-blur">
      <div className="w-full max-w-md animate-slideUp rounded-hero bg-navy-raised p-5 shadow-card ring-1 ring-white/10">
        <div className="mb-3">
          <span className="rounded-pill bg-gold-card px-2.5 py-0.5 text-xs font-bold text-navy">
            🆕 NOVEDADES
          </span>
        </div>
        <h2 className="text-xl font-extrabold text-white">Mejoramos la app</h2>

        <ul className="mt-4 space-y-3 text-sm leading-relaxed text-white/75">
          <li className="flex gap-2.5">
            <span className="text-lg leading-none">👆</span>
            <span>
              <b className="text-white">Tocá dos veces</b> una figu para marcar que{' '}
              <b className="text-white">ya la tenés</b> ✓ (pegada). El swipe sigue igual:{' '}
              <span className="text-ice">← falta</span> · <span className="text-gold">→ repe</span>.
            </span>
          </li>
          <li className="flex gap-2.5">
            <span className="text-lg leading-none">📊</span>
            <span>
              El <b className="text-white">% del álbum</b> ahora cuenta solo las que{' '}
              <b className="text-white">tenés</b>. Lo vas a ver más bajo que antes, pero es tu progreso
              real.
            </span>
          </li>
          <li className="flex gap-2.5">
            <span className="text-lg leading-none">🥤</span>
            <span>
              Agregamos las <b className="text-coke">Coca-Cola</b> (CC1–CC14) y corregimos la numeración
              de las <b className="text-white">FWC</b> (ahora 00–19).
            </span>
          </li>
        </ul>

        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full rounded-pill bg-ice-cta py-3 font-semibold text-white shadow-glow-ice transition active:scale-[0.97]"
        >
          ¡Entendido!
        </button>
      </div>
    </div>
  );
}
