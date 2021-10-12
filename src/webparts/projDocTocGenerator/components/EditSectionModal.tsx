import { DefaultButton, Depths, IconButton, Modal, PrimaryButton, Stack, TextField } from '@fluentui/react';
import { Pagination } from '@uifabric/experiments/lib/Pagination';
import { FieldArray, Form, Formik } from 'formik';
import * as React from 'react';
import { Section, Subsection, Toc } from '../model/ToC';
import "./style.scss";
import { stylesAddButtonModalCentral, stylesAddButtonModalLateralLeft, stylesAddButtonModalLateralRight, stylesDeleteButtonModal } from './styles/stylesButton';
import stringToColor from '../utils/stringToColor'

interface IPropEditSectionModal {
    toc: Toc
    isEditSectionModalOpen: boolean
    hideEditSectionModal: () => void
    currentEditableSection: Section
    setCurrentEditableSection: React.Dispatch<React.SetStateAction<Section>>
    setIsSectionEdited: React.Dispatch<React.SetStateAction<boolean>>
}

const EditSectionModal: React.FC<IPropEditSectionModal> = (props) => {

    const [currentSubsection, setCurrentSubsection] = React.useState<number>(0)
    const _hideEditSectionModal = props.hideEditSectionModal
    React.useEffect(() => setCurrentSubsection(0), [props.isEditSectionModalOpen])

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
                                    {console.log("DEBUUUUUUG", values._section)}
                                    <div style={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Stack styles={{ root: { position: 'relative', minWidth: '40vw', minHeight: '30vh', backgroundColor: 'white', padding: '1vh', boxShadow: Depths.depth64 } }}>
                                            {values?._section?.subsections?.length == 0 &&

                                                <IconButton key={`modal_stack_subsec_input_add_central`}
                                                    styles={{ ...stylesAddButtonModalCentral }} iconProps={{ iconName: "add", }}
                                                    onClick={() => { setCurrentSubsection(0); arrayHelpers.push(new Subsection()) }} />

                                            }
                                            {values?._section?.subsections?.length > 0 &&
                                                <>

                                                    <IconButton key={`modal_stack_subsec_sec_input_${values._section.subsections[currentSubsection].subsectionUuid}_delete`}
                                                        styles={{ ...stylesDeleteButtonModal }} iconProps={{ iconName: "delete", }}
                                                        onClick={() => {

                                                            console.log(currentSubsection,);
                                                            arrayHelpers.remove(currentSubsection)
                                                            if ((currentSubsection >= values?._section?.subsections?.length - 1) && !(currentSubsection == 0)) setCurrentSubsection((previous) => previous - 1)
                                                        }} />
                                                    <IconButton key={`modal_stack_subsec_sec_input_${values._section.subsections[currentSubsection].subsectionUuid}_add_left`}
                                                        styles={{ ...stylesAddButtonModalLateralLeft }} iconProps={{ iconName: "add", }}
                                                        onClick={() => {
                                                            arrayHelpers.insert(currentSubsection, new Subsection())

                                                        }} />
                                                    <IconButton key={`modal_stack_subsec_sec_input_${values._section.subsections[currentSubsection].subsectionUuid}_add_right`}
                                                        styles={{ ...stylesAddButtonModalLateralRight }} iconProps={{ iconName: "add", }}
                                                        onClick={() => {
                                                            arrayHelpers.insert(currentSubsection + 1, new Subsection())
                                                            setCurrentSubsection((previous) => previous + 1)
                                                        }} />

                                                    <div style={{ width: '100%', height: '2vh', backgroundColor: stringToColor(values._section.subsections[currentSubsection].subsectionUuid) }}>

                                                    </div>

                                                    <Pagination pageCount={values._section.subsections.length}
                                                        selectedPageIndex={currentSubsection}
                                                        onPageChange={(subsection) => setCurrentSubsection(subsection)}
                                                    />


                                                    <Stack styles={{ root: { marginBottom: '10vh' } }} >
                                                        <TextField placeholder="Шифр подраздела (Перезаписывает шифр раздела!!!)" name={`_section.subsections[${currentSubsection}].subsectionStamp`}
                                                            key={`modal_stack_subsec_input_${values._section.subsections[currentSubsection].subsectionUuid}_subsectionStamp`}
                                                            value={values._section.subsections[currentSubsection]?.subsectionStamp}

                                                            borderless underlined styles={{ root: { width: '100%' } }} onChange={formikProps.handleChange} />

                                                        <TextField placeholder="Подраздел #" name={`_section.subsections[${currentSubsection}].subsection`}
                                                            key={`modal_stack_subsec_input_${values._section.subsections[currentSubsection]?.subsectionUuid}_#`}
                                                            value={values._section.subsections[currentSubsection]?.subsection}

                                                            borderless underlined styles={{ root: { width: '100%' } }} onChange={formikProps.handleChange} />

                                                        <TextField placeholder="Наименование подраздела" name={`_section.subsections[${currentSubsection}].subsectionTitle`}
                                                            key={`modal_stack_subsec_input_${values._section.subsections[currentSubsection]?.subsectionUuid}_subsectionTitle`}
                                                            value={values._section.subsections[currentSubsection]?.subsectionTitle}

                                                            multiline autoAdjustHeight resizable={false} borderless underlined styles={{ root: { width: '100%' } }} onChange={formikProps.handleChange} />

                                                        <TextField placeholder="Часть #" name={`_section.subsections[${currentSubsection}].chapter`}
                                                            key={`modal_stack_subsec_input_${values._section.subsections[currentSubsection]?.subsectionUuid}_chapter`}
                                                            value={values._section.subsections[currentSubsection]?.chapter}

                                                            borderless underlined styles={{ root: { width: '100%' } }} onChange={formikProps.handleChange} />

                                                        <TextField placeholder="Наименование части" name={`_section.subsections[${currentSubsection}].chapterTitle`}
                                                            key={`modal_stack_subsec_input_${values._section.subsections[currentSubsection]?.subsectionUuid}_chapterTitle`}
                                                            value={values._section.subsections[currentSubsection]?.chapterTitle}

                                                            multiline autoAdjustHeight resizable={false} borderless underlined styles={{ root: { width: '100%' } }} onChange={formikProps.handleChange} />

                                                        <TextField placeholder="Книга #" name={`_section.subsections[${currentSubsection}].book`}
                                                            key={`modal_stack_subsec_input_${values._section.subsections[currentSubsection]?.subsectionUuid}_book`}
                                                            value={values._section.subsections[currentSubsection]?.book}

                                                            borderless underlined styles={{ root: { width: '100%' } }} onChange={formikProps.handleChange} />

                                                        <TextField placeholder="Название книги" name={`_section.subsections[${currentSubsection}].bookTitle`}
                                                            key={`modal_stack_subsec_input_${values._section.subsections[currentSubsection]?.subsectionUuid}_bookTitle`}
                                                            value={values._section.subsections[currentSubsection]?.bookTitle}

                                                            multiline autoAdjustHeight resizable={false} borderless underlined styles={{ root: { width: '100%' } }} onChange={formikProps.handleChange} />

                                                        <TextField placeholder="Корпус" name={`_section.subsections[${currentSubsection}].block`}
                                                            key={`modal_stack_subsec_input_${values._section.subsections[currentSubsection]?.subsectionUuid}_block`}
                                                            value={values._section.subsections[currentSubsection]?.block} //наверное должно набираться *тэгами*

                                                            borderless underlined styles={{ root: { width: '100%' } }} onChange={formikProps.handleChange} />

                                                        <TextField placeholder="Подкорпус" name={`_section.subsections[${currentSubsection}].subblock`}
                                                            key={`modal_stack_subsec_input_${values._section.subsections[currentSubsection]?.subsectionUuid}_subblock`}
                                                            value={values._section.subsections[currentSubsection]?.subblock}

                                                            borderless underlined styles={{ root: { width: '100%' } }} onChange={formikProps.handleChange} />

                                                        <div>
                                                            <table  >
                                                                <tr>
                                                                    <th style={{ width: '15%' }}>№/№</th>
                                                                    <th style={{ width: '15%' }}>ОБОЗНАЧЕНИЕ</th>
                                                                    <th style={{ width: '60%' }}>НАИМЕНОВАНИЕ</th>
                                                                    <th style={{ width: '10%' }}>ПРИМЕЧАНИЕ</th>
                                                                </tr>
                                                                <tr>
                                                                    <td colSpan={4}>
                                                                        Раздел {values._section.section}. {values._section.sectionTitle}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>
                                                                        {values._section.section}
                                                                        {values._section.subsections[currentSubsection].subsection != '' ?
                                                                            '.' + values._section.subsections[currentSubsection].subsection
                                                                            : ''
                                                                        }
                                                                        {values._section.subsections[currentSubsection].chapter != '' ?
                                                                            '.' + values._section.subsections[currentSubsection].chapter
                                                                            : ''
                                                                        }
                                                                        {values._section.subsections[currentSubsection].book != '' ?
                                                                            '.' + values._section.subsections[currentSubsection].book
                                                                            : ''
                                                                        }
                                                                    </td>
                                                                    <td>
                                                                        {props.toc.projectCode}
                                                                        {values._section.subsections[currentSubsection].block != '' ?
                                                                            '-' + values._section.subsections[currentSubsection].block
                                                                            : ''
                                                                        }
                                                                        {values._section.subsections[currentSubsection].subblock != '' ?
                                                                            '.' + values._section.subsections[currentSubsection].subblock
                                                                            : ''
                                                                        }
                                                                        -
                                                                        {values._section.subsections[currentSubsection].subsectionStamp || values._section.sectionStamp}
                                                                        {values._section.subsections[currentSubsection].subsection}
                                                                        {values._section.subsections[currentSubsection].chapter != '' ?
                                                                            '.' + values._section.subsections[currentSubsection].chapter
                                                                            : ''
                                                                        }
                                                                        {values._section.subsections[currentSubsection].book != '' ?
                                                                            '.' + values._section.subsections[currentSubsection].book
                                                                            : ''
                                                                        }
                                                                    </td>
                                                                    <td>
                                                                        Раздел {values._section.section}. {values._section.sectionTitle}.

                                                                        {values._section.subsections[currentSubsection].subsection != '' ?
                                                                            ' Подраздел ' + values._section.subsections[currentSubsection].subsection + '.'
                                                                            + (values._section.subsections[currentSubsection].subsectionTitle != '' ?
                                                                                ' ' + values._section.subsections[currentSubsection].subsectionTitle : '') + '.'
                                                                            : ''
                                                                        }
                                                                        {values._section.subsections[currentSubsection].chapter != '' ?
                                                                            ' Часть ' + values._section.subsections[currentSubsection].chapter + '.'
                                                                            + (values._section.subsections[currentSubsection].chapterTitle != '' ?
                                                                                ' ' + values._section.subsections[currentSubsection].chapterTitle : '') + '.'
                                                                            : ''
                                                                        }
                                                                        {values._section.subsections[currentSubsection].book != '' ?
                                                                            ' Книга ' + values._section.subsections[currentSubsection].book + '.'
                                                                            + (values._section.subsections[currentSubsection].bookTitle != '' ?
                                                                                ' ' + values._section.subsections[currentSubsection].bookTitle : '') + '.'
                                                                            : ''
                                                                        }
                                                                        {values._section.subsections[currentSubsection].block != '' ?
                                                                            ' Корпус ' + values._section.subsections[currentSubsection].block + '.'
                                                                            + (values._section.subsections[currentSubsection].subblock != '' ?
                                                                                '' + values._section.subsections[currentSubsection].subblock : '')
                                                                            : ''
                                                                        }
                                                                    </td>
                                                                    <td></td>
                                                                </tr>
                                                            </table>
                                                        </div>
                                                    </Stack>


                                                </>}
                                            <Stack horizontal style={{ position: 'absolute', bottom: '5%', margin: '0 10% 0 10%', width: '80%', padding: '0' }}>
                                                <DefaultButton text="Назад" onClick={_hideEditSectionModal} style={{ width: '100%' }} />
                                                <PrimaryButton text="Продолжить" type='submit' onClick={() => formikProps.handleSubmit()} style={{ width: '100%' }} />
                                            </Stack>
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