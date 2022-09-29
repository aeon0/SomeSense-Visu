import * as React from 'react'
import { createRoot } from 'react-dom/client'
import styled from 'styled-components'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import { HashRouter, Routes, Route } from 'react-router-dom';
import {Outlet} from 'react-router-dom';
// Communication
import { Ecal } from './com/ecal'
import { ICom } from './com/icom'
// Global Overlays
import { Overlay } from './overlay'
// Tab Pages
import { Default } from './tabs/default';
import { Example } from './tabs/example';


const MainWrapper = styled.div`
  all: inherit;
`

function App() {
  const [com, setCom] = React.useState<ICom>();

  React.useEffect(() => {
    setCom(new Ecal());
  }, []);

  const Layout = () => (<>
    <Overlay client={com}/>
    <Outlet/>
  </>);

  return <MainWrapper>
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Default client={com} />} />
          <Route path="example" element={<Example />} />
        </Route>
      </Routes>
    </HashRouter>
  </MainWrapper>
}

const root = createRoot(
  document.getElementById('app') as HTMLElement
);
root.render(
  <Provider store={store}> 
    <App />
  </Provider>,
)
