import { WebPartContext } from "@microsoft/sp-webpart-base";
import expressions from "angular-expressions";
import Docxtemplater from "docxtemplater";
import merge from "lodash/merge";
import PizZip from "pizzip";
import { Toc } from "../model/ToC";
import { graphFileLoader } from "./fileLoaders";

function angularParser(tag: string) {
  if (tag === ".") {
    return {
      get: (s: any) => {
        return s;
      },
    };
  }
  const expr = expressions.compile(
    tag.replace(/(’|‘)/g, "'").replace(/(“|”)/g, '"')
  );
  return {
    get: (scope: any, context: { scopeList: any; num: any }) => {
      let obj = {};
      const scopeList = context.scopeList;
      const num = context.num;
      for (let i = 0, len = num + 1; i < len; i++) {
        obj = merge(obj, scopeList[i]);
      }
      return expr(scope, obj);
    },
  };
}
const generateDocument = (
  context: WebPartContext,
  currentDriveId: string,
  fileName: string,
  tocFolder: string,
  docxFolder: string,
  toc: Toc,
  jsonTocFileUploader: (
    context: WebPartContext,
    currentDriveId: string,
    fileName: string,
    tocFolder: string,
    toc: Toc,
    setOperationStatus: (message: string) => void
  ) => void,
  docxFileUploader: (
    context: WebPartContext,
    currentDriveId: string,
    fileName: string,
    docxFolder: string,
    file: any,
    setOperationStatus: (message: string) => void
  ) => void,
  setOperationStatus: (message: string) => void
) => {
  graphFileLoader(
    context,
    setOperationStatus,
    `/drives/${currentDriveId}/root:/template/template012.docx:/`,
    (graphError: any, content: any) => {
      console.log(`graphError: ${graphError}`);
      console.log(`content: ${content}`);

      if (graphError) {
        console.error("Ошибка скачивания шаблона");
        setOperationStatus("error");
        throw graphError;
      }
      const zip = new PizZip(content);

      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
        parser: angularParser,
      });
      try {
        // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
        doc.render(toc);
      } catch (renderingError) {
        // The error thrown here contains additional information when logged with JSON.stringify (it contains a properties object containing all suberrors).
        function replaceErrors(errorKey: any, value: { [x: string]: any }) {
          if (value instanceof Error) {
            return Object.getOwnPropertyNames(value).reduce((error, key) => {
              error[key] = value[key];
              setOperationStatus("error");
              return error;
            }, {});
          }
          return value;
        }
        console.log(JSON.stringify({ error: renderingError }, replaceErrors));

        if (
          renderingError.properties &&
          renderingError.properties.errors instanceof Array
        ) {
          const errorMessages = renderingError.properties.errors
            .map((error: { properties: { explanation: any } }) => {
              return error.properties.explanation;
            })
            .join("\n");
          console.log("errorMessages", errorMessages);
          // errorMessages is a humanly readable message looking like this:
          // 'The tag beginning with "foobar" is unopened'
        }
        setOperationStatus("error");
        throw renderingError;
      }
      const out = doc.getZip().generate({
        type: "blob",
        mimeType:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      }); //Output the document using Data-URI
      console.log("docGenerator", out);

      docxFileUploader(
        context,
        currentDriveId,
        docxFolder,
        fileName,
        out,
        setOperationStatus
      );
      jsonTocFileUploader(
        context,
        currentDriveId,
        tocFolder,
        fileName,
        toc,
        setOperationStatus
      );
      setOperationStatus("success");
      console.log(`toc`, out);
    }
  );
  /**
   *  Сохранение титульников
   */
  graphFileLoader(
    context,
    setOperationStatus,
    `/drives/${currentDriveId}/root:/template/template-titul-000.docx:/`,
    (graphError: any, content: any) => {
      console.log(`graphError: ${graphError}`);
      console.log(`content: ${content}`);

      if (graphError) {
        console.error("Ошибка скачивания шаблона");
        setOperationStatus("error");
        throw graphError;
      }
      const zip = new PizZip(content);
      toc.sections.forEach((section) => {
        section.subsections.forEach((subsection) => {
          {
            const doc = new Docxtemplater(zip, {
              paragraphLoop: true,
              linebreaks: true,
              parser: angularParser,
            });
            try {
              // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
              doc.render({
                ...toc,
                sections: undefined,
                ...section,
                subsections: undefined,
                ...subsection,
              });
            } catch (renderingError) {
              // The error thrown here contains additional information when logged with JSON.stringify (it contains a properties object containing all suberrors).
              function replaceErrors(
                errorKey: any,
                value: { [x: string]: any }
              ) {
                if (value instanceof Error) {
                  return Object.getOwnPropertyNames(value).reduce(
                    (error, key) => {
                      error[key] = value[key];
                      setOperationStatus("error");
                      return error;
                    },
                    {}
                  );
                }
                return value;
              }
              console.log(
                JSON.stringify({ error: renderingError }, replaceErrors)
              );

              if (
                renderingError.properties &&
                renderingError.properties.errors instanceof Array
              ) {
                const errorMessages = renderingError.properties.errors
                  .map((error: { properties: { explanation: any } }) => {
                    return error.properties.explanation;
                  })
                  .join("\n");
                console.log("errorMessages", errorMessages);
                // errorMessages is a humanly readable message looking like this:
                // 'The tag beginning with "foobar" is unopened'
              }
              setOperationStatus("error");
              throw renderingError;
            }
            const out = doc.getZip().generate({
              type: "blob",
              mimeType:
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            }); //Output the document using Data-URI
            console.log("docGenerator", out);

            docxFileUploader(
              context,
              currentDriveId,
              docxFolder +
                `/Титульные Листы/${section.section}${
                  subsection.subsectionStamp || section.sectionStamp
                    ? "-" + (subsection.subsectionStamp || section.sectionStamp)
                    : ""
                }`,
              toc.projectCode +
                (subsection.block ? "-" + subsection.block : "") +
                (subsection.subblock ? "." + subsection.subblock : "") +
                (subsection.subsectionStamp || section.sectionStamp
                  ? "-" + (subsection.subsectionStamp || section.sectionStamp)
                  : "") +
                subsection.subsection +
                (subsection.chapter ? "." + subsection.chapter : "") +
                (subsection.book ? "." + subsection.book : ""),
              out,
              setOperationStatus
            );
            setOperationStatus("success");
            console.log(`titul ${subsection.subsectionUuid}`, out);
          }
        });
      });
    }
  );
};

export default generateDocument;
