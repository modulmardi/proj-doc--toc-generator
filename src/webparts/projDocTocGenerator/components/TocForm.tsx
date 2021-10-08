import { createTheme, Depths, IButtonStyles, IComboBoxOption, IconButton, ITheme, Modal, Stack, StackItem, TextField } from '@fluentui/react';
import { useBoolean } from '@fluentui/react-hooks';
import { FieldArray, Form, Formik, FormikHelpers } from 'formik';
import * as React from 'react';
import { Section, Subsection, Toc } from '../model/ToC';
import { stylesAddButtonBig, stylesAddButtonLateral, stylesCancelButton, stylesEditButton } from './styles/stylesButton';
import EditSectionModal from './EditSectionModal';

interface ITocFormProps {
	toc: Toc
}


interface Values {
	_toc: Toc
}





const TocForm: React.FC<ITocFormProps> = (props: ITocFormProps) => {
	const [isEditSectionModalOpen, { setTrue: showEditSectionModal, setFalse: hideEditSectionModal }] = useBoolean(false);
	const [currentEditableSection, setCurrentEditableSection] = React.useState<Section>(null);
	const [currentEditableSectionNumber, setCurrentEditableSectionNumber] = React.useState<number>(null);
	const [isSectionEdited, setIsSectionEdited] = React.useState<boolean>(false);
	const replacer = React.useRef<(index: number, value: any) => void>(null)
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
							<TextField name={`_toc.buildingName`}
								onChange={props.handleChange}
								multiline autoAdjustHeight resizable={false} borderless underlined placeholder="Название объекта" value={props.values._toc.buildingName} />
							<TextField name={`_toc.address`}
								onChange={props.handleChange}
								multiline autoAdjustHeight resizable={false} borderless underlined placeholder="Адрес" value={props.values._toc.address} />
							<Stack horizontal>
								<TextField name={`_toc.projectCode`}
									onChange={props.handleChange}
									styles={{ root: { width: '100%' } }} borderless underlined placeholder="Код проекта" value={props.values._toc.projectCode} />
								<TextField name={`_toc.projectStage`}
									onChange={props.handleChange}
									styles={{ root: { width: '100%' } }} borderless underlined placeholder="Стадия проекта" value={props.values._toc.projectStage} />
							</Stack>
							<TextField name={`_toc.gipName`}
								onChange={props.handleChange}
								borderless underlined placeholder="ГИП" value={props.values._toc.gipName} />
							<TextField name={`_toc.gapName`}
								onChange={props.handleChange}
								borderless underlined placeholder="ГАП" value={props.values._toc.gapName} />
							<TextField name={`_toc.nContr`}
								onChange={props.handleChange}
								borderless underlined placeholder="Н. Контр" value={props.values._toc.nContr} />
						</Stack>

						<h2>Разделы</h2>

						{//console.log(props.values._toc)}
						}
						<FieldArray name="_toc.sections"
							render={arrayHelpers =>
								<>
									{props.values._toc?.sections?.length > 0 &&
										props.values._toc?.sections?.map((section, sectionId, sections) =>
											<>

												<EditSectionModal isEditSectionModalOpen={isEditSectionModalOpen}
													hideEditSectionModal={hideEditSectionModal}
													currentEditableSection={currentEditableSection}
													setIsSectionEdited={setIsSectionEdited}
													setCurrentEditableSection={setCurrentEditableSection}
												/>

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
															styles={stylesEditButton}
															iconProps={{ iconName: "edit", }}
															onClick={() => {
																setCurrentEditableSection(section)
																setCurrentEditableSectionNumber(sectionId)
																replacer.current = arrayHelpers.replace
																showEditSectionModal()
															}} />
														<IconButton key={`stack_sec_input_${sections[sectionId].sectionUuid}_cancel`}
															style={{}}
															styles={stylesCancelButton}
															iconProps={{ iconName: "cancel", }}
															onClick={() => arrayHelpers.remove(sectionId)} />

														<Stack horizontal styles={{ root: { width: '100%' } }}>
															<TextField placeholder="#" key={`stack_sec_input_${sections[sectionId].sectionUuid}_#`}
																name={`_toc.sections[${sectionId}].section`} borderless underlined value={section.section} onChange={props.handleChange} />
															<TextField key={`stack_sec_input_${sections[sectionId].sectionUuid}_stamp`}
																styles={{ root: { width: '100%' } }} name={`_toc.sections[${sectionId}].stamp`} borderless underlined placeholder="Шифр раздела" value={section.stamp} onChange={props.handleChange} />
														</Stack>

														<TextField placeholder="Наименование раздела" key={`stack_sec_input_${sections[sectionId].sectionUuid}_title`}
															name={`_toc.sections[${sectionId}].sectionTitle`} value={section.sectionTitle}
															multiline autoAdjustHeight resizable={false}
															styles={{ root: { width: '100%' } }}
															borderless underlined onChange={props.handleChange} />

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
					</Form>
				</>
				}
			</Formik>
		</>
	)
};

export default TocForm;
