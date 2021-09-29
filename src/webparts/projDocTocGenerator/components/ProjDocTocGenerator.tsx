import { ComboBox as Dropdown, Depths, IComboBox, IComboBoxOption, IconButton, Toggle, TooltipHost } from '@fluentui/react';
import { useBoolean } from '@fluentui/react-hooks';
import { Separator } from '@fluentui/react/lib/Separator';
import { createTheme, ITheme } from '@fluentui/react/lib/Styling';
import { TextField } from '@fluentui/react/lib/TextField';
import { CommandBarButton, PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { Stack, StackItem } from 'office-ui-fabric-react/lib/Stack';
import * as React from 'react';
import { Section, Subsection, Toc } from '../model/ToC';
import docGenerator, { loadFile } from '../utils/docGenerator';
import { IProjDocTocGeneratorProps } from './props/IProjDocTocGeneratorProps';

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

    React.useEffect(() => console.log(currentFileName, "\n", existingFiles), [currentFileName])

    return (
        <>
            <Stack tokens={{ padding: '2vh' }} style={{ boxShadow: Depths.depth8, display: 'flow', alignItems: 'center', justifyContent: 'center' }}>
                <form id="main_form" style={{ width: '100%' }} onSubmit={(event) => { event.preventDefault(); return !fileNameError && docGenerator(toc, fileSaver, currentFileName, props.context) }}>
                    <Separator theme={theme}>Table of contents</Separator>
                    <Toggle defaultChecked offText='existing file' onText='new file' onChange={onNewFileToggleChange} />
                    {creatingNewFile ?
                        <TextField label='File name'
                            onChange={onNewFileNameChange}
                            errorMessage={fileNameError && "File with same name already exists"}
                            value={currentFileName}
                            required />
                        :
                        (<>
                            <Stack horizontal verticalAlign='end' >
                                <Dropdown
                                    label='File name'
                                    style={{ width: '100%' }}

                                    onChange={onExistingFileNameChange}
                                    options={existingFiles?.length ?
                                        existingFiles
                                        :
                                        [{ key: null, text: "No files found" }]}
                                    disabled={!existingFiles?.length}
                                    selectedKey={existingFiles?.length ?
                                        existingFiles.find((file) => file.text === currentFileName)?.key
                                        :
                                        null}
                                    required
                                />
                                <TooltipHost content="Download file content">
                                    <IconButton
                                        onClick={downloadFileContent}
                                        disabled={!existingFiles?.length}
                                        iconProps={{ iconName: "download" }}
                                        ariaLabel="download" />
                                </TooltipHost>
                            </Stack>
                        </>)
                    }
                    <Separator theme={theme}>Title</Separator>
                    <Stack>
                        <Stack>
                            <TextField label="Project code" required
                                value={toc.projectCode}
                                onChange={onProjectCodeChange} />
                            <TextField label="Building name" required
                                value={toc.buildingName}
                                onChange={onBuildingNameChange} />
                            <TextField
                                label="Address" required
                                value={toc.address}
                                multiline={multiline}
                                onChange={onAddressFieldChange}
                            />
                        </Stack>
                        <Separator theme={theme}>Content</Separator>
                        <Stack>
                            <Stack>
                                {toc?.sections?.map((sec, secId) =>
                                    <>
                                        <Stack key={"stack_" + sec.sectionUuid} tokens={{ padding: '0' }} style={{ boxShadow: Depths.depth8, padding: '2vh 2vh 2vh 2vh' }}>
                                            <Stack key={"stackCancelAndSection_" + sec.sectionUuid} horizontal wrap style={{ margin: '0', padding: '0' }}>
                                                <TooltipHost key={"sectionRemoveTooltip_" + sec.sectionUuid} content="Remove section">
                                                    <IconButton
                                                        key={"sectionRemove_" + sec.sectionUuid}
                                                        onClick={() => removeSection(secId)}
                                                        style={{ background: "pink", height: '100%' }}
                                                        iconProps={{ iconName: 'Cancel' }}
                                                        ariaLabel="Remove section"
                                                    />
                                                </TooltipHost>
                                                <Stack
                                                    key={"sectionInputsStack_" + sec.sectionUuid}
                                                    style={{ width: "90%", padding: '0 0 0 1vh' }}
                                                >
                                                    <Stack
                                                        key={"secstionStack_" + sec.sectionUuid}
                                                        horizontal>
                                                        <StackItem
                                                            key={"sectionStackItemNumber_" + sec.sectionUuid}
                                                            styles={{ root: { width: "15%" } }}
                                                        >
                                                            <TextField label="#"
                                                                value={sec.section}
                                                                key={"sectionNumber_" + sec.sectionUuid}
                                                                onChange={(e) => setSection(e, secId)}
                                                                styles={{ fieldGroup: { width: '100%' }, }}
                                                                required
                                                            />
                                                        </StackItem>
                                                        <StackItem
                                                            key={"sectionStackItemTitle_" + sec.sectionUuid}
                                                            styles={{ root: { width: "100%" } }}
                                                        >
                                                            <TextField label="Section title"
                                                                value={sec.sectionTitle}
                                                                key={"sectionTitle_" + sec.sectionUuid}
                                                                onChange={(e) => setSectionTitle(e, secId)}
                                                                styles={{ fieldGroup: { width: '100%' }, }}
                                                                required
                                                            />
                                                        </StackItem>
                                                    </Stack>
                                                    {sec.subsections.map((subsec, subsecId) =>
                                                        <>
                                                            <Stack
                                                                key={"sectionStack_" + sec.sectionUuid + "_" + subsec.subsectionUuid}
                                                                horizontal
                                                                wrap
                                                                style={{ boxShadow: Depths.depth64, background: "peachpuff", margin: '0' }}
                                                            >
                                                                <TooltipHost key={"subsectionRemoveTooltip_" + sec.sectionUuid + subsec.subsectionUuid} content="Remove subsection">
                                                                    <IconButton
                                                                        key={`"subsectionRemove_${sec.sectionUuid}_${subsec.subsectionUuid}`}
                                                                        onClick={() => removeSubsection(secId, subsecId)}
                                                                        style={{ background: "pink", height: '100%' }}
                                                                        iconProps={{ iconName: 'Cancel' }}
                                                                        ariaLabel="Remove section" />
                                                                </TooltipHost>
                                                                <Stack
                                                                    key={`"subsectionStackTitle_${sec.sectionUuid}_${subsec.subsectionUuid}`}
                                                                    style={{ padding: '0 0 1vh 1vh' }}>
                                                                    <Stack
                                                                        key={`"subsectionStackHorizontalTitle_${sec.sectionUuid}_${subsec.subsectionUuid}`}
                                                                        horizontal>
                                                                        <TextField label="Subsection stamp"
                                                                            key={`"subsectionStamp_${sec.sectionUuid}_${subsec.subsectionUuid}`}
                                                                            onChange={(e) => onSubsectionStampChange(e, secId, subsecId)}
                                                                            value={subsec.stamp}
                                                                            required />
                                                                        <TextField label="Subsection number"
                                                                            key={`"subsectionNumber_${sec.sectionUuid}_${subsec.subsectionUuid}`}
                                                                            onChange={(e) => onSubsectionChange(e, secId, subsecId)}
                                                                            value={subsec.subsection}
                                                                        /*required*/ />
                                                                    </Stack>
                                                                    <TextField label="Subsection title"
                                                                        key={`"subsectionTitle_${sec.sectionUuid}_${subsec.subsectionUuid}`}
                                                                        onChange={(e) => setSubsectionTitle(e, secId, subsecId)}
                                                                        value={subsec.subsectionTitle} />
                                                                    <Stack
                                                                        key={`"subsectionStackChapter_${sec.sectionUuid}_${subsec.subsectionUuid}`}
                                                                        horizontal>
                                                                        <TextField label="Chapter number"
                                                                            key={`"chapterNumber_${sec.sectionUuid}_${subsec.subsectionUuid}`}
                                                                            onChange={(e) => setChapter(e, secId, subsecId)}
                                                                            value={subsec.chapter} />
                                                                        <TextField label="Chapter title"
                                                                            key={`"chapterTitle_${sec.sectionUuid}_${subsec.subsectionUuid}`}
                                                                            onChange={(e) => setChapterTitle(e, secId, subsecId)}
                                                                            value={subsec.chapterTitle} />
                                                                    </Stack>
                                                                    <Stack
                                                                        key={`"subsectionStackBook_${sec.sectionUuid}_${subsec.subsectionUuid}`}
                                                                        horizontal>
                                                                        <TextField label="Book number"
                                                                            key={`"bookNumber_${sec.sectionUuid}_${subsec.subsectionUuid}`}
                                                                            onChange={(e) => setBook(e, secId, subsecId)}
                                                                            value={subsec.book} />
                                                                        <TextField label="Book title"
                                                                            key={`"bookTitle_${sec.sectionUuid}_${subsec.subsectionUuid}`}
                                                                            onChange={(e) => setBookTitle(e, secId, subsecId)}
                                                                            value={subsec.bookTitle} />
                                                                    </Stack>
                                                                    <Stack
                                                                        key={`"subsectionStackBlock_${sec.sectionUuid}_${subsec.subsectionUuid}`}
                                                                        horizontal>
                                                                        <TextField label="Block"
                                                                            key={`"block_${sec.sectionUuid}_${subsec.subsectionUuid}`}
                                                                            onChange={(e) => setBlock(e, secId, subsecId)}
                                                                            value={subsec.block} />
                                                                        <TextField label="Subblock"
                                                                            key={`"subblock_${sec.sectionUuid}_${subsec.subsectionUuid}`}
                                                                            onChange={(e) => setSubblock(e, secId, subsecId)}
                                                                            value={subsec.subblock} />
                                                                    </Stack>
                                                                </Stack>
                                                            </Stack>
                                                        </>
                                                    )}
                                                    <CommandBarButton
                                                        key={`"addSubsection_${sec.sectionUuid}}`}
                                                        onClick={() => addSubsection(secId)}
                                                        iconProps={{ iconName: 'Add' }}
                                                        text="Add subsection"
                                                    />
                                                </Stack>
                                            </Stack>
                                        </Stack>
                                    </>
                                )}
                            </Stack>
                            <CommandBarButton
                                key={`"sectionStackBlock_main}`}
                                onClick={addSection} iconProps={{ iconName: 'Add' }} text="Add section" />
                        </Stack>
                        <Stack>
                            <PrimaryButton type="submit" text="Get project's ToC" />
                        </Stack>
                    </Stack>
                </form>
            </Stack>
        </>
    );
};


export default ProjDocTocGenerator;