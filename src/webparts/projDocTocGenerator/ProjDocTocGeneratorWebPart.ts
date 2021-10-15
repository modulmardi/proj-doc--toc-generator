import { Version } from '@microsoft/sp-core-library';
import {
	IPropertyPaneConfiguration,
	PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import * as strings from 'ProjDocTocGeneratorWebPartStrings';
import * as React from 'react';
import * as ReactDom from 'react-dom';
import { IProjDocTocGeneratorAppProps } from './components/props/IProjDocTocGeneratorAppProps';
import ProjDocTocGeneratorApp from './components/ProjDocTocGeneratorApp';

export interface IProjDocTocGeneratorWebPartProps {
	tocFolder: string;
	docxFolder: string;
}

export default class ProjDocTocGeneratorWebPart extends BaseClientSideWebPart<IProjDocTocGeneratorWebPartProps> {

	public render(): void {
		// let client: MSGraphClient
		// this.context.msGraphClientFactory
		// .getClient()
		// .then((_client: MSGraphClient): void => {
		//   client = _client 
		// })
		const element: React.ReactElement<IProjDocTocGeneratorAppProps> = React.createElement(

			ProjDocTocGeneratorApp,
			{
				context: this.context,
				tocFolder: this.properties.tocFolder,
				docxFolder: this.properties.docxFolder,
				//description: this.properties.description
			}
		);

		ReactDom.render(element, this.domElement);
	}

	protected onDispose(): void {
		ReactDom.unmountComponentAtNode(this.domElement);
	}

	protected get dataVersion(): Version {
		return Version.parse('1.0');
	}

	protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
		return {
			pages: [
				{
					header: {
						description: strings.PropertyPaneDescription
					},
					groups: [
						{
							groupName: strings.BasicGroupName,
							groupFields: [
								PropertyPaneTextField('tocFolder', {
									label: strings.tocFolderFieldLabel
								}),
								PropertyPaneTextField('docxFolder', {
									label: strings.docxFolderFieldLabel
								}),
							]
						}
					]
				}
			]
		};
	}
}
