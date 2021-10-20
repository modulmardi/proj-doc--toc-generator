import * as React from "react";
import ProjDocTocGenerator from "./ProjDocTocGenerator";
import { MSGraphClient } from "@microsoft/sp-http";
import { IProjDocTocGeneratorAppProps } from "./props/IProjDocTocGeneratorAppProps";

const ProjDocTocGeneratorApp: React.FC<IProjDocTocGeneratorAppProps> = (
  props
) => {
  const [currentDriveId, setCurrentDriveId] = React.useState<string>("");
  props.context.msGraphClientFactory.getClient().then((client: MSGraphClient) =>
    client
      .api(
        "https://graph.microsoft.com/v1.0/sites/root" +
          (props.context.pageContext.site.serverRelativeUrl !== "/"
            ? ":" + props.context.pageContext.site.serverRelativeUrl + ":/"
            : "/") +
          "drive"
      )
      .get()
      .then((data: { id: string }) => setCurrentDriveId(data.id))
  );

  return (
    <>
      <ProjDocTocGenerator
        context={props.context}
        currentDriveId={currentDriveId}
        tocFolder={props.tocFolder}
        docxFolder={props.docxFolder}
      ></ProjDocTocGenerator>
    </>
  );
};

export default ProjDocTocGeneratorApp;
