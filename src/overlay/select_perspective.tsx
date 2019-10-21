import * as React from 'react';
import styled from 'styled-components';
import { Select } from '@rmwc/select';

const SelectS = styled(Select)`
  position: absolute;
  right: 25px;
  top: 25px;
  pointer-events: auto;
  background-color: #aaa !important;
`

export function SelectPerspective() {
  const [perspective, setPerspective] = React.useState("2D Image");

  return <React.Fragment>
    <SelectS
      label="Perspective"
      enhanced
      value={perspective}
      onChange={(evt: React.ChangeEvent<HTMLSelectElement>) => setPerspective(evt.target.value)}
      options={["2D Image", "3D Free", "3D Side", "3D Top", "3D Front"]}
    />
  </React.Fragment>
}
