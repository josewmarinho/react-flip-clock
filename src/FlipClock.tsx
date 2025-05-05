import styles from './styles.module.css';
import clsx from 'clsx';
import React, { useEffect, useMemo } from 'react';
import FlipClockDigit from './FlipClockDigit';
import { FlipClockProps, FlipClockState, FlipClockUnitTimeFormatted } from './types';
import { buildFormatted, calcTimeDelta, convertToPx, isServer } from './utils';

const defaultRenderMap = [true, true, true, true, true, true]; // 6
const defaultLabels = ['Years', 'Months', 'Days', 'Hours', 'Minutes', 'Seconds'];

export default function FlipClock(props: FlipClockProps) {
  const {
    mode = 'down',
    to,
    from,
    className,
    style,
    children,
    onComplete = () => {},
    onTick = () => {},
    showLabels = true,
    showSeparators = true,
    labels = defaultLabels,
    labelStyle,
    digitBlockStyle,
    separatorStyle,
    dividerStyle,
    duration = 0.7,
    renderMap = defaultRenderMap,
    hideOnComplete = true,
    stopOnHiddenVisibility = false,
    renderOnServer = false,
    spacing,
    ...other
  } = props;

  // Guard rails -----------------------------------------------------------
  if (mode === 'down' && !to) throw Error('FlipClock: prop "to" is required when mode="down"');
  if (mode === 'up' && !from) throw Error('FlipClock: prop "from" is required when mode="up"');

  // -----------------------------------------------------------------------
  const targetDate = (mode === 'down' ? to : from)!; // non‑null after guards

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [state, setState] = React.useState<FlipClockState>(() => constructState());
  const countdownRef = React.useRef(0);

  function clearTimer() {
    window.clearInterval(countdownRef.current);
  }

  function constructState(): FlipClockState {
    const timeDelta = calcTimeDelta(mode, targetDate, Date.now());
    return {
      timeDelta,
      completed: mode === 'down' ? timeDelta.total === 0 : false
    };
  }

  function tick() {
    const newState = constructState();
    setState(newState);
    onTick(newState);
    if (newState.completed) {
      clearTimer();
      onComplete();
    }
  }

  useEffect(() => {
    if (stopOnHiddenVisibility) {
      const handleVisibility = () => {
        if (document.visibilityState === 'visible') {
          tick();
          countdownRef.current = window.setInterval(tick, 1000);
        } else {
          clearTimer();
        }
      };
      handleVisibility();
      document.addEventListener('visibilitychange', handleVisibility);
      return () => {
        clearTimer();
        document.removeEventListener('visibilitychange', handleVisibility);
      };
    }

    clearTimer();
    tick();
    countdownRef.current = window.setInterval(tick, 1000);
    return () => clearTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetDate, stopOnHiddenVisibility, mode]);

  // ----------  CSS custom props  ----------------------------------------
  const containerStyles = useMemo<React.CSSProperties>(() => {
    return {
      '--fcc-flip-duration': `${duration}s`,
      '--fcc-spacing': convertToPx(spacing?.clock),
      '--fcc-digit-block-width': convertToPx(digitBlockStyle?.width),
      '--fcc-digit-block-height': convertToPx(digitBlockStyle?.height),
      '--fcc-digit-block-radius': convertToPx(digitBlockStyle?.borderRadius),
      '--fcc-digit-block-spacing': convertToPx(spacing?.digitBlock),
      '--fcc-shadow': digitBlockStyle?.boxShadow,
      '--fcc-digit-font-size': convertToPx(digitBlockStyle?.fontSize),
      '--fcc-digit-color': digitBlockStyle?.color,
      '--fcc-label-font-size': convertToPx(labelStyle?.fontSize),
      '--fcc-label-color': labelStyle?.color,
      '--fcc-divider-color': dividerStyle?.color,
      '--fcc-divider-height': convertToPx(dividerStyle?.height),
      '--fcc-background': digitBlockStyle?.background || digitBlockStyle?.backgroundColor,
      '--fcc-separator-size': convertToPx(separatorStyle?.size),
      '--fcc-separator-color': showSeparators ? separatorStyle?.color : 'transparent',
      ...style
    } as React.CSSProperties;
  }, [style, digitBlockStyle, labelStyle, duration, dividerStyle, separatorStyle, showSeparators, spacing]);

  // remove visual‑only props from inner style
  const _digitBlockStyle = React.useMemo(() => {
    if (!digitBlockStyle) return undefined;
    const { ...rest } = digitBlockStyle;
    return rest;
  }, [digitBlockStyle]);

  // ----------  build sections array  ------------------------------------
  const sections = React.useMemo(() => {
    const formatted = buildFormatted(mode, targetDate);

    const _renderMap = (renderMap.length >= 6 ? renderMap.slice(0, 6) : [...renderMap, ...defaultRenderMap]).slice(
      0,
      6
    );

    const _labels = (labels.length >= 6 ? labels.slice(0, 6) : [...labels, ...defaultLabels]).slice(0, 6);

    const times = Object.values(formatted) as FlipClockUnitTimeFormatted[];
    const keys = ['year', 'month', 'day', 'hour', 'minute', 'second'];

    return _renderMap
      .map<[boolean, string, FlipClockUnitTimeFormatted, string]>((show, i) => [show, keys[i], times[i], _labels[i]])
      .filter(([show]) => show);
  }, [renderMap, state, mode, labels]);

  if (state.completed && hideOnComplete) return <React.Fragment>{children}</React.Fragment>;
  if (!renderOnServer && isServer()) return null;

  return (
    <div
      {...other}
      className={clsx('fcc', styles.fcc__container, { [styles.fcc__label_show]: showLabels }, className)}
      style={containerStyles}
      data-testid='fcc-container'
    >
      {sections.map(([, key, item, label], idx) => (
        <React.Fragment key={key}>
          <div className={`fcc__unit_time fcc__unit_time--${key} ${styles.fcc__digit_block_container}`}>
            {showLabels && (
              <div className={`fcc__label fcc__label--${key} ${styles.fcc__digit_block_label}`} style={labelStyle}>
                {label}
              </div>
            )}
            {item.current.map((cItem, cIdx) => (
              <FlipClockDigit
                key={cIdx}
                current={cItem}
                next={item.next[cIdx]}
                style={_digitBlockStyle}
                className={`fcc__digit_block--${key}`}
              />
            ))}
          </div>
          {idx < sections.length - 1 && <div className={`fcc__separator ${styles.fcc__colon}`}></div>}
        </React.Fragment>
      ))}
    </div>
  );
}
