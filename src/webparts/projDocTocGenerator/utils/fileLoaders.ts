import { WebPartContext } from "@microsoft/sp-webpart-base";
import PizZipUtils from 'pizzip/utils/index.js';

export function graphFileLoader(context: WebPartContext, query: string, callback) {
    context.msGraphClientFactory.getClient()
        .then(client => client
            .api(query + '?select=id,@microsoft.graph.downloadUrl').get((error, jsonResponse: {
                "@odata.context": URL,
                "@microsoft.graph.downloadUrl": URL,
                "id": string
            }) => {
                console.log(jsonResponse["@microsoft.graph.downloadUrl"].toString());
                pizZipfileLoader(jsonResponse["@microsoft.graph.downloadUrl"].toString(), callback)
            }))
}

export function pizZipfileLoader(url: string, callback) {
    PizZipUtils.getBinaryContent(url, callback);
}

