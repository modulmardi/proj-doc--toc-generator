import * as React from "react";
import ProjDocTocGenerator from "./ProjDocTocGenerator";
import { IProjDocTocGeneratorAppProps } from "./props/IProjDocTocGeneratorAppProps";

const ProjDocTocGeneratorApp: React.FC<IProjDocTocGeneratorAppProps> = (
  props
) => {
  {
    console.log(props.context.pageContext.site);
  }
  return (
    <>
      <ProjDocTocGenerator
        context={props.context}
        tocFolder={props.tocFolder}
        docxFolder={props.docxFolder}
      ></ProjDocTocGenerator>
    </>
  );
};

export default ProjDocTocGeneratorApp;
