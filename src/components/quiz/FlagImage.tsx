import * as Flags3x2 from 'country-flag-icons/react/3x2';
// Solo queste 3 bandiere hanno bisogno dell'asset "1x1": import nominale
// (non `import *`) così il bundler può escludere le altre 262 varianti
// quadrate inutilizzate dal pacchetto.
import { CH as CH1x1, VA as VA1x1, NP as NP1x1 } from 'country-flag-icons/react/1x1';
import type { ComponentType, CSSProperties, SVGProps } from 'react';
import { useTranslation } from '../../i18n/useTranslation';

interface FlagImageProps {
  code: string;
  name: string;
  className?: string;
}

type FlagSvgComponent = ComponentType<SVGProps<SVGSVGElement>>;

// Bandiere realmente quadrate: l'asset "3x2" del pacchetto le disegna stirate
// in un rettangolo, mentre la variante "1x1" è un ritaglio centrato che ne
// restituisce la proporzione reale, senza deformazioni.
const SQUARE_ASSETS: Record<string, FlagSvgComponent> = {
  CH: CH1x1 as FlagSvgComponent,
  VA: VA1x1 as FlagSvgComponent,
};
const NEPAL_COMPONENT = NP1x1 as FlagSvgComponent;

// Il Nepal è l'unica bandiera nazionale al mondo non rettangolare (doppio
// pennone). L'asset del pacchetto la disegna comunque su una tela quadrata a
// sfondo bianco: un clip-path ne ritaglia il contorno reale (stessi vertici
// del bordo blu nel tracciato SVG sorgente), lasciando trasparente il resto
// così da mostrare la sagoma autentica invece di un rettangolo.
const NEPAL_CODE = 'NP';
const NEPAL_CLIP_PATH = 'polygon(0% 0%, 82.2% 51.2%, 25.7% 51.2%, 79.5% 100%, 0% 100%)';

export function FlagImage({ code, name, className = '' }: FlagImageProps) {
  const { t } = useTranslation();
  const label = t('quizPlay.flagAlt', { name });
  const isSquareAsset = code in SQUARE_ASSETS || code === NEPAL_CODE;
  const FlagComponent: FlagSvgComponent | undefined =
    code === NEPAL_CODE
      ? NEPAL_COMPONENT
      : (SQUARE_ASSETS[code] ?? (Flags3x2 as Record<string, FlagSvgComponent>)[code]);

  if (!FlagComponent) {
    return (
      <div
        role="img"
        aria-label={label}
        className={`flex items-center justify-center bg-slate-200 text-2xl dark:bg-slate-700 ${className}`}
      >
        🏳️
      </div>
    );
  }

  // Il wrapper eredita la classe del chiamante (dimensioni/proporzione della
  // "cornice", arrotondamento, ombra): resta l'unico punto che decide quanto
  // spazio occupa una bandiera nella pagina. La bandiera vera e propria si
  // adatta dentro quello spazio mantenendo il proprio rapporto d'aspetto
  // reale, senza mai essere ritagliata o deformata.
  const svgStyle: CSSProperties = {
    aspectRatio: isSquareAsset ? '1 / 1' : '3 / 2',
    maxHeight: '100%',
    maxWidth: '100%',
    width: 'auto',
    height: 'auto',
    ...(code === NEPAL_CODE ? { clipPath: NEPAL_CLIP_PATH } : null),
  };

  return (
    <span role="img" aria-label={label} className={`flex items-center justify-center ${className}`}>
      <FlagComponent aria-hidden="true" style={svgStyle} />
    </span>
  );
}
