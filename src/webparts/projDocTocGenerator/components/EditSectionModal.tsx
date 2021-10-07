import { DefaultButton, IconButton, Modal, PrimaryButton, Stack, TextField } from '@fluentui/react';
import { FieldArray, Form, Formik } from 'formik';
import * as React from 'react';
import { Section, Subsection } from '../model/ToC';

interface IPropEditSectionModal {
    isEditSectionModalOpen: boolean
    hideEditSectionModal: () => void
    currentEditableSection: Section
    setCurrentEditableSection: React.Dispatch<React.SetStateAction<Section>>
    setIsSectionEdited: React.Dispatch<React.SetStateAction<boolean>>
}

const EditSectionModal: React.FC<IPropEditSectionModal> = (props) => {

    const _hideEditSectionModal = props.hideEditSectionModal
    return <>
        <Modal
            titleAriaId="edit"
            isOpen={props.isEditSectionModalOpen}
            onDismiss={props.hideEditSectionModal}
            isBlocking={false}
            styles={{ main: { height: 'wrap-content', width: '40vw', borderRadius: '0,5vh', padding: '2vh 2vw', position: 'relative' } }}
        >
            <Formik
                initialValues={{
                    _section: props.currentEditableSection,
                }}
                onSubmit={(values, formikHelpers): void | Promise<any> => {
                    props.setCurrentEditableSection(values._section)
                    console.log(">>>>>>>>>>>>>", values._section);

                    props.setIsSectionEdited(true)
                    props.hideEditSectionModal()
                }}>
                {(props) => <>
                    <Form>
                        <FieldArray
                            name='_section.subsections'
                            render={arrayHelpers =>
                                <>
                                    {props?.values?._section?.subsections?.length == 0 &&
                                        <IconButton key={`modal_stack_subsec_input_add`}
                                            styles={{ /*...stylesAddButtonLateral*/ }} iconProps={{ iconName: "add", }}
                                            onClick={() => arrayHelpers.push(new Section())} />
                                    }
                                    {props?.values?._section?.subsections?.length > 0 &&
                                        props.values._section.subsections.map((subsection, subsectionId, subsections) =>
                                            <>
                                                <Stack>
                                                    <TextField placeholder="Шифр подраздела (Перезаписывает шифр раздела!!!)" name={`_section.subsections[${subsectionId}].stamp`}
                                                        key={`modal_stack_subsec_input_${subsection.subsectionUuid}_stamp`}
                                                        value={subsection?.stamp}

                                                        borderless underlined styles={{ root: { width: '100%' } }} onChange={props.handleChange} />

                                                    <TextField placeholder="Подраздел #" name={`_section.subsections[${subsectionId}].subsection`}
                                                        key={`modal_stack_subsec_input_${subsection.subsectionUuid}_#`}
                                                        value={subsection?.subsection}

                                                        borderless underlined styles={{ root: { width: '100%' } }} onChange={props.handleChange} />

                                                    <TextField placeholder="Наименование подраздела" name={`_section.subsections[${subsectionId}].subsectionTitle`}
                                                        key={`modal_stack_subsec_input_${subsection.subsectionUuid}_subsectionTitle`}
                                                        value={subsection?.subsectionTitle}

                                                        multiline borderless underlined styles={{ root: { width: '100%' } }} onChange={props.handleChange} />

                                                    <TextField placeholder="Часть #" name={`_section.subsections[${subsectionId}].chapter`}
                                                        key={`modal_stack_subsec_input_${subsection.subsectionUuid}_chapter`}
                                                        value={subsection?.chapter}

                                                        borderless underlined styles={{ root: { width: '100%' } }} onChange={props.handleChange} />

                                                    <TextField placeholder="Наименование части" name={`_section.subsections[${subsectionId}].chapterTitle`}
                                                        key={`modal_stack_subsec_input_${subsection.subsectionUuid}_chapterTitle`}
                                                        value={subsection?.chapterTitle}

                                                        multiline borderless underlined styles={{ root: { width: '100%' } }} onChange={props.handleChange} />

                                                    <TextField placeholder="Книга #" name={`_section.subsections[${subsectionId}].book`}
                                                        key={`modal_stack_subsec_input_${subsection.subsectionUuid}_book`}
                                                        value={subsection?.book}

                                                        borderless underlined styles={{ root: { width: '100%' } }} onChange={props.handleChange} />

                                                    <TextField placeholder="Название книги" name={`_section.subsections[${subsectionId}].bookTitle`}
                                                        key={`modal_stack_subsec_input_${subsection.subsectionUuid}_bookTitle`}
                                                        value={subsection?.bookTitle}

                                                        multiline borderless underlined styles={{ root: { width: '100%' } }} onChange={props.handleChange} />

                                                    <TextField placeholder="Корпус" name={`_section.subsections[${subsectionId}].block`}
                                                        key={`modal_stack_subsec_input_${subsection.subsectionUuid}_block`}
                                                        value={subsection?.block} //наверное должно набираться *тэгами*

                                                        borderless underlined styles={{ root: { width: '100%' } }} onChange={props.handleChange} />

                                                    <TextField placeholder="Подкорпус" name={`_section.subsections[${subsectionId}].subblock`}
                                                        key={`modal_stack_subsec_input_${subsection.subsectionUuid}_subblock`}
                                                        value={subsection?.subblock}

                                                        borderless underlined styles={{ root: { width: '100%' } }} onChange={props.handleChange} />
                                                </Stack>

                                                <Stack horizontal style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', padding: '1vh 0 0 0' }}>
                                                    <DefaultButton text="Назад" onClick={_hideEditSectionModal} style={{ width: '100%' }} />
                                                    <PrimaryButton text="Продолжить" type='submit' onClick={() => props.handleSubmit()} style={{ width: '100%' }} />
                                                </Stack>

                                            </>)}
                                </>} />
                    </Form>
                </>}

            </Formik>
        </Modal>
    </>
}

export default EditSectionModal