import { useBoolean } from '@fluentui/react-hooks';
import { Separator } from '@fluentui/react/lib/Separator';
import { createTheme, ITheme } from '@fluentui/react/lib/Styling';
import { TextField } from '@fluentui/react/lib/TextField';
import { CommandBarButton, PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { Stack, StackItem } from 'office-ui-fabric-react/lib/Stack';
import * as React from 'react';
import { IProjDocTocGeneratorProps } from './props/IProjDocTocGeneratorProps';
import { v4 as uuidv4 } from 'uuid';
import docGenerator from '../utils/docGenerator';

import { BaseButton, Button, DefaultEffects, Depths, IconButton, TooltipHost } from '@fluentui/react';
import { MouseEventHandler } from 'react';

const theme: ITheme = createTheme({
    fonts: {
        medium: {
            fontFamily: 'Monaco, Menlo, Consolas',
            fontSize: '30px',
        },
    },
});

class Toc { //Table of Contents
    public buildingName: string
    public address: string
    public projectCode: string
    public sections: Section[]
    constructor() {
        this.sections = []
    }

}

class Section {
    public section: string
    public sectionTitle: string
    public subsections: Subsection[]
    public readonly sectionUuid: string
    constructor() {
        this.sectionUuid = uuidv4()
        this.subsections = []
    }
}
class Subsection {
    public subsection: string
    public subsectionTitle: string
    public stamp: string
    public chapter: string
    public chapterTitle: string
    public book: string
    public bookTitle: string
    public block: string
    public subblock: string
    public readonly subsectionUuid: string
    constructor() {
        this.subsectionUuid = uuidv4()
    }
}


const ProjDocTocGenerator: React.FC<IProjDocTocGeneratorProps> = (props) => {
    const onOverflowedTextField = (ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newText: string): void => {
        setAddress(ev)

        const newMultiline = newText.length > 40;
        if (newMultiline !== multiline) {
            toggleMultiline();
        }
    };
    let [toc, setToc] = React.useState<Toc>(new Toc())

    const [multiline, { toggle: toggleMultiline }] = useBoolean(false);

    const setProjectCode = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setToc({ ...toc, projectCode: e.currentTarget.value })
    }
    const setBuildingName = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setToc({ ...toc, buildingName: e.currentTarget.value })
    }
    const setAddress = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setToc({ ...toc, address: e.currentTarget.value })
    }
    //TODO
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
    const setSubsectionStamp = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, secId, subsecId) => {
        let _toc = toc
        _toc.sections[secId].subsections[subsecId].stamp = e.currentTarget.value
        setToc({ ..._toc })
    }
    const setSubsection = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, secId, subsecId) => {
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


    const addSection = () => {
        setToc({ ...toc, sections: [...toc.sections, new Section()] })
    }
    const removeSection = (secId) => {
        setToc({
            ...toc, sections: [...toc.sections.filter((section, id) => {
                return id != secId

            })]
        })
    }
    const addSubsection = (id: number) => {
        let _toc = toc
        _toc.sections[id].subsections = [...toc.sections[id].subsections, new Subsection()]
        //console.log(toc.sections[id].subsections)
        //console.log(toc, _toc)
        setToc({ ..._toc })
    }
    const removeSubsection = (secId: number, subsecId: number) => {
        let _toc = toc
        _toc.sections[secId].subsections = _toc.sections[secId].subsections.filter((subsec, id) => id != subsecId)
        setToc({ ..._toc })
        // setToc({ ...toc, sections: [...toc.sections.splice(secId)] })
    }

    React.useEffect(() => console.log(toc), [toc])


    return (
        <>
            <Stack tokens={{ padding: '2vh' }} style={{ boxShadow: Depths.depth8, display: 'flow', alignItems: 'center', justifyContent: 'center' }}>
                <Separator theme={theme}>Title</Separator>
                <Stack style={{ width: '80%' }}>

                    <Stack>
                        <TextField label="Project code" onChange={(e) => setProjectCode(e)} required />
                        <TextField label="Building name" onChange={(e) => setBuildingName(e)} required />
                        <TextField
                            label="Address"
                            multiline={multiline}
                            onChange={onOverflowedTextField}
                            required
                        />
                    </Stack>
                    <Separator theme={theme}>Content</Separator>
                    <Stack>
                        <Stack>
                            {toc?.sections?.map((sec, secId) =>
                                <>
                                    <Stack key={"stack_" + sec.sectionUuid} tokens={{ padding: '0vh 0 0 0' }} style={{ boxShadow: Depths.depth8, /*border: 'medium dashed green',*/ padding: '2vh 2vh 2vh 2vh' }}>
                                        <Stack key={"stackCancelAndSection_" + sec.sectionUuid} horizontal wrap style={{ /*background: "tomato"*/ margin: '0', padding: '0' }}>
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
                                                    >
                                                        {console.log("\n_________________________\nsectionNumber_" + sec.sectionUuid, "\n" + sec)}
                                                        <TextField label="Section number"
                                                            value={sec.section}
                                                            key={"sectionNumber_" + sec.sectionUuid}
                                                            onChange={(e) => setSection(e, secId)}
                                                            styles={{ fieldGroup: { width: 100 }, }}
                                                            required />
                                                    </StackItem>
                                                    <StackItem
                                                        key={"sectionStackItemTitle_" + sec.sectionUuid}
                                                    >
                                                        <TextField label="Section title"
                                                            value={sec.sectionTitle}
                                                            key={"sectionTitle_" + sec.sectionUuid}
                                                            onChange={(e) => setSectionTitle(e, secId)}
                                                            styles={{ fieldGroup: { width: 300 } }}
                                                            required />
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
                                                                <IconButton key={`"subsectionRemove_${sec.sectionUuid}_${subsec.subsectionUuid}}`} onClick={() => removeSubsection(secId, subsecId)} style={{ background: "pink", height: '100%' }} iconProps={{ iconName: 'Cancel' }} ariaLabel="Remove section" />
                                                            </TooltipHost>
                                                            <Stack
                                                                key={`"subsectionStackTitle_${sec.sectionUuid}_${subsec.subsectionUuid}}`}
                                                                style={{ padding: '0 0 1vh 1vh' }}>
                                                                <Stack
                                                                    key={`"subsectionStackHorizontalTitle_${sec.sectionUuid}_${subsec.subsectionUuid}}`}
                                                                    horizontal>
                                                                    <TextField label="Subsection stamp"
                                                                        key={`"subsectionStamp_${sec.sectionUuid}_${subsec.subsectionUuid}}`}
                                                                        onChange={(e) => setSubsectionStamp(e, secId, subsecId)}
                                                                        value={subsec.stamp}
                                                                        required />
                                                                    <TextField label="Subsection number"
                                                                        key={`"subsectionNumber_${sec.sectionUuid}_${subsec.subsectionUuid}}`}
                                                                        onChange={(e) => setSubsection(e, secId, subsecId)}
                                                                        value={subsec.subsection}
                                                                        /*required*/ />
                                                                </Stack>
                                                                <TextField label="Subsection title"
                                                                    key={`"subsectionTitle_${sec.sectionUuid}_${subsec.subsectionUuid}}`}
                                                                    onChange={(e) => setSubsectionTitle(e, secId, subsecId)}
                                                                    value={subsec.subsectionTitle} />
                                                                <Stack
                                                                    key={`"subsectionStackChapter_${sec.sectionUuid}_${subsec.subsectionUuid}}`}
                                                                    horizontal>
                                                                    <TextField label="Chapter number"
                                                                        key={`"chapterNumber_${sec.sectionUuid}_${subsec.subsectionUuid}}`}
                                                                        onChange={(e) => setChapter(e, secId, subsecId)}
                                                                        value={subsec.chapter} />
                                                                    <TextField label="Chapter title"
                                                                        key={`"chapterTitle_${sec.sectionUuid}_${subsec.subsectionUuid}}`}
                                                                        onChange={(e) => setChapterTitle(e, secId, subsecId)}
                                                                        value={subsec.chapterTitle} />
                                                                </Stack>
                                                                <Stack
                                                                    key={`"subsectionStackBook_${sec.sectionUuid}_${subsec.subsectionUuid}}`}
                                                                    horizontal>
                                                                    <TextField label="Book number"
                                                                        key={`"bookNumber_${sec.sectionUuid}_${subsec.subsectionUuid}}`}
                                                                        onChange={(e) => setBook(e, secId, subsecId)}
                                                                        value={subsec.book} />
                                                                    <TextField label="Book title"
                                                                        key={`"bookTitle_${sec.sectionUuid}_${subsec.subsectionUuid}}`}
                                                                        onChange={(e) => setBookTitle(e, secId, subsecId)}
                                                                        value={subsec.bookTitle} />
                                                                </Stack>
                                                                <Stack
                                                                    key={`"subsectionStackBlock_${sec.sectionUuid}_${subsec.subsectionUuid}}`}
                                                                    horizontal>
                                                                    <TextField label="Block"
                                                                        key={`"block_${sec.sectionUuid}_${subsec.subsectionUuid}}`}
                                                                        onChange={(e) => setBlock(e, secId, subsecId)}
                                                                        value={subsec.block} />
                                                                    <TextField label="Subblock"
                                                                        key={`"subblock_${sec.sectionUuid}_${subsec.subsectionUuid}}`}
                                                                        onChange={(e) => setSubblock(e, secId, subsecId)}
                                                                        value={subsec.subblock} />
                                                                </Stack>
                                                            </Stack>
                                                        </Stack>
                                                    </>
                                                )}
                                                <CommandBarButton key={`"addSubsection_${sec.sectionUuid}}`} onClick={() => addSubsection(secId)} iconProps={{ iconName: 'Add' }} text="Add subsection" />
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
                        <PrimaryButton onClick={() => docGenerator(toc)} text="Get project's ToC" />
                        {/* <a download="template" href="https://publiccdn.sharepointonline.com/marachdv.sharepoint.com/sites/cdntest/cdnpics/template003.docx">click</a> */}
                    </Stack>
                </Stack>
            </Stack>
        </>
    );
};


export default ProjDocTocGenerator;