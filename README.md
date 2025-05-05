# FlipClock

> ⏰ Um componente React com animação 3D para contagem regressiva (**countdown**) e contagem progressiva (**countup**).

<div align="center">
  <img src="./resources/newflipclock.gif" alt="flip clock demo" width="500" />
</div>

## Instalação

```bash
npm install --save @seupacote/flip-clock
```

ou

```bash
yarn add @seupacote/flip-clock
```

## Uso Básico

```tsx
import FlipClock from '@josewmarinho/flip-clock';
import '@josewmarinho/flip-clock/dist/index.css';

const App = () => (
  <FlipClock
    mode='up'
    from={new Date(2022, 4, 2, 23, 0, 0)}
    labels={['Anos', 'Meses', 'Dias', 'Horas', 'Minutos', 'Segundos']}
    digitBlockStyle={{
      width: 45,
      height: 65,
      fontSize: 32,
      borderRadius: 6,
      backgroundColor: '#ff007f',
      color: '#000000'
    }}
    dividerStyle={{ color: '#c2c2c2', height: 1 }}
    spacing={{ clock: 10, digitBlock: 4 }}
  >
    Tempo encerrado
  </FlipClock>
);
```

## Principais Propriedades

| Propriedade       | Tipo                                      | Descrição                                                        |
| ----------------- | ----------------------------------------- | ---------------------------------------------------------------- |
| `mode`            | `"up"` \| `"down"`                        | Define se a contagem será progressiva ou regressiva.             |
| `from` / `to`     | `Date` \| `string` \| `number`            | Data inicial (`from`) ou final (`to`) da contagem.               |
| `labels`          | `string[]`                                | Rótulos exibidos nos dígitos (ex: `['Dias', 'Horas', ...]`).     |
| `digitBlockStyle` | `React.CSSProperties`                     | Estilo dos blocos de dígitos (largura, altura, cor, fonte, etc). |
| `dividerStyle`    | `{ color?: string; height?: any }`        | Estilo da linha divisória entre os dígitos.                      |
| `spacing`         | `{ clock?: number; digitBlock?: number }` | Espaçamento entre elementos.                                     |
| `duration`        | `number`                                  | Duração da animação do flip (ex: `0.7`).                         |
| `children`        | `ReactNode`                               | Conteúdo a ser renderizado quando a contagem termina.            |

## Estilização via CSS

Você também pode personalizar o estilo globalmente usando variáveis CSS:

```css
.flip-clock {
  --fcc-background: black;
  --fcc-digit-color: white;
  --fcc-label-color: #ccc;
  --fcc-flip-duration: 0.6s;
  --fcc-digit-block-width: 45px;
  --fcc-digit-block-height: 65px;
  --fcc-digit-font-size: 32px;
}
```

## Licença

MIT © [josewmarinho](https://github.com/josewmarinho)
