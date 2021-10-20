import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IProjDocTocGeneratorAppProps {
  tocFolder: string;

  docxFolder: string;

  context: WebPartContext;
}
