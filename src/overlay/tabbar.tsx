import React, { useEffect } from "react";
import styled from 'styled-components'
import cn from 'classnames';
import { MDCTabBar } from '@material/tab-bar';
import { useLocation, useNavigate } from "react-router-dom";


const WrapperDivS = styled.div`
  pointer-events: auto;
  background: #101010b0;
  color: white;
  width: 100%;
  height: auto;
  position: relative;
  user-select: none;
`

export function Tabbar() {
  const ref = React.useRef(null);
  let location = useLocation();
  let navigate = useNavigate();

  React.useEffect(() => {
    const tabBar = new MDCTabBar(ref.current);
  });

  const Tab = (props: { title: string, link: string, idx: number }) => {
    const isActive = location.pathname == props.link;
    return (<>
      <button className={cn("mdc-tab", "mdc-tab--min-width", {"mdc-tab--active": isActive})} role="tab" aria-selected="true"
          tabIndex={props.idx} onClick={() => navigate(props.link)}>
        <span className="mdc-tab__content">
          <span className="mdc-tab__text-label">{props.title}</span>
        </span>
        <span className={cn("mdc-tab-indicator", {"mdc-tab-indicator--active": isActive})}>
          <span className="mdc-tab-indicator__content mdc-tab-indicator__content--underline"></span>
        </span>
        <span className="mdc-tab__ripple"></span>
        <div className="mdc-tab__focus-ring"></div>
      </button>
    </>);
  };

  return (
    <WrapperDivS>
      <div ref={ref} className="mdc-tab-bar" role="tablist">
        <div className="mdc-tab-scroller">
          <div className="mdc-tab-scroller__scroll-area">
            <div className="mdc-tab-scroller__scroll-content">
              <Tab title="Env" link="/" idx={0}/>
              <Tab title="CNN" link="/cnn" idx={1}/>
            </div>
          </div>
        </div>
      </div>
    </WrapperDivS>
  );
}
