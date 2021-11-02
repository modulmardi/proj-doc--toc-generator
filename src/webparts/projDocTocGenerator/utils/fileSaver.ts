import { MSGraphClient } from "@microsoft/sp-http";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { Subsection } from "../model/ToC";

export const jsonTocFileUploader = (
  context: WebPartContext,
  currentDriveId: string,
  tocFolder: string,
  fileName: string,
  json: any,
  setOperationStatus: (message: string) => void
) => {
  json.sections.forEach((section) => {
    if (section.subsections.length == 0) {
      section.subsections.push(new Subsection());
    }
  });
  context.msGraphClientFactory.getClient().then((client: MSGraphClient) => {
    client
      .api(`/drives/${currentDriveId}/root/children`)
      .header("Content-Type", "application/json")
      .put(
        {
          name: tocFolder,
          folder: {},
        },
        () => {
          client
            .api(
              `/drives/${currentDriveId}/root:/${tocFolder}/${fileName}.toc:/content`
            )
            .header("Content-Type", "application/json")
            .put(json)
            .catch(() => setOperationStatus("error"));
        }
      );
  });
};
export const docxFileUploader = (
  context: WebPartContext,
  currentDriveId: string,
  docxFolder: string,
  fileName: string,
  file: any,
  setOperationStatus: (message: string) => void
) => {
  context.msGraphClientFactory.getClient().then((client: MSGraphClient) => {
    client
      .api(`/drives/${currentDriveId}/root/children`)
      .header("Content-Type", "application/json")
      .put(
        {
          name: docxFolder,
          folder: {},
        },
        () => {
          client
            .api(
              `/drives/${currentDriveId}/root:/${docxFolder}/${fileName}.docx:/content`
            )
            .header(
              "Content-Type",
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            )
            .put(file)
            .catch(() => setOperationStatus("error"));
        }
      );
  });
};
