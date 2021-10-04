import { Checkbox, ComboBox as Dropdown, DefaultButton, Depths, IComboBox, IComboBoxOption, IconButton, Modal, Toggle, TooltipHost } from '@fluentui/react';
import { useBoolean } from '@fluentui/react-hooks';
import { Separator } from '@fluentui/react/lib/Separator';
import { createTheme, FontSizes, ITheme } from '@fluentui/react/lib/Styling';
import { TextField } from '@fluentui/react/lib/TextField';
import { MSGraphClient } from '@microsoft/sp-http';
import { Form, Formik, FormikHelpers } from 'formik';
import { values } from 'lodash';
import { CommandBarButton, PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { Stack, StackItem } from 'office-ui-fabric-react/lib/Stack';
import * as React from 'react';
import { Section, Subsection, Toc } from '../model/ToC';
import docGenerator, { loadFile } from '../utils/docGenerator';
import fileSaver from '../utils/fileSaver';
import { IProjDocTocGeneratorProps } from './props/IProjDocTocGeneratorProps';
import TocForm from './TocForm';
import * as Yup from 'yup';

const theme: ITheme = createTheme({
	fonts: {
		medium: {
			fontFamily: 'Monaco, Menlo, Consolas',
			fontSize: FontSizes.size32,
		},
	},
});
const stackTokens = { childrenGap: 10 };

const sectionsPreset: Section[] = [
	{ ...new Section, section: '1', stamp: 'ПЗ', sectionTitle: 'Пояснительная записка' },
	{ ...new Section, section: '2', stamp: 'ПЗУ', sectionTitle: 'Схема планировочной организации земельного участка' },
	{ ...new Section, section: '3', stamp: 'АР', sectionTitle: 'Архитектурные решения' },
	{ ...new Section, section: '4', stamp: 'КР', sectionTitle: 'Конструктивные и объемно-планировочные решения' },
	{ ...new Section, section: '5', stamp: 'ИОС', sectionTitle: 'Сведения об инженерном оборудовании, о сетях инженерно-технического обеспечения, перечень инженерно-технических мероприятий, содержание технологических решений' },
	{ ...new Section, section: '6', stamp: 'ПОС', sectionTitle: 'Проект организации строительства' },
	{ ...new Section, section: '7', stamp: 'ПОД', sectionTitle: 'Проект организации работ по сносу или демонтажу объектов капитального строительства' },
	{ ...new Section, section: '8', stamp: 'ООС', sectionTitle: 'Перечень мероприятий по охране окружающей среды' },
	{ ...new Section, section: '9', stamp: 'ПБ', sectionTitle: 'Мероприятия по обеспечению пожарной безопасности' },
	{ ...new Section, section: '10', stamp: 'ОДИ', sectionTitle: 'Мероприятия по обеспечению доступа инвалидов' },
	{ ...new Section, section: '10.1', stamp: 'ЭЭ', sectionTitle: 'Мероприятия по обеспечению соблюдения требований энергетической эффективности и требований оснащенности зданий, строений и сооружений приборами учета используемых энергетических ресурсов' },
	{ ...new Section, section: '11', stamp: 'СМ', sectionTitle: 'Смета на строительство объектов капитального строительства' },
	{ ...new Section, section: '11.1', stamp: 'ПКР', sectionTitle: 'Сведения о нормативной периодичности выполнения работ по капитальному ремонту многоквартирного дома' },
	{ ...new Section, section: '12', stamp: '', sectionTitle: 'Иная документация в случаях, предусмотренных федеральными законами' }
]

interface Values {
	currentFileName: string
	newProjectTemplateChecks: boolean[]

	toc: Toc
}

const ProjDocTocGenerator: React.FC<IProjDocTocGeneratorProps> = (props) => {

	const [currentToc, setCurrentToc] = React.useState<Toc>();
	// const [currentFileName, setCurrentFileName] = React.useState<string>()
	// const [existingFiles, setExistingFiles] = React.useState<IComboBoxOption[]>()
	const [isCreateNewProjModalOpen, { setTrue: showCreateNewProjModal, setFalse: hideCreateNewProjModal }] = useBoolean(false);

	////const [newProjectTemplateChecks, setNewProjectTemplateChecks] = React.useState<boolean[]>(new Array<boolean>(sectionsPreset.length).fill(true));
	// React.useEffect(() => initExistingFiles(), [])

	//// const toggleTemplateItem = (checkboxId: number) => {
	//// 	setNewProjectTemplateChecks(newProjectTemplateChecks.map((check, id) => id === checkboxId ? !check : check))
	//// }

	React.useEffect(() => console.log(currentToc), [currentToc])

	// const downloadFileContent = () => {
	// 	console.log(currentFileName)
	// 	console.log(existingFiles.find((file) => file.text === currentFileName).key)

	// 	loadFile(existingFiles.find((file) => file.text === currentFileName).key as string,
	// 		function (
	// 			error: any,
	// 			content: ArrayBuffer
	// 		) {
	// 			if (error) { throw error; }
	// 			const decoder = new TextDecoder('utf-8')
	// 			setToc(JSON.parse(decoder.decode(new Int8Array(content))))
	// 		})
	// }
	// const initExistingFiles: () => void = () =>
	// 	props.context.msGraphClientFactory.getClient()
	// 		.then((client: MSGraphClient): void => {
	// 			client.api("/me/drive/root:/jsonToc:/children")
	// 				.get()
	// 				.then((data) => setExistingFiles([...(data.value as [])
	// 					.filter((item: any) => (item.name as string).match(/\.json$/))
	// 					.map((item: any) => {
	// 						return { key: item['@microsoft.graph.downloadUrl'], text: item.name.replace(/\.[^/.]+$/, "") }
	// 					})]))
	// 		})

	//// const createNewToc = () => {
	//// 	const _toc = new Toc();
	//// 	_toc.sections = newProjectTemplateChecks.map((check, checkId) => check ? sectionsPreset[checkId] : null).filter(section => section)
	//// 	setToc(_toc)
	//// 	hideCreateNewProjModal()
	//// }

	return (
		<>
			<Stack tokens={{ padding: '2vh' }} style={{ boxShadow: Depths.depth8, display: 'flow', alignItems: 'center', justifyContent: 'center' }}>
				<h1 {...theme}>Генератор проектной документации</h1>
				<Formik
					validationSchema=
					{Yup.object({
						currentFileName: Yup.string()
					})}
					initialValues={{
						currentFileName: '',
						_toc: null,
						newProjectTemplateChecks: new Array<boolean>(sectionsPreset.length).fill(true)
					}}
					onSubmit={(values, formikHelpers): void | Promise<any> => {
						const _presetToc = new Toc

						_presetToc.sections = sectionsPreset.filter((sec, secId) => values.newProjectTemplateChecks[secId])

						setCurrentToc({ ..._presetToc })
						hideCreateNewProjModal()
					}}>
					{(props) => <>
						<Form>
							<Stack horizontal tokens={stackTokens}>
								<PrimaryButton text="Создать проект" onClick={showCreateNewProjModal} />
								<PrimaryButton text="Открыть существующий проект" />
							</Stack>
							<Modal
								titleAriaId="createNewProjectModal"
								isOpen={isCreateNewProjModalOpen}
								onDismiss={hideCreateNewProjModal}
								isBlocking={false}
								styles={{ main: { height: '70vh', width: '40vw', borderRadius: '2vh', padding: '5vh 5vw' } }}
							// containerClassName={contentStyles.container}
							>
								<Stack>
									<h2 {...theme}>Добавить разделы</h2>
									{/* <Stack tokens={stackTokens}>
									<Checkbox label="Выбрать все" />
								</Stack> */}
									<Stack tokens={stackTokens} style={{ padding: '2vh 0 0 1vw' }}>
										{sectionsPreset.map((sectionItem, checkboxId) => (
											<>
												<Checkbox
													key={`template_checkbox_${checkboxId}`}
													name={`newProjectTemplateChecks[${checkboxId}]`}
													styles={{ label: { width: '100%', alignItems: 'baseline' } }}
													onChange={props.handleChange}
													checked={props.values.newProjectTemplateChecks[checkboxId]}
													onRenderLabel={() =>
														<Stack horizontal style={{ width: '100%' }}>
															<div style={{ fontSize: '1.1em', width: '7%', position: 'relative', display: 'block', left: '1%' }}>{sectionItem.section}</div>
															<div style={{ fontSize: '1.1em', width: '75%', position: 'relative', display: 'block', }}>{sectionItem.sectionTitle}</div>
															<div style={{ fontSize: '1.1em', width: '18%', position: 'relative', display: 'block', textAlign: 'right' }}>{sectionItem.stamp}</div>
														</Stack>}
												/>
											</>
										))}
									</Stack>
								</Stack>
								<Stack horizontal style={{ alignItems: 'center', width: '100%', padding: '4vw 5vw 0 5vw' }}>
									<Stack>
										<DefaultButton text="Назад" onClick={hideCreateNewProjModal} style={{}} />
									</Stack>
									<Stack horizontalAlign="end" style={{ width: '100%' }}>
										<PrimaryButton type='submit' onClick={() => props.handleSubmit()}>Продолжить</PrimaryButton>
									</Stack>
								</Stack>
							</Modal>
						</Form>
					</>}
				</Formik>

				{currentToc && <TocForm toc={currentToc} /> || <TocForm toc={new Toc} />}
			</Stack>
		</>
	);
};


export default ProjDocTocGenerator;