import { useBoolean } from '@fluentui/react-hooks';
import { Separator } from '@fluentui/react/lib/Separator';
import { createTheme, ITheme } from '@fluentui/react/lib/Styling';
import { TextField } from '@fluentui/react/lib/TextField';
import { CommandBarButton, PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { Stack, StackItem } from 'office-ui-fabric-react/lib/Stack';
import * as React from 'react';
import { IProjDocTocGeneratorProps } from './props/IProjDocTocGeneratorProps';


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
}

class Section {
    public section: number
    public sectionTitle: string
    public subsections: Subsection[]

}
class Subsection {
    public subsection: number
    public subsectionTitle: string
    public chapter: number
    public chapterTitle: string
    public book: number
    public bookTitle: string
    public block: number
    public subblock: number
}


const ProjDocTocGenerator: React.FC<IProjDocTocGeneratorProps> = (props) => {
    const onOverflowedTextField = (ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newText: string): void => {
        const newMultiline = newText.length > 40;
        if (newMultiline !== multiline) {
            toggleMultiline();
        }
    };
    let [toc, setToc] = React.useState<Toc>(new Toc())

    const [multiline, { toggle: toggleMultiline }] = useBoolean(false);


    const addSection = () => {
        setToc((toc) => {
            if (toc.sections) return new Toc() // TODO!!!
        })
    }

    const addSubsection = () => {

    }


    return (
        <>
            <Stack title="lol" tokens={{padding: '10vh 0 10vh 0'}}>
                <Separator theme={theme}>Title</Separator>
                <Stack >
                    <TextField label="Building name" required></TextField>
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
                        {toc?.sections?.map(() =>
                            <>
                                <TextField label="Sectoin number" required></TextField>
                                <TextField label="Section name" required></TextField>
                                <CommandBarButton onClick={addSubsection} iconProps={{ iconName: 'Add' }} text="Add subsection" />
                            </>
                        )
                        }
                    </Stack>
                    <CommandBarButton onClick={addSection} iconProps={{ iconName: 'Add' }} text="Add section" />
                </Stack>
                <Stack>
                    <PrimaryButton>Get project's ToC</PrimaryButton>
                </Stack>
            </Stack>
        </>
    );
};


export default ProjDocTocGenerator;