import { ComboBox as Dropdown, Depths, IComboBox, IComboBoxOption, IconButton, Toggle, TooltipHost } from '@fluentui/react';
import { useBoolean } from '@fluentui/react-hooks';
import { Separator } from '@fluentui/react/lib/Separator';
import { createTheme, ITheme } from '@fluentui/react/lib/Styling';
import { TextField } from '@fluentui/react/lib/TextField';
import { MSGraphClient } from '@microsoft/sp-http';
import { Formik, FormikHelpers } from 'formik';
import { CommandBarButton, PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { Stack, StackItem } from 'office-ui-fabric-react/lib/Stack';
import * as React from 'react';
import { Section, Subsection, Toc } from '../model/ToC';
import docGenerator, { loadFile } from '../utils/docGenerator';
import fileSaver from '../utils/fileSaver';
import { IProjDocTocGeneratorProps } from './props/IProjDocTocGeneratorProps';

interface Values {
	projectName: string
	projectCode: string
	projectStage: string
	cpeName: string							//Главный инженер проекта
	gapName: string							//Главный архитектор проекта
	complianceAssessmentName: string		//Нормоконтроль
	projectCompany: string

}

const theme: ITheme = createTheme({
	fonts: {
		medium: {
			fontFamily: 'Monaco, Menlo, Consolas',
			fontSize: '30px',
		},
	},
});

const ProjDocTocGenerator: React.FC<IProjDocTocGeneratorProps> = (props) => {

	const [toc, setToc] = React.useState<Toc>(new Toc())
	const [currentFileName, setCurrentFileName] = React.useState<string>()
	const [existingFiles, setExistingFiles] = React.useState<IComboBoxOption[]>()
	const [fileNameError, setFileNameError] = React.useState<boolean>()

	const [multiline, { toggle: toggleMultiline }] = useBoolean(false);
	const [creatingNewFile, { toggle: toggleCreatingNewFile }] = useBoolean(true);


	const downloadFileContent = () => {
		console.log(currentFileName)
		console.log(existingFiles.find((file) => file.text === currentFileName).key)

		loadFile(existingFiles.find((file) => file.text === currentFileName).key as string,
			function (
				error: any,
				content: ArrayBuffer
			) {
				if (error) { throw error; }
				const decoder = new TextDecoder('utf-8')
				setToc(JSON.parse(decoder.decode(new Int8Array(content))))
			})
	}

	const initExistingFiles: () => void = () =>
		props.context.msGraphClientFactory.getClient()
			.then((client: MSGraphClient): void => {
				client.api("/me/drive/root:/jsonToc:/children")
					.get()
					.then((data) => setExistingFiles([...(data.value as [])
						.map((item: any) => {
							return { key: item['@microsoft.graph.downloadUrl'], text: item.name.replace(/\.[^/.]+$/, "") }
						})]))
			})
	React.useEffect(() => initExistingFiles(), [])

	const onNewFileToggleChange = () => {
		toggleCreatingNewFile()
		creatingNewFile ? setCurrentFileName(existingFiles[0].text) : setCurrentFileName("")
	}
	const onNewFileNameChange = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newText: string): void => {
		setCurrentFileName(newText)
		setFileNameError(false)
		if (existingFiles.filter((file) => file.text == newText)?.length != 0) {
			setFileNameError(true)
		}
	}
	const onExistingFileNameChange = (e: React.FormEvent<IComboBox | HTMLOptionElement>, option: IComboBoxOption): void => {
		setCurrentFileName(option.text)
	}
	const onAddressFieldChange = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newText: string): void => {
		onAddressChange(newText)
		const newMultiline = newText.length > 40;
		if (newMultiline !== multiline) {
			toggleMultiline();
		}
	}

	const onProjectCodeChange = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newText: string) => {
		setToc({ ...toc, projectCode: newText })
	}
	const onBuildingNameChange = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newText: string) => {
		setToc({ ...toc, buildingName: newText })
	}
	const onAddressChange = (newText: string) => {
		setToc({ ...toc, address: newText })
	}
	const setSection = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, secId) => {
		let _toc = toc
		_toc.sections[secId].section = e.currentTarget.value
		setToc({ ..._toc })
	}
	const setSectionTitle = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, secId) => {
		let _toc = toc
		_toc.sections[secId].sectionTitle = e.currentTarget.value
		setToc({ ..._toc })
	}
	const onSubsectionStampChange = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, secId, subsecId) => {
		let _toc = toc
		_toc.sections[secId].subsections[subsecId].stamp = e.currentTarget.value
		setToc({ ..._toc })
	}
	const onSubsectionChange = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, secId, subsecId) => {
		let _toc = toc
		_toc.sections[secId].subsections[subsecId].subsection = e.currentTarget.value
		setToc({ ..._toc })
	}
	const setSubsectionTitle = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, secId, subsecId) => {
		let _toc = toc
		_toc.sections[secId].subsections[subsecId].subsectionTitle = e.currentTarget.value
		setToc({ ..._toc })
	}
	const setChapter = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, secId, subsecId) => {
		let _toc = toc
		_toc.sections[secId].subsections[subsecId].chapter = e.currentTarget.value
		setToc({ ..._toc })
	}
	const setChapterTitle = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, secId, subsecId) => {
		let _toc = toc
		_toc.sections[secId].subsections[subsecId].chapterTitle = e.currentTarget.value
		setToc({ ..._toc })
	}
	const setBook = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, secId, subsecId) => {
		let _toc = toc
		_toc.sections[secId].subsections[subsecId].book = e.currentTarget.value
		setToc({ ..._toc })
	}
	const setBookTitle = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, secId, subsecId) => {
		let _toc = toc
		_toc.sections[secId].subsections[subsecId].bookTitle = e.currentTarget.value
		setToc({ ..._toc })
	}
	const setBlock = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, secId, subsecId) => {
		let _toc = toc
		_toc.sections[secId].subsections[subsecId].block = e.currentTarget.value
		setToc({ ..._toc })
	}
	const setSubblock = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, secId, subsecId) => {
		let _toc = toc
		_toc.sections[secId].subsections[subsecId].subblock = e.currentTarget.value
		setToc({ ..._toc })
	}

	const addSection = () => { setToc({ ...toc, sections: [...toc.sections, new Section()] }) }
	const removeSection = (secId) => { setToc({ ...toc, sections: [...toc.sections.filter((section, id) => { return id != secId })] }) }

	const addSubsection = (secId: number) => {
		let _toc = toc
		_toc.sections[secId].subsections = [...toc.sections[secId].subsections, new Subsection()]
		setToc({ ..._toc })
	}
	const removeSubsection = (secId: number, subsecId: number) => {
		let _toc = toc
		_toc.sections[secId].subsections = _toc.sections[secId].subsections.filter((subsec, id) => id != subsecId)
		setToc({ ..._toc })
	}

	return (
		<>
			<Stack tokens={{ padding: '2vh' }} style={{ boxShadow: Depths.depth8, display: 'flow', alignItems: 'center', justifyContent: 'center' }}>
				<Formik
				initialValues={undefined}
				onSubmit={(values: Values, formikHelpers: FormikHelpers<Values>): void | Promise<any> => {
					throw new Error('Function not implemented.');
				} }>
										
				</Formik>
			</Stack>
		</>
	);
};


export default ProjDocTocGenerator;