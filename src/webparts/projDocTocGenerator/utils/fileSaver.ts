import { WebPartContext } from "@microsoft/sp-webpart-base";
import { MSGraphClient } from '@microsoft/sp-http';
import { Section, Subsection, Toc } from "../model/ToC";

const fileSaver = (context: WebPartContext, fileName: string, file: any, toc: Toc) => {
	toc.sections.forEach(section => {
		if (section.subsections.length == 0) {
			section.subsections.push(new Subsection)
		}
	})
	context.msGraphClientFactory
		.getClient()
		.then((client: MSGraphClient): void => {
			client
				.api(`/me/drive/root:/ToCs/${fileName}.docx:/content`)
				.header('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
				.put(file)
			client
				.api(`/me/drive/root:/jsonToc/${fileName}.toc:/content`)
				.header('Content-Type', 'application/json')
				.put(toc)
		});
}

export default fileSaver