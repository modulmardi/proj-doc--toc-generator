import { WebPartContext } from '@microsoft/sp-webpart-base';
import expressions from 'angular-expressions';
import Docxtemplater from 'docxtemplater';
import merge from 'lodash/merge';
import PizZip from 'pizzip';
import { Toc } from '../model/ToC';
import { graphFileLoader } from './fileLoaders';



function angularParser(tag: string) {
	if (tag === '.') {
		return {
			get: function (s: any) { return s; }
		};
	}
	const expr = expressions.compile(
		tag.replace(/(’|‘)/g, "'").replace(/(“|”)/g, '"')
	);
	return {
		get: function (scope: any, context: { scopeList: any; num: any; }) {
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
const generateDocument = (toc: Toc, fileSaver: (context: WebPartContext, fileName: string, tocFolder: string, docxFolder: string, file: any, toc: Toc) => void
	, fileName: string, tocFolder: string, docxFolder: string, context: WebPartContext) => {
	graphFileLoader(context, '/sites/root/drive/root:/${docxFolder}/${fileName}.docx:/content', function (
		error: any,
		content: any
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
			console.log(toc);

			// render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
			doc.render(toc);
		} catch (error) {
			// The error thrown here contains additional information when logged with JSON.stringify (it contains a properties object containing all suberrors).
			function replaceErrors(key: any, value: { [x: string]: any; }) {
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
					.map(function (error: { properties: { explanation: any; }; }) {
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

		fileSaver(context, fileName, tocFolder, docxFolder, out, toc)
		console.log(out);

	});
};

export default generateDocument