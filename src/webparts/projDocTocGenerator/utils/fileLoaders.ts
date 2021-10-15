import { WebPartContext } from "@microsoft/sp-webpart-base";
import PizZipUtils from 'pizzip/utils/index.js';

export function graphFileLoader(context: WebPartContext, query: string, callback) {
    let url: string;
    context.msGraphClientFactory.getClient()
        .then(client => client
            .api(query).get(file => callback(null, file)))
}

export function pizZipfileLoader(url: string, callback) {
    PizZipUtils.getBinaryContent(url, callback);
}

