import { MSGraphClient } from "@microsoft/sp-http";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { Subsection, Toc } from "../model/ToC";

const fileSaver = (
  context: WebPartContext,
  tocFolder: string,
  docxFolder: string,
  fileName: string,
  file: any,
  toc: Toc,
  setOperationStatus: (message: string) => void
) => {
  toc.sections.forEach((section) => {
    if (section.subsections.length == 0) {
      section.subsections.push(new Subsection());
    }
  });
  context.msGraphClientFactory
    .getClient()
    .then((client: MSGraphClient): MSGraphClient => {
      client
        .api(`/sites/root/drive/root/children`)
        .header("Content-Type", "application/json")
        .put({
          name: docxFolder,
          folder: {},
        });
      return client;
    })
    .then((client: MSGraphClient): MSGraphClient => {
      client
        .api(`/sites/root/drive/root/children`)
        .header("Content-Type", "application/json")
        .put({
          name: tocFolder,
          folder: {},
        });
      return client;
    })
    .then((client: MSGraphClient): void => {
      client
        .api(`/sites/root/drive/root:/${docxFolder}/${fileName}.docx:/content`)
        .header(
          "Content-Type",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        )
        .put(file)
        .catch(() => setOperationStatus("error"));
      client
        .api(`/sites/root/drive/root:/${tocFolder}/${fileName}.toc:/content`)
        .header("Content-Type", "application/json")
        .put(toc)
        .catch(() => setOperationStatus("error"));
    });
};

export default fileSaver;
