import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IProjDocTocGeneratorProps {
	//description: string;
	context: WebPartContext
	
	tocFolder: string,

	docxFolder: string,
}
