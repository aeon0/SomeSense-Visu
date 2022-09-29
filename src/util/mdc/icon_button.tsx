import * as React from 'react'
import cn from 'classnames';
import {MDCRipple} from '@material/ripple';


export function IconButton(props: {
  icon: string,
  onClick: Function,
  disabled?: boolean,
  className?: string
}) {
  const ref = React.useRef(null);

  React.useEffect(() => {
    const mdcRipple = new MDCRipple(ref.current);
    mdcRipple.unbounded = true;
  }, []);

  return <button ref={ref} className={cn("mdc-icon-button", props.className)} onClick={() => props.onClick()} disabled={props.disabled ? true : false }>
    <div className="mdc-icon-button__ripple"></div>
    <span className="mdc-icon-button__focus-ring"></span>
    <i className="material-icons">{props.icon}</i>
  </button>;
}
