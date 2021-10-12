import { Depths, Dropdown, IComboBox, IComboBoxOption, IconButton, PrimaryButton, Stack, TextField, Toggle } from '@fluentui/react';
import { useBoolean } from '@fluentui/react-hooks';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { FieldArray, Form, Formik, FormikHelpers } from 'formik';
import * as React from 'react';
import * as yup from 'yup';
import { Section, Subsection, Toc } from '../model/ToC';
import docGenerator from '../utils/docGenerator';
import fileSaver from '../utils/fileSaver';
import EditSectionModal from './EditSectionModal';
import { stylesAddButtonBig, stylesAddButtonLateral, stylesDeleteButtonLateral, stylesEditButtonLateral } from './styles/stylesButton';

interface ITocFormProps {
	toc: Toc
	setToc: React.Dispatch<React.SetStateAction<Toc>>
	existingFiles: IComboBoxOption[]
	context: WebPartContext
}


interface Values {
	_toc: Toc
}


function fillEmptySectionsWithSubsections(_toc: Toc): Toc {
	_toc.sections = _toc.sections
		.map((section) => section.subsections.length > 0 ? section : { ...section, subsections: [new Subsection] })
	return _toc
}


const TocForm: React.FC<ITocFormProps> = (props: ITocFormProps) => {
	const [isEditSectionModalOpen, { setTrue: showEditSectionModal, setFalse: hideEditSectionModal }] = useBoolean(false);

	const [isNewFile, { toggle: toggleIsNewFile }] = useBoolean(true);
	const [currentFileName, setCurrentFileName] = React.useState<string>('');
	const [fileNameError, setFileNameError] = React.useState('')

	const [currentEditableSection, setCurrentEditableSection] = React.useState<Section>(null);
	const [currentEditableSectionNumber, setCurrentEditableSectionNumber] = React.useState<number>(null);
	const [isSectionEdited, setIsSectionEdited] = React.useState<boolean>(false);
	const replacer = React.useRef<(index: number, value: any) => void>(null)



	const validateCurrentFileName = (newText: string) => {
		setFileNameError('')
		if (isNewFile && props.existingFiles.filter((file) => file.text == newText)?.length != 0) {
			setFileNameError('Это имя занято')
			return
		}
		if (newText.length == 0) {
			setFileNameError('Поле обязательно для заполнения')
		}
	}
	const onNewFileNameChange = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newText: string): void => {
		setCurrentFileName(newText)
		validateCurrentFileName(newText)
	}
	const onExistingFileNameChange = (e: React.FormEvent<IComboBox | HTMLOptionElement | HTMLDivElement>, option: IComboBoxOption): void => {
		setCurrentFileName(option.text)
	}


	const onNewFileToggleChange = () => {
		isNewFile ? setCurrentFileName(props.existingFiles[0].text) : setCurrentFileName('')
		toggleIsNewFile()
	}


	React.useEffect(
		() => {
			if (isSectionEdited) {
				replacer.current(currentEditableSectionNumber, currentEditableSection); setIsSectionEdited(false)
			}
		}
		, [isSectionEdited]
	)

	return (
		<>
			<Formik
				initialValues={{
					_toc: props.toc
				}}
				validationSchema={yup.object().shape({
					_toc: yup.object().shape({
						buildingName: yup.string().required('Поле обязательно для заполнения'),
						address: yup.string().required('Поле обязательно для заполнения'),
						projectCode: yup.string().required('Поле обязательно для заполнения'),
						projectStage: yup.string().required('Поле обязательно для заполнения'),
						gipName: yup.string().required('Поле обязательно для заполнения'),
						gapName: yup.string().required('Поле обязательно для заполнения'),
						nContr: yup.string().required('Поле обязательно для заполнения'),
						sections: yup.array().of(yup.object().shape({
							section: yup.string().matches(/(\d*.)*/, 'Must contain digits and dots'),
							sectionTitle: yup.string(),
							sectionStamp: yup.string(),
							subsections: yup.array().of(yup.object().shape({
								subsection: yup.string().matches(/(\d*.)*/, 'Must contain digits and dots'),
								subsectionTitle: yup.string(),
								subsectionStamp: yup.string(),
								chapter: yup.string().matches(/(\d*.)*/, 'Must contain digits and dots'),
								chapterTitle: yup.string(),
								book: yup.string().matches(/(\d*.)*/, 'Must contain digits and dots'),
								bookTitle: yup.string(),
								block: yup.string().matches(/(\d*.)*/, 'Must contain digits and dots'),
								subblock: yup.string().matches(/(\d*.)*/, 'Must contain digits and dots'),
							}))
						}))
					}),
				})}
				enableReinitialize
				onSubmit={(values: Values, formikHelpers: FormikHelpers<Values>): void | Promise<any> => {
					validateCurrentFileName(currentFileName)
					if (fileNameError === '' && currentFileName !== '') { return docGenerator(fillEmptySectionsWithSubsections(values._toc), fileSaver, currentFileName, props.context) }
				}}
			>
				{(formikProps) => <>
					<Form>
						<h2>Данные проекта</h2>
						<Stack tokens={{ childrenGap: '1vh' }}>
							<TextField placeholder="Название объекта" name={`_toc.buildingName`}
								value={formikProps.values._toc.buildingName}
								errorMessage={(formikProps.touched?._toc?.buildingName) ? formikProps.errors?._toc?.buildingName : ''}

								onBlur={formikProps.handleBlur}
								onChange={formikProps.handleChange}
								multiline autoAdjustHeight resizable={false} borderless underlined />
							<TextField placeholder="Адрес" name={`_toc.address`}
								value={formikProps.values._toc.address}
								errorMessage={(formikProps.touched?._toc?.address) ? formikProps.errors?._toc?.address : ''}


								onBlur={formikProps.handleBlur}
								onChange={formikProps.handleChange}
								multiline autoAdjustHeight resizable={false} borderless underlined />
							<Stack horizontal>
								<TextField placeholder="Код проекта" name={`_toc.projectCode`}
									value={formikProps.values._toc.projectCode}
									errorMessage={(formikProps.touched?._toc?.projectCode) ? formikProps.errors?._toc?.projectCode : ''}

									onBlur={formikProps.handleBlur}
									onChange={formikProps.handleChange}
									styles={{ root: { width: '100%' } }} borderless underlined />
								<TextField placeholder="Стадия проекта" name={`_toc.projectStage`}
									value={formikProps.values._toc.projectStage}
									errorMessage={(formikProps.touched?._toc?.projectStage) ? formikProps.errors?._toc?.projectStage : ''}

									onBlur={formikProps.handleBlur}
									onChange={formikProps.handleChange}
									styles={{ root: { width: '100%' } }} borderless underlined />
							</Stack>
							<TextField placeholder="ГИП" name={`_toc.gipName`}
								value={formikProps.values._toc.gipName}
								errorMessage={(formikProps.touched?._toc?.gipName) ? formikProps.errors?._toc?.gipName : ''}

								onBlur={formikProps.handleBlur}
								onChange={formikProps.handleChange}
								borderless underlined />
							<TextField placeholder="ГАП" name={`_toc.gapName`}
								value={formikProps.values._toc.gapName}
								errorMessage={(formikProps.touched?._toc?.gapName) ? formikProps.errors?._toc?.gapName : ''}

								onBlur={formikProps.handleBlur}
								onChange={formikProps.handleChange}
								borderless underlined />
							<TextField placeholder="Н. Контр" name={`_toc.nContr`}
								value={formikProps.values._toc.nContr}
								errorMessage={(formikProps.touched?._toc?.nContr) ? formikProps.errors?._toc?.nContr : ''}

								onBlur={formikProps.handleBlur}
								onChange={formikProps.handleChange}
								borderless underlined />
						</Stack>

						<h2>Разделы</h2>
						<FieldArray name="_toc.sections"
							render={arrayHelpers =>
								<>
									<EditSectionModal toc={formikProps.values._toc}
										isEditSectionModalOpen={isEditSectionModalOpen}
										hideEditSectionModal={hideEditSectionModal}
										currentEditableSection={currentEditableSection}
										setIsSectionEdited={setIsSectionEdited}
										setCurrentEditableSection={setCurrentEditableSection}
									/>
									{formikProps.values._toc?.sections?.length > 0 &&
										formikProps.values._toc?.sections?.map((section, sectionId, sections) =>
											<>



												< Stack key={`stack_sec_add_top`}
													tokens={{ padding: '0' }}
													style={{ boxShadow: Depths.depth8, display: 'flow', alignItems: 'center', justifyContent: 'center' }}
												>
													{(sectionId == 0) && <IconButton styles={stylesAddButtonBig} iconProps={{ iconName: "add", }}
														onClick={() => arrayHelpers.insert(sectionId, new Section())} />}
												</Stack>
												<div style={{ position: 'relative' }}>
													<Stack key={`stack_sec_input_${sections[sectionId].sectionUuid}`}
														tokens={{ padding: '2vh' }}
														style={{ boxShadow: Depths.depth8, display: 'flow', alignItems: 'center', justifyContent: 'center' }}
													>
														{(sectionId > 0) && <IconButton key={`stack_sec_input_${sections[sectionId].sectionUuid}_add`}
															styles={{ ...stylesAddButtonLateral }} iconProps={{ iconName: "add", }}
															onClick={() => arrayHelpers.insert(sectionId, new Section())} />}
														<IconButton key={`stack_sec_input_${sections[sectionId].sectionUuid}_edit`}
															styles={stylesEditButtonLateral}
															iconProps={{ iconName: "edit", }}
															onClick={() => {
																setCurrentEditableSection(section)
																setCurrentEditableSectionNumber(sectionId)
																replacer.current = arrayHelpers.replace
																if (section.subsections.length == 0) {
																	const _section = section
																	_section.subsections.push(new Subsection)
																	arrayHelpers.replace(sectionId, _section)
																}
																showEditSectionModal()
															}} />
														<IconButton key={`stack_sec_input_${sections[sectionId].sectionUuid}_delete`}
															style={{}}
															styles={stylesDeleteButtonLateral}
															iconProps={{ iconName: "delete", }}
															onClick={() => arrayHelpers.remove(sectionId)} />

														<Stack horizontal styles={{ root: { width: '100%' } }}>
															<TextField placeholder="#" name={`_toc.sections[${sectionId}].section`}
																value={section.section}

																key={`stack_sec_input_${sections[sectionId].sectionUuid}_#`}
																borderless underlined onChange={formikProps.handleChange} />
															<TextField placeholder="Шифр раздела" name={`_toc.sections[${sectionId}].sectionStamp`}
																value={section.sectionStamp}

																key={`stack_sec_input_${sections[sectionId].sectionUuid}_sectionStamp`}
																styles={{ root: { width: '100%' } }} borderless underlined onChange={formikProps.handleChange} />
														</Stack>

														<TextField placeholder="Наименование раздела" key={`stack_sec_input_${sections[sectionId].sectionUuid}_title`}
															name={`_toc.sections[${sectionId}].sectionTitle`}
															value={section.sectionTitle}

															multiline autoAdjustHeight resizable={false}
															styles={{ root: { width: '100%' } }}
															borderless underlined onChange={formikProps.handleChange} />

													</Stack>

												</div>
											</>
										)}

									< Stack key={`stack_sec_add_bottom`}
										tokens={{ padding: '0' }}
										style={{ boxShadow: Depths.depth8, display: 'flow', alignItems: 'center', justifyContent: 'center' }}
									>
										<IconButton styles={stylesAddButtonBig} iconProps={{ iconName: "add", }}
											onClick={() => arrayHelpers.push(new Section())} />
									</Stack>
								</>}
						/>
						<Stack horizontal styles={{ root: { marginTop: '2vh' } }}>
							{isNewFile ?
								<TextField placeholder='Сохранить как' errorMessage={fileNameError} onChange={onNewFileNameChange} value={currentFileName}
									styles={{ root: { width: '100%' } }} />
								:
								<Dropdown styles={{ root: { width: '100%' } }} placeholder='Сохранить как' onChange={onExistingFileNameChange}
									options={props.existingFiles?.length ?
										props.existingFiles
										:
										[{ key: null, text: "No files found" }]}
									disabled={!props.existingFiles?.length}
									selectedKey={props.existingFiles?.length ?
										props.existingFiles.find((file) => file.text === currentFileName)?.key
										:
										null} />
							}
							<Toggle onChange={onNewFileToggleChange} />
						</Stack>

						<PrimaryButton onClick={() => formikProps.handleSubmit()} text='Сохранить' style={{ width: '100%', marginTop: '1vh' }} />
					</Form>
				</>
				}
			</Formik>
		</>
	)
};

export default TocForm;
