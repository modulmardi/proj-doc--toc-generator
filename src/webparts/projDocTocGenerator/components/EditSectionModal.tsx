import { Depths, IconButton, Modal, MotionAnimations, Stack, TextField } from '@fluentui/react';
import { Pagination } from '@uifabric/experiments/lib/Pagination';
import { FieldArray, Form, Formik } from 'formik';
import * as React from 'react';
import { Section, Subsection, Toc } from '../model/ToC';
import BackContinueButtonGroup from './BackContinueButtonGroup';
import "./style.scss";
import stringToColor from '../utils/stringToColor'
import { stylesAddButtonModalCentral, stylesAddButtonModalLateralLeft, stylesAddButtonModalLateralRight, stylesDeleteButtonModal } from './styles/stylesButton';
import TablePreview from './TablePreview';

interface IPropEditSectionModal {
	toc: Toc
	isEditSectionModalOpen: boolean
	hideEditSectionModal: () => void
	currentEditableSection: Section
	setCurrentEditableSection: React.Dispatch<React.SetStateAction<Section>>
	setIsSectionEdited: React.Dispatch<React.SetStateAction<boolean>>
}

const EditSectionModal: React.FC<IPropEditSectionModal> = (props) => {

	const [currentSubsectionNumber, setCurrentSubsection] = React.useState<number>(0)
	const [modalAnimation, setModalAnimation] = React.useState<string>(MotionAnimations.slideRightIn)
	const _hideEditSectionModal = props.hideEditSectionModal
	React.useEffect(() => setCurrentSubsection(0), [props.isEditSectionModalOpen])

	React.useEffect(() => {
		if (modalAnimation != '') {
			setTimeout(() => {
				setModalAnimation('')
			}, 300);
		}
	}, [modalAnimation])

	return <>
		<Modal
			titleAriaId="edit"
			isOpen={props.isEditSectionModalOpen}
			onDismiss={props.hideEditSectionModal}
			isBlocking={false}
			styles={{ main: { margin: 0, padding: 0, height: '100%', width: '100%', position: 'relative', backgroundColor: 'transparent', boxShadow: Depths.depth0 } }}
		>
			<Formik
				initialValues={{
					_section: props.currentEditableSection,

				}}
				onSubmit={(values, formikHelpers): void | Promise<any> => {
					props.setCurrentEditableSection(values._section)

					props.setIsSectionEdited(true)
					props.hideEditSectionModal()
				}}>
				{({ values, ...formikProps }) => <>
					<Form>

						<FieldArray
							name='_section.subsections'
							render={arrayHelpers =>
								<>
									{values?._section?.subsections?.length != 0 &&
										<>
											<IconButton key={`modal_stack_subsec_sec_input_${values._section.subsections[currentSubsectionNumber].subsectionUuid}_cancel`}
												styles={{ ...stylesDeleteButtonModal }} iconProps={{ iconName: "cancel", }}
												onClick={() => {
													setModalAnimation(MotionAnimations.slideDownOut)
													console.log(currentSubsectionNumber,);
													arrayHelpers.remove(currentSubsectionNumber)
													if ((currentSubsectionNumber >= values?._section?.subsections?.length - 1) && !(currentSubsectionNumber == 0)) setCurrentSubsection((previous) => previous - 1)
												}} />
											<IconButton key={`modal_stack_subsec_sec_input_${values._section.subsections[currentSubsectionNumber].subsectionUuid}_add_left`}
												styles={{ ...stylesAddButtonModalLateralLeft }} iconProps={{ iconName: "add", }}
												onClick={() => {
													arrayHelpers.insert(currentSubsectionNumber, new Subsection())
													setModalAnimation(MotionAnimations.slideRightIn)
												}} />
											<IconButton key={`modal_stack_subsec_sec_input_${values._section.subsections[currentSubsectionNumber].subsectionUuid}_add_right`}
												styles={{ ...stylesAddButtonModalLateralRight }} iconProps={{ iconName: "add", }}
												onClick={() => {
													arrayHelpers.insert(currentSubsectionNumber + 1, new Subsection())
													setCurrentSubsection((previous) => previous + 1)
													setModalAnimation(MotionAnimations.slideLeftIn)
												}} />
										</>
									}
									{console.log("DEBUUUUUUG", values._section)}
									<div style={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
										<Stack styles={{ root: { position: 'relative', minWidth: '40vw', minHeight: '30vh', backgroundColor: 'white', padding: '1vh', boxShadow: Depths.depth64, animation: modalAnimation } }}>
											{values?._section?.subsections?.length == 0 &&

												<IconButton key={`modal_stack_subsec_input_add_central`}
													styles={{ ...stylesAddButtonModalCentral }} iconProps={{ iconName: "add", }}
													onClick={() => {
														setCurrentSubsection(0);
														arrayHelpers.push(new Subsection())
														setModalAnimation(MotionAnimations.slideLeftIn)
													}} />

											}
											{values?._section?.subsections?.length > 0 &&
												<>


													<div style={{ width: '100%', height: '2vh', backgroundColor: stringToColor(values._section.subsections[currentSubsectionNumber].subsectionUuid) }}>

													</div>

													<Pagination pageCount={values._section.subsections.length}
														selectedPageIndex={currentSubsectionNumber}
														onPageChange={(subsection) => setCurrentSubsection(subsection)}
													/>


													<Stack styles={{ root: { marginBottom: '10vh' } }} >
														<TextField placeholder="Шифр подраздела (Перезаписывает шифр раздела!!!)" name={`_section.subsections[${currentSubsectionNumber}].subsectionStamp`}
															key={`modal_stack_subsec_input_${values._section.subsections[currentSubsectionNumber].subsectionUuid}_subsectionStamp`}
															value={values._section.subsections[currentSubsectionNumber]?.subsectionStamp}

															borderless underlined styles={{ root: { width: '100%' } }} onChange={formikProps.handleChange} />

														<TextField placeholder="Подраздел #" name={`_section.subsections[${currentSubsectionNumber}].subsection`}
															key={`modal_stack_subsec_input_${values._section.subsections[currentSubsectionNumber]?.subsectionUuid}_#`}
															value={values._section.subsections[currentSubsectionNumber]?.subsection}

															borderless underlined styles={{ root: { width: '100%' } }} onChange={formikProps.handleChange} />

														<TextField placeholder="Наименование подраздела" name={`_section.subsections[${currentSubsectionNumber}].subsectionTitle`}
															key={`modal_stack_subsec_input_${values._section.subsections[currentSubsectionNumber]?.subsectionUuid}_subsectionTitle`}
															value={values._section.subsections[currentSubsectionNumber]?.subsectionTitle}

															multiline autoAdjustHeight resizable={false} borderless underlined styles={{ root: { width: '100%' } }} onChange={formikProps.handleChange} />

														<TextField placeholder="Часть #" name={`_section.subsections[${currentSubsectionNumber}].chapter`}
															key={`modal_stack_subsec_input_${values._section.subsections[currentSubsectionNumber]?.subsectionUuid}_chapter`}
															value={values._section.subsections[currentSubsectionNumber]?.chapter}

															borderless underlined styles={{ root: { width: '100%' } }} onChange={formikProps.handleChange} />

														<TextField placeholder="Наименование части" name={`_section.subsections[${currentSubsectionNumber}].chapterTitle`}
															key={`modal_stack_subsec_input_${values._section.subsections[currentSubsectionNumber]?.subsectionUuid}_chapterTitle`}
															value={values._section.subsections[currentSubsectionNumber]?.chapterTitle}

															multiline autoAdjustHeight resizable={false} borderless underlined styles={{ root: { width: '100%' } }} onChange={formikProps.handleChange} />

														<TextField placeholder="Книга #" name={`_section.subsections[${currentSubsectionNumber}].book`}
															key={`modal_stack_subsec_input_${values._section.subsections[currentSubsectionNumber]?.subsectionUuid}_book`}
															value={values._section.subsections[currentSubsectionNumber]?.book}

															borderless underlined styles={{ root: { width: '100%' } }} onChange={formikProps.handleChange} />

														<TextField placeholder="Название книги" name={`_section.subsections[${currentSubsectionNumber}].bookTitle`}
															key={`modal_stack_subsec_input_${values._section.subsections[currentSubsectionNumber]?.subsectionUuid}_bookTitle`}
															value={values._section.subsections[currentSubsectionNumber]?.bookTitle}

															multiline autoAdjustHeight resizable={false} borderless underlined styles={{ root: { width: '100%' } }} onChange={formikProps.handleChange} />

														<TextField placeholder="Корпус" name={`_section.subsections[${currentSubsectionNumber}].block`}
															key={`modal_stack_subsec_input_${values._section.subsections[currentSubsectionNumber]?.subsectionUuid}_block`}
															value={values._section.subsections[currentSubsectionNumber]?.block} //наверное должно набираться *тэгами*

															borderless underlined styles={{ root: { width: '100%' } }} onChange={formikProps.handleChange} />

														<TextField placeholder="Подкорпус" name={`_section.subsections[${currentSubsectionNumber}].subblock`}
															key={`modal_stack_subsec_input_${values._section.subsections[currentSubsectionNumber]?.subsectionUuid}_subblock`}
															value={values._section.subsections[currentSubsectionNumber]?.subblock}

															borderless underlined styles={{ root: { width: '100%' } }} onChange={formikProps.handleChange} />

														<TablePreview toc={props.toc} section={values._section} currentSubsectionNumber={currentSubsectionNumber} />
													</Stack>


												</>}

											<BackContinueButtonGroup onClickBack={_hideEditSectionModal}
												onClickContinue={() => formikProps.handleSubmit()} />

										</Stack>
									</div>
								</>} />
					</Form>
				</>}

			</Formik>
		</Modal>
	</>
}

export default EditSectionModal