import * as React from 'react';
import ProjDocTocGenerator from './ProjDocTocGenerator';
import { IProjDocTocGeneratorAppProps } from './props/IProjDocTocGeneratorAppProps';

const ProjDocTocGeneratorApp: React.FC<IProjDocTocGeneratorAppProps> = (props) => {

  return (
    <>
    <ProjDocTocGenerator context={props.context}></ProjDocTocGenerator>
    </>
  );
};


export default ProjDocTocGeneratorApp;