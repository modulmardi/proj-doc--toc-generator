import {
  Depths,
  IconButton,
  Modal,
  MotionAnimations,
  Stack,
  TextField,
} from "@fluentui/react";
import { Pagination } from "@uifabric/experiments/lib/Pagination";
import { FieldArray, Form, Formik } from "formik";
import * as React from "react";
import { v4 as uuidv4 } from "uuid";
import * as yup from "yup";
import { Section, Subsection, Toc } from "../model/ToC";
import stringToColor from "../utils/stringToColor";
import BackContinueButtonGroup from "./BackContinueButtonGroup";
import {
  stylesAddButtonModalCentral,
  stylesAddButtonModalLateralLeft,
  stylesAddButtonModalLateralRight,
  stylesDeleteButtonModal,
} from "./styles/stylesButton";
import TablePreview from "./TablePreview";

interface IPropEditSectionModal {
  toc: Toc;
  isEditSectionModalOpen: boolean;
  hideEditSectionModal: () => void;
  currentEditableSection: Section;
  setCurrentEditableSection: React.Dispatch<React.SetStateAction<Section>>;
  setIsSectionEdited: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditSectionModal: React.FC<IPropEditSectionModal> = (props) => {
  const [currentSubsectionNumber, setCurrentSubsection] =
    React.useState<number>(0);
  const [modalAnimation, setModalAnimation] = React.useState<string>(
    MotionAnimations.slideRightIn
  );
  const _hideEditSectionModal = props.hideEditSectionModal;
  React.useEffect(
    () => setCurrentSubsection(0),
    [props.isEditSectionModalOpen]
  );

  React.useEffect(() => {
    if (modalAnimation != "") {
      setTimeout(() => {
        setModalAnimation("");
      }, 300);
    }
  }, [modalAnimation]);

  return (
    <>
      <Modal
        titleAriaId="edit"
        isOpen={props.isEditSectionModalOpen}
        onDismiss={props.hideEditSectionModal}
        isBlocking={false}
        styles={{
          main: {
            margin: 0,
            padding: 0,
            height: "100%",
            width: "100%",
            position: "relative",
            backgroundColor: "transparent",
            boxShadow: Depths.depth0,
          },
        }}
      >
        <Formik
          initialValues={{
            _section: props.currentEditableSection,
          }}
          validationSchema={yup.object().shape({
            _section: yup.object().shape({
              assignedTo: yup.string(),
              section: yup.string(),
              sectionTitle: yup.string(),
              sectionStamp: yup.string(),
              subsections: yup.array().of(
                yup.object().shape({
                  subsection: yup
                    .string()
                    .matches(
                      /^((\d+\.?)*\d+)?$/,
                      "Поле может содержать числа и точки между ними"
                    ),
                  subsectionTitle: yup.string(),
                  subsectionStamp: yup.string(),
                  chapter: yup
                    .string()
                    .matches(
                      /^((\d+\.?)*\d+)?$/,
                      "Поле может содержать числа и точки между ними"
                    ),
                  chapterTitle: yup.string(),
                  book: yup
                    .string()
                    .matches(
                      /^((\d+\.?)*\d+)?$/,
                      "Поле может содержать числа и точки между ними"
                    ),
                  bookTitle: yup.string(),
                  block: yup
                    .string()
                    .matches(
                      /^((\d+\.?)*\d+)?$/,
                      "Поле может содержать числа и точки между ними"
                    ),
                  subblock: yup
                    .string()
                    .matches(
                      /^((\d+\.?)*\d+)?$/,
                      "Поле может содержать числа и точки между ними"
                    ),
                })
              ),
            }),
          })}
          onSubmit={(values, formikHelpers): void | Promise<any> => {
            props.setCurrentEditableSection(values._section);

            props.setIsSectionEdited(true);
            props.hideEditSectionModal();
          }}
        >
          {({
            values,
            touched,
            errors,
            handleChange,
            handleBlur,
            handleSubmit,
            ...formikProps
          }) => (
            <>
              <Form>
                <FieldArray
                  name="_section.subsections"
                  render={(arrayHelpers) => (
                    <>
                      <div
                        style={{
                          position: "absolute",
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Stack
                          styles={{
                            root: {
                              position: "relative",
                              minWidth: "40vw",
                              minHeight: "30vh",
                              backgroundColor: "gray",
                            },
                          }}
                        >
                          {values?._section?.subsections?.length != 0 && (
                            <>
                              <IconButton
                                key={`modal_stack_subsec_sec_input_${values._section.subsections[currentSubsectionNumber].subsectionUuid}_delete`}
                                styles={{ ...stylesDeleteButtonModal }}
                                iconProps={{ iconName: "delete" }}
                                onClick={() => {
                                  setModalAnimation(
                                    MotionAnimations.slideDownOut
                                  );
                                  arrayHelpers.remove(currentSubsectionNumber);
                                  if (
                                    currentSubsectionNumber >=
                                      values?._section?.subsections?.length -
                                        1 &&
                                    !(currentSubsectionNumber == 0)
                                  )
                                    setCurrentSubsection(
                                      (previous) => previous - 1
                                    );
                                }}
                              />
                              <IconButton
                                key={`modal_stack_subsec_sec_input_${values._section.subsections[currentSubsectionNumber].subsectionUuid}_add_left`}
                                styles={{ ...stylesAddButtonModalLateralLeft }}
                                iconProps={{ iconName: "add" }}
                                onClick={() => {
                                  arrayHelpers.insert(currentSubsectionNumber, {
                                    ...values._section.subsections[
                                      currentSubsectionNumber
                                    ],
                                    subsectionUuid: uuidv4(),
                                  });
                                  setModalAnimation(
                                    MotionAnimations.slideRightIn
                                  );
                                }}
                              />
                              <IconButton
                                key={`modal_stack_subsec_sec_input_${values._section.subsections[currentSubsectionNumber].subsectionUuid}_add_right`}
                                styles={{ ...stylesAddButtonModalLateralRight }}
                                iconProps={{ iconName: "add" }}
                                onClick={() => {
                                  arrayHelpers.insert(
                                    currentSubsectionNumber + 1,
                                    {
                                      ...values._section.subsections[
                                        currentSubsectionNumber
                                      ],
                                      subsectionUuid: uuidv4(),
                                    }
                                  );
                                  setCurrentSubsection(
                                    (previous) => previous + 1
                                  );
                                  setModalAnimation(
                                    MotionAnimations.slideLeftIn
                                  );
                                }}
                              />
                            </>
                          )}
                          <Stack
                            styles={{
                              root: {
                                position: "relative",
                                minWidth: "40vw",
                                minHeight: "30vh",
                                backgroundColor: "white",
                                padding: "1vh",
                                boxShadow: Depths.depth64,
                                animation: modalAnimation,
                              },
                            }}
                          >
                            {values?._section?.subsections?.length == 0 && (
                              <IconButton
                                key={`modal_stack_subsec_input_add_central`}
                                styles={{ ...stylesAddButtonModalCentral }}
                                iconProps={{ iconName: "add" }}
                                onClick={() => {
                                  setCurrentSubsection(0);
                                  arrayHelpers.push(new Subsection());
                                  setModalAnimation(MotionAnimations.slideUpIn);
                                }}
                              />
                            )}
                            {values?._section?.subsections?.length > 0 && (
                              <>
                                <div
                                  style={{
                                    width: "100%",
                                    height: "0.5vh",
                                    backgroundColor: stringToColor(
                                      values._section.subsections[
                                        currentSubsectionNumber
                                      ].subsectionUuid
                                    ),
                                  }}
                                ></div>

                                <Pagination
                                  styles={{ root: { margin: "auto" } }}
                                  pageCount={values._section.subsections.length}
                                  selectedPageIndex={currentSubsectionNumber}
                                  onPageChange={(subsection) =>
                                    setCurrentSubsection(subsection)
                                  }
                                />

                                <Stack
                                  tokens={{ childrenGap: 10 }}
                                  styles={{ root: { marginBottom: "10vh" } }}
                                >
                                  <TextField
                                    placeholder="Шифр конкретного подраздела"
                                    name={`_section.subsections[${currentSubsectionNumber}].subsectionStamp`}
                                    key={`modal_stack_subsec_input_${values._section.subsections[currentSubsectionNumber].subsectionUuid}_subsectionStamp`}
                                    value={
                                      values._section.subsections[
                                        currentSubsectionNumber
                                      ]?.subsectionStamp
                                    }
                                    errorMessage={
                                      touched?._section?.subsections &&
                                      touched?._section?.subsections[
                                        currentSubsectionNumber
                                      ]?.subsectionStamp
                                        ? (
                                            errors?._section?.subsections[
                                              currentSubsectionNumber
                                            ] as Subsection
                                          )?.subsectionStamp
                                        : ""
                                    }
                                    styles={{ root: { width: "100%" } }}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                  />

                                  <TextField
                                    placeholder="Подраздел #"
                                    name={`_section.subsections[${currentSubsectionNumber}].subsection`}
                                    key={`modal_stack_subsec_input_${values._section.subsections[currentSubsectionNumber]?.subsectionUuid}_#`}
                                    value={
                                      values._section.subsections[
                                        currentSubsectionNumber
                                      ]?.subsection
                                    }
                                    errorMessage={
                                      touched?._section?.subsections &&
                                      touched?._section?.subsections[
                                        currentSubsectionNumber
                                      ]?.subsection
                                        ? (
                                            errors?._section?.subsections[
                                              currentSubsectionNumber
                                            ] as Subsection
                                          )?.subsection
                                        : ""
                                    }
                                    styles={{ root: { width: "100%" } }}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                  />

                                  <TextField
                                    placeholder="Наименование подраздела"
                                    name={`_section.subsections[${currentSubsectionNumber}].subsectionTitle`}
                                    key={`modal_stack_subsec_input_${values._section.subsections[currentSubsectionNumber]?.subsectionUuid}_subsectionTitle`}
                                    value={
                                      values._section.subsections[
                                        currentSubsectionNumber
                                      ]?.subsectionTitle
                                    }
                                    errorMessage={
                                      touched?._section?.subsections &&
                                      touched?._section?.subsections[
                                        currentSubsectionNumber
                                      ]?.subsectionTitle
                                        ? (
                                            errors?._section?.subsections[
                                              currentSubsectionNumber
                                            ] as Subsection
                                          )?.subsectionTitle
                                        : ""
                                    }
                                    multiline
                                    rows={1}
                                    autoAdjustHeight
                                    resizable={false}
                                    styles={{ root: { width: "100%" } }}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                  />

                                  <TextField
                                    placeholder="Часть #"
                                    name={`_section.subsections[${currentSubsectionNumber}].chapter`}
                                    key={`modal_stack_subsec_input_${values._section.subsections[currentSubsectionNumber]?.subsectionUuid}_chapter`}
                                    value={
                                      values._section.subsections[
                                        currentSubsectionNumber
                                      ]?.chapter
                                    }
                                    errorMessage={
                                      touched?._section?.subsections &&
                                      touched?._section?.subsections[
                                        currentSubsectionNumber
                                      ]?.chapter
                                        ? (
                                            errors?._section?.subsections[
                                              currentSubsectionNumber
                                            ] as Subsection
                                          )?.chapter
                                        : ""
                                    }
                                    styles={{ root: { width: "100%" } }}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                  />

                                  <TextField
                                    placeholder="Наименование части"
                                    name={`_section.subsections[${currentSubsectionNumber}].chapterTitle`}
                                    key={`modal_stack_subsec_input_${values._section.subsections[currentSubsectionNumber]?.subsectionUuid}_chapterTitle`}
                                    value={
                                      values._section.subsections[
                                        currentSubsectionNumber
                                      ]?.chapterTitle
                                    }
                                    errorMessage={
                                      touched?._section?.subsections &&
                                      touched?._section?.subsections[
                                        currentSubsectionNumber
                                      ]?.chapterTitle
                                        ? (
                                            errors?._section?.subsections[
                                              currentSubsectionNumber
                                            ] as Subsection
                                          )?.chapterTitle
                                        : ""
                                    }
                                    multiline
                                    rows={1}
                                    autoAdjustHeight
                                    resizable={false}
                                    styles={{ root: { width: "100%" } }}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                  />

                                  <TextField
                                    placeholder="Книга #"
                                    name={`_section.subsections[${currentSubsectionNumber}].book`}
                                    key={`modal_stack_subsec_input_${values._section.subsections[currentSubsectionNumber]?.subsectionUuid}_book`}
                                    value={
                                      values._section.subsections[
                                        currentSubsectionNumber
                                      ]?.book
                                    }
                                    errorMessage={
                                      touched?._section?.subsections &&
                                      touched?._section?.subsections[
                                        currentSubsectionNumber
                                      ]?.book
                                        ? (
                                            errors?._section?.subsections[
                                              currentSubsectionNumber
                                            ] as Subsection
                                          )?.book
                                        : ""
                                    }
                                    styles={{ root: { width: "100%" } }}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                  />

                                  <TextField
                                    placeholder="Название книги"
                                    name={`_section.subsections[${currentSubsectionNumber}].bookTitle`}
                                    key={`modal_stack_subsec_input_${values._section.subsections[currentSubsectionNumber]?.subsectionUuid}_bookTitle`}
                                    value={
                                      values._section.subsections[
                                        currentSubsectionNumber
                                      ]?.bookTitle
                                    }
                                    errorMessage={
                                      touched?._section?.subsections &&
                                      touched?._section?.subsections[
                                        currentSubsectionNumber
                                      ]?.bookTitle
                                        ? (
                                            errors?._section?.subsections[
                                              currentSubsectionNumber
                                            ] as Subsection
                                          )?.bookTitle
                                        : ""
                                    }
                                    multiline
                                    rows={1}
                                    autoAdjustHeight
                                    resizable={false}
                                    styles={{ root: { width: "100%" } }}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                  />

                                  <TextField
                                    placeholder="Корпус"
                                    name={`_section.subsections[${currentSubsectionNumber}].block`}
                                    key={`modal_stack_subsec_input_${values._section.subsections[currentSubsectionNumber]?.subsectionUuid}_block`}
                                    value={
                                      values._section.subsections[
                                        currentSubsectionNumber
                                      ]?.block
                                    }
                                    errorMessage={
                                      touched?._section?.subsections &&
                                      touched?._section?.subsections[
                                        currentSubsectionNumber
                                      ]?.block
                                        ? (
                                            errors?._section?.subsections[
                                              currentSubsectionNumber
                                            ] as Subsection
                                          )?.block
                                        : ""
                                    }
                                    styles={{ root: { width: "100%" } }}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                  />

                                  <TextField
                                    placeholder="Подкорпус"
                                    name={`_section.subsections[${currentSubsectionNumber}].subblock`}
                                    key={`modal_stack_subsec_input_${values._section.subsections[currentSubsectionNumber]?.subsectionUuid}_subblock`}
                                    value={
                                      values._section.subsections[
                                        currentSubsectionNumber
                                      ]?.subblock
                                    }
                                    errorMessage={
                                      touched?._section?.subsections &&
                                      touched?._section?.subsections[
                                        currentSubsectionNumber
                                      ]?.subblock
                                        ? (
                                            errors?._section?.subsections[
                                              currentSubsectionNumber
                                            ] as Subsection
                                          )?.subblock
                                        : ""
                                    }
                                    styles={{ root: { width: "100%" } }}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                  />

                                  <TablePreview
                                    toc={props.toc}
                                    section={values._section}
                                    currentSubsectionNumber={
                                      currentSubsectionNumber
                                    }
                                    errors={errors?._section}
                                  />
                                </Stack>
                              </>
                            )}

                            <BackContinueButtonGroup
                              onClickBack={_hideEditSectionModal}
                              onClickContinue={() => handleSubmit()}
                            />
                          </Stack>
                        </Stack>
                      </div>
                    </>
                  )}
                />
              </Form>
            </>
          )}
        </Formik>
      </Modal>
    </>
  );
};

export default EditSectionModal;
