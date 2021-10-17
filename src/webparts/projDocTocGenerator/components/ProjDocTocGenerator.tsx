import { Depths, Dropdown, IComboBoxOption, Modal, PrimaryButton, Stack } from '@fluentui/react';
import { useBoolean } from '@fluentui/react-hooks';
import { createTheme, FontSizes, ITheme } from '@fluentui/react/lib/Styling';
import { MSGraphClient } from '@microsoft/sp-http';
import * as React from 'react';
import { Toc } from '../model/ToC';
import { pizZipfileLoader } from '../utils/fileLoaders';
import BackContinueButtonGroup from './BackContinueButtonGroup';
import { IProjDocTocGeneratorProps } from './props/IProjDocTocGeneratorProps';
import TocForm from './TocForm';

const theme: ITheme = createTheme({
	fonts: {
		medium: {
			fontFamily: 'Monaco, Menlo, Consolas',
			fontSize: FontSizes.size32,
		},
	},
});
const stackTokens = { childrenGap: 10 };


interface Values {
	newProjectTemplateChecks: boolean[]

	toc: Toc
}

const ProjDocTocGenerator: React.FC<IProjDocTocGeneratorProps> = (props) => {

	const [currentToc, setCurrentToc] = React.useState<Toc>(new Toc());
	const [existingFiles, setExistingFiles] = React.useState<IComboBoxOption[]>()

	const [openingProjectName, setOpeningProjectName] = React.useState<string>()

	const [isCreateNewProjModalOpen, { setTrue: showCreateNewProjModal, setFalse: hideCreateNewProjModal }] = useBoolean(false);
	const [isOpenProjModalOpen, { setTrue: showOpenProjModal, setFalse: hideOpenProjModal }] = useBoolean(false);

	React.useEffect(() => initExistingFiles(), [])

	React.useEffect(() => console.log(currentToc), [currentToc])

	const downloadFileContent = () => {
		//console.log(openingProjectName)
		//console.log(existingFiles.find((file) => file.text === openingProjectName).key)

		pizZipfileLoader(existingFiles.find((file) => file.text === openingProjectName)?.key as string,
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
				client.api(`/sites/root/drive/root:/${props.tocFolder ? props.tocFolder : '/'}:/children`)
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

				<PrimaryButton text="Открыть существующий проект" onClick={showOpenProjModal} />

				<Modal
					titleAriaId="openProjModal"
					isOpen={isOpenProjModalOpen}
					onDismiss={hideOpenProjModal}
					isBlocking={false}
					styles={{ main: { height: 'wrap-content', width: '20vw', borderRadius: '0,5vh', padding: '2vh 2vw', position: 'relative' } }}
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
					<BackContinueButtonGroup onClickBack={hideOpenProjModal} onClickContinue={handleOpenProject} />
				</Modal>

				{<TocForm context={props.context}
					toc={currentToc} setToc={setCurrentToc}
					tocFolder={props.tocFolder} docxFolder={props.docxFolder}
					existingFiles={existingFiles}
				/>}

			</Stack>
		</>
	);
};


export default ProjDocTocGenerator;