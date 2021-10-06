import { Depths, IComboBoxOption, IconButton, Stack, TextField } from '@fluentui/react';
import { useBoolean } from '@fluentui/react-hooks';
import { Form, Formik, FormikHelpers } from 'formik';
import * as React from 'react';
import { Section, Subsection, Toc } from '../model/ToC';

interface ITocFormProps {
	toc: Toc
}


interface Values {
	_toc: Toc
}

const TocForm: React.FC<ITocFormProps> = (props: ITocFormProps) => {


	// const [toc, setToc] = React.useState<Toc>(props.toc)
	// const [fileNameError, setFileNameError] = React.useState<boolean>()

	// const [multiline, { toggle: toggleMultiline }] = useBoolean(false);
	// const [creatingNewFile, { toggle: toggleCreatingNewFile }] = useBoolean(true);






	// const onNewFileToggleChange = () => {
	//     toggleCreatingNewFile()
	//     creatingNewFile ? setCurrentFileName(existingFiles[0].text) : setCurrentFileName("")
	// }
	// const onNewFileNameChange = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newText: string): void => {
	//     setCurrentFileName(newText)
	//     setFileNameError(false)
	//     if (existingFiles.filter((file) => file.text == newText)?.length != 0) {
	//         setFileNameError(true)
	//     }
	// }
	// const onExistingFileNameChange = (e: React.FormEvent<IComboBox | HTMLOptionElement>, option: IComboBoxOption): void => {
	//     setCurrentFileName(option.text)
	// }
	// const onAddressFieldChange = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newText: string): void => {
	// 	onAddressChange(newText)
	// 	const newMultiline = newText.length > 40;
	// 	if (newMultiline !== multiline) {
	// 		toggleMultiline();
	// 	}
	// }

	// const onProjectCodeChange = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newText: string) => {
	// 	setToc({ ...toc, projectCode: newText })
	// }
	// const onBuildingNameChange = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newText: string) => {
	// 	setToc({ ...toc, buildingName: newText })
	// }
	// const onAddressChange = (newText: string) => {
	// 	setToc({ ...toc, address: newText })
	// }
	// const setSection = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, secId) => {
	// 	let _toc = toc
	// 	_toc.sections[secId].section = e.currentTarget.value
	// 	setToc({ ..._toc })
	// }
	// const setSectionTitle = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, secId) => {
	// 	let _toc = toc
	// 	_toc.sections[secId].sectionTitle = e.currentTarget.value
	// 	setToc({ ..._toc })
	// }
	// const onSubsectionStampChange = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, secId, subsecId) => {
	// 	let _toc = toc
	// 	_toc.sections[secId].subsections[subsecId].stamp = e.currentTarget.value
	// 	setToc({ ..._toc })
	// }
	// const onSubsectionChange = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, secId, subsecId) => {
	// 	let _toc = toc
	// 	_toc.sections[secId].subsections[subsecId].subsection = e.currentTarget.value
	// 	setToc({ ..._toc })
	// }
	// const setSubsectionTitle = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, secId, subsecId) => {
	// 	let _toc = toc
	// 	_toc.sections[secId].subsections[subsecId].subsectionTitle = e.currentTarget.value
	// 	setToc({ ..._toc })
	// }
	// const setChapter = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, secId, subsecId) => {
	// 	let _toc = toc
	// 	_toc.sections[secId].subsections[subsecId].chapter = e.currentTarget.value
	// 	setToc({ ..._toc })
	// }
	// const setChapterTitle = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, secId, subsecId) => {
	// 	let _toc = toc
	// 	_toc.sections[secId].subsections[subsecId].chapterTitle = e.currentTarget.value
	// 	setToc({ ..._toc })
	// }
	// const setBook = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, secId, subsecId) => {
	// 	let _toc = toc
	// 	_toc.sections[secId].subsections[subsecId].book = e.currentTarget.value
	// 	setToc({ ..._toc })
	// }
	// const setBookTitle = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, secId, subsecId) => {
	// 	let _toc = toc
	// 	_toc.sections[secId].subsections[subsecId].bookTitle = e.currentTarget.value
	// 	setToc({ ..._toc })
	// }
	// const setBlock = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, secId, subsecId) => {
	// 	let _toc = toc
	// 	_toc.sections[secId].subsections[subsecId].block = e.currentTarget.value
	// 	setToc({ ..._toc })
	// }
	// const setSubblock = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, secId, subsecId) => {
	// 	let _toc = toc
	// 	_toc.sections[secId].subsections[subsecId].subblock = e.currentTarget.value
	// 	setToc({ ..._toc })
	// }

	// const addSection = () => { setToc({ ...toc, sections: [...toc.sections, new Section()] }) }
	// const removeSection = (secId) => { setToc({ ...toc, sections: [...toc.sections.filter((section, id) => { return id != secId })] }) }

	// const addSubsection = (secId: number) => {
	// 	let _toc = toc
	// 	_toc.sections[secId].subsections = [...toc.sections[secId].subsections, new Subsection()]
	// 	setToc({ ..._toc })
	// }
	// const removeSubsection = (secId: number, subsecId: number) => {
	// 	let _toc = toc
	// 	_toc.sections[secId].subsections = _toc.sections[secId].subsections.filter((subsec, id) => id != subsecId)
	// 	setToc({ ..._toc })
	// }




	return (
		<>
			<Formik
				initialValues={{
					_toc: props.toc,

				}}
				enableReinitialize
				onSubmit={(values: Values, formikHelpers: FormikHelpers<Values>): void | Promise<any> => {
					throw new Error('Function not implemented.');
				}}
			>
				{(props) => <>
					<Form>
						<h2>Данные проекта</h2>
						<Stack tokens={{ childrenGap: '1vh' }}>
							<TextField multiline placeholder="Название объекта" value={props.values._toc.buildingName} />
							<TextField multiline placeholder="Адрес" value={props.values._toc.address} />
							<Stack horizontal>
								<TextField placeholder="Код проекта" value={props.values._toc.projectCode} />
								<TextField placeholder="Стадия проекта" value={props.values._toc.projectStage} />
							</Stack>
							<TextField placeholder="ГИП" value={props.values._toc.gipName} />
							<TextField placeholder="ГАП" value={props.values._toc.gapName} />
							<TextField placeholder="Н. Контр" value={props.values._toc.nContr} />
						</Stack>
						<h2>Секции</h2>
						<IconButton style={{width: '100%'}} iconProps={{ iconName: "add", }} />
						{props.values._toc.sections.map((section, sectionId) =>

							<>
								<Stack horizontal tokens={{ padding: '2vh' }} style={{ boxShadow: Depths.depth8, display: 'flow', alignItems: 'center', justifyContent: 'center' }}>
									<IconButton style={{position:'absolute', left:'0.2vh'}} iconProps={{ iconName: "add", }} />
									<IconButton iconProps={{ iconName: "cancel", }} />
									<TextField name={`_toc.sections[${sectionId}].section`} style={{ width: '5vh' }} placeholder="#" value={section.section} onChange={props.handleChange} />
									<TextField name={`_toc.sections[${sectionId}].sectionTitle`} placeholder="Наименование раздела" value={section.sectionTitle} onChange={props.handleChange} />
									<TextField name={`_toc.sections[${sectionId}].stamp`} placeholder="Шифр раздела" value={section.stamp} onChange={props.handleChange} />
								</Stack>
							</>

						)}
					</Form>
				</>
				}
			</Formik>
		</>
	)
};

export default TocForm;
