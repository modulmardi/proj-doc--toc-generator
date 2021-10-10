import { Checkbox, Dropdown, DefaultButton, Depths, IComboBox, IComboBoxOption, IconButton, Modal, Toggle, TooltipHost } from '@fluentui/react';
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
import styles from './ProjDocTocGeneratorApp.module.scss';

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
	{ ...new Section, section: '1', sectionStamp: 'ПЗ', sectionTitle: 'Пояснительная записка' },
	{ ...new Section, section: '2', sectionStamp: 'ПЗУ', sectionTitle: 'Схема планировочной организации земельного участка' },
	{ ...new Section, section: '3', sectionStamp: 'АР', sectionTitle: 'Архитектурные решения' },
	{ ...new Section, section: '4', sectionStamp: 'КР', sectionTitle: 'Конструктивные и объемно-планировочные решения' },
	{ ...new Section, section: '5', sectionStamp: 'ИОС', sectionTitle: 'Сведения об инженерном оборудовании, о сетях инженерно-технического обеспечения, перечень инженерно-технических мероприятий, содержание технологических решений' },
	{ ...new Section, section: '6', sectionStamp: 'ПОС', sectionTitle: 'Проект организации строительства' },
	{ ...new Section, section: '7', sectionStamp: 'ПОД', sectionTitle: 'Проект организации работ по сносу или демонтажу объектов капитального строительства' },
	{ ...new Section, section: '8', sectionStamp: 'ООС', sectionTitle: 'Перечень мероприятий по охране окружающей среды' },
	{ ...new Section, section: '9', sectionStamp: 'ПБ', sectionTitle: 'Мероприятия по обеспечению пожарной безопасности' },
	{ ...new Section, section: '10', sectionStamp: 'ОДИ', sectionTitle: 'Мероприятия по обеспечению доступа инвалидов' },
	{ ...new Section, section: '10.1', sectionStamp: 'ЭЭ', sectionTitle: 'Мероприятия по обеспечению соблюдения требований энергетической эффективности и требований оснащенности зданий, строений и сооружений приборами учета используемых энергетических ресурсов' },
	{ ...new Section, section: '11', sectionStamp: 'СМ', sectionTitle: 'Смета на строительство объектов капитального строительства' },
	{ ...new Section, section: '11.1', sectionStamp: 'ПКР', sectionTitle: 'Сведения о нормативной периодичности выполнения работ по капитальному ремонту многоквартирного дома' },
	{ ...new Section, section: '12', sectionStamp: '', sectionTitle: 'Иная документация в случаях, предусмотренных федеральными законами' }
]

interface Values {
	newProjectTemplateChecks: boolean[]

	toc: Toc
}

const ProjDocTocGenerator: React.FC<IProjDocTocGeneratorProps> = (props) => {

	const [currentToc, setCurrentToc] = React.useState<Toc>();
	const [existingFiles, setExistingFiles] = React.useState<IComboBoxOption[]>()

	const [openingProjectName, setOpeningProjectName] = React.useState<string>()

	const [isCreateNewProjModalOpen, { setTrue: showCreateNewProjModal, setFalse: hideCreateNewProjModal }] = useBoolean(false);
	const [isOpenProjModalOpen, { setTrue: showOpenProjModal, setFalse: hideOpenProjModal }] = useBoolean(false);

	React.useEffect(() => initExistingFiles(), [])

	React.useEffect(() => console.log(currentToc), [currentToc])

	const downloadFileContent = () => {
		//console.log(openingProjectName)
		//console.log(existingFiles.find((file) => file.text === openingProjectName).key)

		loadFile(existingFiles.find((file) => file.text === openingProjectName)?.key as string,
			function (
				error: any,
				content: ArrayBuffer
			) {
				if (error) { throw error; }
				const decoder = new TextDecoder('utf-8')
				setCurrentToc(JSON.parse(decoder.decode(new Int8Array(content))))
			})
	}

	const initExistingFiles: () => void = () =>
		props.context.msGraphClientFactory.getClient()
			.then((client: MSGraphClient): void => {
				client.api("/me/drive/root:/jsonToc:/children")
					.get()
					.then((data) => setExistingFiles([...(data.value as [])
						.filter((item: any) => (item.name as string).match(/\.toc$/))
						.map((item: any) => {
							return { key: item['@microsoft.graph.downloadUrl'], text: item.name.replace(/\.[^/.]+$/, "") }
						})]))
			})
	const onOpeningProjectNameChange = (e, newOpeningProjectName) => {
		setOpeningProjectName(newOpeningProjectName.text)
	}
	const handleOpenProject = () => {
		downloadFileContent()
		hideOpenProjModal();
	}

	return (
		<>
			<Stack tokens={{ padding: '2vh' }} style={{ boxShadow: Depths.depth8, display: 'flow', alignItems: 'center', justifyContent: 'center' }}>
				<h1 {...theme}>Генератор проектной документации</h1>
				<Formik
					initialValues={{
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
								<PrimaryButton text="Сгенерировать разделы" onClick={showCreateNewProjModal} />
								<PrimaryButton text="Открыть существующий проект" onClick={showOpenProjModal} />
							</Stack>
							<Modal
								titleAriaId="createNewProjectModal"
								isOpen={isCreateNewProjModalOpen}
								onDismiss={hideCreateNewProjModal}
								isBlocking={false}
								styles={{ main: { height: 'wrap-content', width: '40vw', borderRadius: '0,5vh', padding: '2vh 2vw', position: 'relative' } }}
							>
								<Stack>
									<h2 {...theme}>Добавить разделы</h2>
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
															<div style={{ fontSize: '1.1em', width: '18%', position: 'relative', display: 'block', textAlign: 'right' }}>{sectionItem.sectionStamp}</div>
														</Stack>}
												/>
											</>
										))}
									</Stack>
								</Stack>
								<Stack horizontal style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', padding: '1vh 0 0 0' }}>
									<DefaultButton text="Назад" onClick={hideCreateNewProjModal} style={{ width: '100%' }} />
									<PrimaryButton text="Продолжить" type='submit' onClick={() => props.handleSubmit()} style={{ width: '100%' }} />
								</Stack>
							</Modal>
							<Modal
								titleAriaId="openProjModal"
								isOpen={isOpenProjModalOpen}
								onDismiss={hideOpenProjModal}
								isBlocking={false}
								styles={{ main: { height: 'wrap-content', width: '40vw', borderRadius: '0,5vh', padding: '2vh 2vw', position: 'relative' } }}
							>
								<Stack>
									<h2 {...theme}>Выберите проект</h2>
									<Dropdown styles={{ root: { width: '100%' } }} placeholder='Имя проекта' onChange={onOpeningProjectNameChange}
										options={existingFiles?.length ?
											existingFiles
											:
											[{ key: null, text: "No files found" }]}
										disabled={!existingFiles?.length}
										selectedKey={existingFiles?.length ?
											existingFiles.find((file) => file.text === openingProjectName)?.key
											:
											null} />
								</Stack>
								<Stack horizontal style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', padding: '1vh 0 0 0' }}>
									<DefaultButton text="Назад" onClick={hideCreateNewProjModal} style={{ width: '100%' }} />
									<PrimaryButton text="Продолжить" type='submit' onClick={handleOpenProject} style={{ width: '100%' }} />
								</Stack>
							</Modal>
						</Form>
					</>}
				</Formik>

				{<TocForm toc={currentToc || new Toc()} setToc={setCurrentToc} existingFiles={existingFiles} context={props.context} />}

			</Stack>
		</>
	);
};


export default ProjDocTocGenerator;