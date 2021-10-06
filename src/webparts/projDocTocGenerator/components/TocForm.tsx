import { createTheme, Depths, IButtonStyles, IComboBoxOption, IconButton, ITheme, Stack, StackItem, TextField } from '@fluentui/react';
import { useBoolean } from '@fluentui/react-hooks';
import { FieldArray, Form, Formik, FormikHelpers } from 'formik';
import { values } from 'lodash';
import * as React from 'react';
import { Section, Subsection, Toc } from '../model/ToC';
import { SharedColors, NeutralColors } from '@fluentui/theme';
import { getTheme } from '@fluentui/react';
import { mergeStyles, mergeStyleSets } from '@fluentui/merge-styles';
import { stylesAddButtonBig, stylesAddButtonLateral, stylesCancelButton, stylesEditButton } from './styles/stylesButton';

interface ITocFormProps {
	toc: Toc
}


interface Values {
	_toc: Toc
}





const TocForm: React.FC<ITocFormProps> = (props: ITocFormProps) => {
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
								multiline borderless underlined placeholder="Название объекта" value={props.values._toc.buildingName} />
							<TextField name={`_toc.address`}
								onChange={props.handleChange}
								multiline borderless underlined placeholder="Адрес" value={props.values._toc.address} />
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

						{console.log(props.values._toc)}

						<FieldArray name="_toc.sections"
							render={arrayHelpers =>
								<>
									{props.values._toc?.sections?.length > 0 &&
										props.values._toc?.sections?.map((section, sectionId, sections) =>
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
															styles={stylesEditButton}
															iconProps={{ iconName: "edit", }}
															onClick={() => arrayHelpers.remove(sectionId)} />
														<IconButton key={`stack_sec_input_${sections[sectionId].sectionUuid}_cancel`}
															style={{}}
															styles={stylesCancelButton}
															iconProps={{ iconName: "cancel", }}
															onClick={() => arrayHelpers.remove(sectionId)} />

														<Stack horizontal styles={{ root: { width: '100%' } }}>
															<TextField key={`stack_sec_input_${sections[sectionId].sectionUuid}_#`}
																name={`_toc.sections[${sectionId}].section`} borderless underlined placeholder="#" value={section.section} onChange={props.handleChange} />
															<TextField key={`stack_sec_input_${sections[sectionId].sectionUuid}_stamp`}
																styles={{ root: { width: '100%' } }} name={`_toc.sections[${sectionId}].stamp`} borderless underlined placeholder="Шифр раздела" value={section.stamp} onChange={props.handleChange} />
														</Stack>

														<TextField key={`stack_sec_input_${sections[sectionId].sectionUuid}_title`}
															multiline
															styles={{ root: { width: '100%' } }}
															name={`_toc.sections[${sectionId}].sectionTitle`} borderless underlined placeholder="Наименование раздела" value={section.sectionTitle} onChange={props.handleChange} />

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
