import { WebPartContext } from "@microsoft/sp-webpart-base";
import PizZipUtils from "pizzip/utils/index.js";

export function graphFileLoader(
  context: WebPartContext,
  setOperationStatus: (operationStatus: string) => void,
  query: string,
  callback
) {
  context.msGraphClientFactory.getClient().then((client) =>
    client.api(query + "?select=id,@microsoft.graph.downloadUrl").get(
      (
        errorResponse,
        jsonResponse: {
          "@odata.context": URL;
          "@microsoft.graph.downloadUrl": URL;
          id: string;
        }
      ) => {
        if (errorResponse) {
          console.error("Ошибка получения метаданных файла: ", errorResponse);
          setOperationStatus("error");
          return errorResponse;
        }
        // console.log(jsonResponse["@microsoft.graph.downloadUrl"].toString());
        pizZipfileLoader(
          jsonResponse["@microsoft.graph.downloadUrl"].toString(),
          callback
        );
      }
    )
  );
}

export function pizZipfileLoader(url: string, callback) {
  PizZipUtils.getBinaryContent(url, callback);
}
