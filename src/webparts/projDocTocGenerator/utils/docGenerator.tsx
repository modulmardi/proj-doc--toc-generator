import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';
import PizZipUtils from 'pizzip/utils/index.js';
import expressions from 'angular-expressions'
import merge from 'lodash/merge'

export function loadFile(url, callback) {
  PizZipUtils.getBinaryContent(url, callback);
}

function angularParser(tag) {
  if (tag === '.') {
    return {
      get: function (s) { return s; }
    };
  }
  const expr = expressions.compile(
    tag.replace(/(’|‘)/g, "'").replace(/(“|”)/g, '"')
  );
  return {
    get: function (scope, context) {
      let obj = {};
      const scopeList = context.scopeList;
      const num = context.num;
      for (let i = 0, len = num + 1; i < len; i++) {
        obj = merge(obj, scopeList[i]);
      }
      return expr(scope, obj);
    }
  };
}
const generateDocument = (jsonData, fileSaver, fileName: string) => {
  loadFile('https://publiccdn.sharepointonline.com/marachdv.sharepoint.com/sites/cdntest/cdnpics/template008.docx', function (
    error,
    content
  ) {
    if (error) {
      throw error;
    }
    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
      parser: angularParser
    })
    try {
      console.log(jsonData);

      // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
      doc.render(jsonData);
    } catch (error) {
      // The error thrown here contains additional information when logged with JSON.stringify (it contains a properties object containing all suberrors).
      function replaceErrors(key, value) {
        if (value instanceof Error) {
          return Object.getOwnPropertyNames(value).reduce(function (
            error,
            key
          ) {
            error[key] = value[key];
            return error;
          },
            {});
        }
        return value;
      }
      console.log(JSON.stringify({ error: error }, replaceErrors));

      if (error.properties && error.properties.errors instanceof Array) {
        const errorMessages = error.properties.errors
          .map(function (error) {
            return error.properties.explanation;
          })
          .join('\n');
        console.log('errorMessages', errorMessages);
        // errorMessages is a humanly readable message looking like this:
        // 'The tag beginning with "foobar" is unopened'
      }
      throw error;
    }
    const out = doc.getZip().generate({
      type: 'blob',
      mimeType:
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    }); //Output the document using Data-URI
    console.log("docGenerator", out);

    fileSaver(out, fileName)
    console.log(out);

  });
};

export default generateDocument