import {
  Depths,
  Dropdown,
  IComboBox,
  IComboBoxOption,
  IconButton,
  MessageBar,
  MessageBarType,
  PrimaryButton,
  Stack,
  TextField,
  Toggle
} from "@fluentui/react";
import { useBoolean } from "@fluentui/react-hooks";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { ErrorMessage, FieldArray, Form, Formik, FormikHelpers } from "formik";
import * as React from "react";
import * as yup from "yup";
import { Section, Subsection, Toc } from "../model/ToC";
import docGenerator from "../utils/docGenerator";
import { docxFileUploader, jsonTocFileUploader } from "../utils/fileSaver";
import EditSectionModal from "./EditSectionModal";
import GenerateSectionsModal from "./GenerateSectionsModal";
import {
  stylesAddButtonBig,
  stylesAddButtonLateral,
  stylesDeleteButtonLateral,
  stylesEditButtonLateral
} from "./styles/stylesButton";

interface ITocFormProps {
  toc: Toc;
  setToc: React.Dispatch<React.SetStateAction<Toc>>;
  existingFiles: IComboBoxOption[];
  tocFolder: string;
  docxFolder: string;
  context: WebPartContext;
  currentDriveId: string;
  fetchExistingFiles: () => void;
}

interface formikValues {
  _toc: Toc;
  operationStatus: string;
}

function fillEmptySectionsWithSubsections(_toc: Toc): Toc {
  _toc.sections = _toc.sections.map((section) =>
    section.subsections.length > 0
      ? section
      : { ...section, subsections: [new Subsection()] }
  );
  return _toc;
}

const requiredFieldMessage = "Поле обязательно для заполнения";

const TocForm: React.FC<ITocFormProps> = (props: ITocFormProps) => {
  const [
    isEditSectionModalOpen,
    { setTrue: showEditSectionModal, setFalse: hideEditSectionModal },
  ] = useBoolean(false);

  const [isNewFile, { toggle: toggleIsNewFile }] = useBoolean(true);
  const [currentFileName, setCurrentFileName] = React.useState<string>("");
  const [fileNameError, setFileNameError] = React.useState("");

  const [currentEditableSection, setCurrentEditableSection] =
    React.useState<Section>(null);
  const [currentEditableSectionNumber, setCurrentEditableSectionNumber] =
    React.useState<number>(null);
  const [isSectionEdited, setIsSectionEdited] = React.useState<boolean>(false);

  React.useEffect(() => {
    props.fetchExistingFiles();
  }, [currentFileName]);

  const replacer = React.useRef<(index: number, value: any) => void>(null);

  const validateCurrentFileName = (newText: string) => {
    setFileNameError("");

    if (!props.existingFiles) {
      return;
    }

    if (
      isNewFile &&
      props.existingFiles?.filter((file) => file.text == newText)?.length != 0
    ) {
      setFileNameError("Это имя занято");
      return;
    }
    if (newText.length == 0) {
      setFileNameError(requiredFieldMessage);
    }
  };
  const onNewFileNameChange = (
    e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newText: string
  ): void => {
    setCurrentFileName(newText);
    validateCurrentFileName(newText);
  };
  const onExistingFileNameChange = (
    e: React.FormEvent<IComboBox | HTMLOptionElement | HTMLDivElement>,
    option: IComboBoxOption
  ): void => {
    setCurrentFileName(option.text);
  };

  const onNewFileToggleChange = () => {
    isNewFile
      ? setCurrentFileName(props.existingFiles[0].text)
      : setCurrentFileName("");
    toggleIsNewFile();
  };

  React.useEffect(() => {
    if (isSectionEdited) {
      replacer.current(currentEditableSectionNumber, currentEditableSection);
      setIsSectionEdited(false);
    }
  }, [isSectionEdited]);

  return (
    <>
      <Formik
        initialValues={{
          _toc: props.toc,
          operationStatus: "",
        }}
        validationSchema={yup.object().shape({
          _toc: yup.object().shape({
            buildingName: yup.string().required(requiredFieldMessage),
            address: yup.string().required(requiredFieldMessage),
            projectCode: yup.string().required(requiredFieldMessage),
            projectStage: yup.string().required(requiredFieldMessage),
            gipName: yup
              .string()
              .required(requiredFieldMessage)
              .matches(
                /^([а-яА-Я]-?)*([а-яА-Я])+$/,
                "Поле может содержать кириллические символы"
              ),
            gapName: yup
              .string()
              .required(requiredFieldMessage)
              .matches(
                /^([а-яА-Я]-?)*([а-яА-Я])+$/,
                "Поле может содержать кириллические символы"
              ),
            nContr: yup
              .string()
              .required(requiredFieldMessage)
              .matches(
                /^([а-яА-Я]-?)*([а-яА-Я])+$/,
                "Поле может содержать кириллические символы"
              ),
            sections: yup.array().of(
              yup.object().shape({
                section: yup
                  .string()
                  .required(requiredFieldMessage)
                  .matches(
                    /^(\d+\.?)*\d+$/,
                    "Поле может содержать числа и точки между ними"
                  ),
                sectionTitle: yup.string().required(requiredFieldMessage),
                sectionStamp: yup.string(),
                assignedTo: yup
                  .string()
                  .required(requiredFieldMessage)
                  .matches(
                    /^([а-яА-Я]-?)*([а-яА-Я])+$/,
                    "Поле может содержать кириллические символы"
                  ),
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
              })
            ),
          }),
        })}
        enableReinitialize
        onSubmit={(
          values: formikValues,
          formikHelpers: FormikHelpers<formikValues>
        ): void | Promise<any> => {
          validateCurrentFileName(currentFileName);
          if (fileNameError === "" && currentFileName !== "") {
            try {
              return docGenerator(
                props.context,
                props.currentDriveId,
                currentFileName,
                props.tocFolder,
                props.docxFolder,
                fillEmptySectionsWithSubsections(values._toc),
                jsonTocFileUploader,
                docxFileUploader,
                (message: string) =>
                  formikHelpers.setFieldValue("operationStatus", message)
              );
            } catch (docGeneratorError) {
              formikHelpers.setFieldValue("operationStatus", "error");
            }
          }
        }}
      >
        {({
          values,
          touched,
          errors,
          handleBlur,
          handleChange,
          handleSubmit,
          setFieldValue,
          ...formikProps
        }) => (
          <>
            <Form>
              <h2>Данные проекта</h2>
              <Stack tokens={{ childrenGap: 10 }}>
                <TextField
                  placeholder="Название объекта"
                  name={`_toc.buildingName`}
                  value={values._toc.buildingName}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  multiline
                  autoAdjustHeight
                  resizable={false}
                />
                <ErrorMessage
                  render={(msg) => (
                    <>
                      <span style={{ color: "red " }}>{msg}</span>
                    </>
                  )}
                  name={`_toc.buildingName`}
                />

                <TextField
                  placeholder="Адрес"
                  name={`_toc.address`}
                  value={values._toc.address}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  multiline
                  autoAdjustHeight
                  resizable={false}
                />
                <ErrorMessage
                  render={(msg) => (
                    <>
                      <span style={{ color: "red " }}>{msg}</span>
                    </>
                  )}
                  name={`_toc.address`}
                />

                <Stack tokens={{ childrenGap: 10 }} horizontal>
                  <Stack styles={{ root: { width: "100%" } }}>
                    <TextField
                      placeholder="Код проекта"
                      name={`_toc.projectCode`}
                      value={values._toc.projectCode}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      styles={{ root: { width: "100%" } }}
                    />
                    <ErrorMessage
                      render={(msg) => (
                        <>
                          <span style={{ color: "red " }}>{msg}</span>
                        </>
                      )}
                      name={`_toc.projectCode`}
                    />
                  </Stack>
                  <Stack styles={{ root: { width: "100%" } }}>
                    <TextField
                      placeholder="Стадия проекта"
                      name={`_toc.projectStage`}
                      value={values._toc.projectStage}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      styles={{ root: { width: "100%" } }}
                    />
                    <ErrorMessage
                      render={(msg) => (
                        <>
                          <span style={{ color: "red " }}>{msg}</span>
                        </>
                      )}
                      name={`_toc.projectStage`}
                    />
                  </Stack>
                </Stack>
                <TextField
                  placeholder="ГИП"
                  name={`_toc.gipName`}
                  value={values._toc.gipName}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
                <ErrorMessage
                  render={(msg) => (
                    <>
                      <span style={{ color: "red " }}>{msg}</span>
                    </>
                  )}
                  name={`_toc.gipName`}
                />

                <TextField
                  placeholder="ГАП"
                  name={`_toc.gapName`}
                  value={values._toc.gapName}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
                <ErrorMessage
                  render={(msg) => (
                    <>
                      <span style={{ color: "red " }}>{msg}</span>
                    </>
                  )}
                  name={`_toc.gapName`}
                />

                <TextField
                  placeholder="Н. Контр"
                  name={`_toc.nContr`}
                  value={values._toc.nContr}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
                <ErrorMessage
                  render={(msg) => (
                    <>
                      <span style={{ color: "red " }}>{msg}</span>
                    </>
                  )}
                  name={`_toc.nContr`}
                />
              </Stack>

              <h2>Разделы</h2>

              <GenerateSectionsModal
                setTocSections={(sections: Section[]) => {
                  setFieldValue("_toc.sections", sections);
                }}
              />
              <FieldArray
                name="_toc.sections"
                render={(arrayHelpers) => (
                  <>
                    <EditSectionModal
                      toc={values._toc}
                      isEditSectionModalOpen={isEditSectionModalOpen}
                      hideEditSectionModal={hideEditSectionModal}
                      currentEditableSection={currentEditableSection}
                      setIsSectionEdited={setIsSectionEdited}
                      setCurrentEditableSection={setCurrentEditableSection}
                    />
                    {values._toc?.sections?.length > 0 &&
                      values._toc?.sections?.map(
                        (section, sectionId, sections) => (
                          <>
                            <Stack
                              key={`stack_sec_add_top`}
                              tokens={{ padding: "0" }}
                              style={{
                                boxShadow: Depths.depth8,
                                display: "flow",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              {sectionId == 0 && (
                                <IconButton
                                  styles={stylesAddButtonBig}
                                  iconProps={{ iconName: "add" }}
                                  onClick={() =>
                                    arrayHelpers.insert(
                                      sectionId,
                                      new Section()
                                    )
                                  }
                                />
                              )}
                            </Stack>
                            <div style={{ position: "relative" }}>
                              <Stack
                                key={`stack_sec_input_${sections[sectionId].sectionUuid}`}
                                tokens={{ padding: "2vh", childrenGap: 10 }}
                                style={{
                                  boxShadow: Depths.depth8,
                                  display: "flow",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                {sectionId > 0 && (
                                  <IconButton
                                    key={`stack_sec_input_${sections[sectionId].sectionUuid}_add`}
                                    styles={{ ...stylesAddButtonLateral }}
                                    iconProps={{ iconName: "add" }}
                                    onClick={() =>
                                      arrayHelpers.insert(
                                        sectionId,
                                        new Section()
                                      )
                                    }
                                  />
                                )}
                                <IconButton
                                  key={`stack_sec_input_${sections[sectionId].sectionUuid}_edit`}
                                  styles={stylesEditButtonLateral}
                                  iconProps={{ iconName: "edit" }}
                                  onClick={() => {
                                    setCurrentEditableSection(section);
                                    setCurrentEditableSectionNumber(sectionId);
                                    replacer.current = arrayHelpers.replace;
                                    if (section.subsections.length == 0) {
                                      const _section = section;
                                      _section.subsections.push(
                                        new Subsection()
                                      );
                                      arrayHelpers.replace(sectionId, _section);
                                    }
                                    showEditSectionModal();
                                  }}
                                />
                                <IconButton
                                  key={`stack_sec_input_${sections[sectionId].sectionUuid}_delete`}
                                  styles={stylesDeleteButtonLateral}
                                  iconProps={{ iconName: "delete" }}
                                  onClick={() => arrayHelpers.remove(sectionId)}
                                />

                                <Stack
                                  tokens={{ childrenGap: 10 }}
                                  horizontal
                                  styles={{ root: { width: "100%" } }}
                                >
                                  <Stack horizontalAlign="start">
                                    <TextField
                                      placeholder="#"
                                      name={`_toc.sections.${sectionId}.section`}
                                      value={section.section}
                                      key={`stack_sec_input_${sections[sectionId].sectionUuid}_#`}
                                      onBlur={handleBlur}
                                      onChange={handleChange}
                                    />
                                    <ErrorMessage
                                      render={(msg) => (
                                        <>
                                          <span style={{ color: "red " }}>
                                            {msg}
                                          </span>
                                        </>
                                      )}
                                      name={`_toc.sections.${sectionId}.section`}
                                    />
                                  </Stack>
                                  <Stack>
                                    <TextField
                                      placeholder="Шифр раздела"
                                      name={`_toc.sections[${sectionId}].sectionStamp`}
                                      value={section.sectionStamp}
                                      key={`stack_sec_input_${sections[sectionId].sectionUuid}_sectionStamp`}
                                      styles={{ root: { width: "100%" } }}
                                      onChange={handleChange}
                                    />
                                    <ErrorMessage
                                      render={(msg) => (
                                        <>
                                          <span style={{ color: "red " }}>
                                            {msg}
                                          </span>
                                        </>
                                      )}
                                      name={`_toc.sections.${sectionId}.sectionStamp`}
                                    />
                                  </Stack>
                                </Stack>
                                <Stack
                                  horizontalAlign="start"
                                  styles={{ root: { width: "100%" } }}
                                >
                                  <TextField
                                    placeholder="Наименование раздела"
                                    key={`stack_sec_input_${sections[sectionId].sectionUuid}_title`}
                                    name={`_toc.sections[${sectionId}].sectionTitle`}
                                    value={section.sectionTitle}
                                    multiline
                                    autoAdjustHeight
                                    resizable={false}
                                    styles={{ root: { width: "100%" } }}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                  />

                                  <ErrorMessage
                                    render={(msg) => (
                                      <>
                                        <span style={{ color: "red " }}>
                                          {msg}
                                        </span>
                                      </>
                                    )}
                                    name={`_toc.sections.${sectionId}.sectionTitle`}
                                  />
                                </Stack>
                                <Stack
                                  horizontalAlign="start"
                                  styles={{ root: { width: "100%" } }}
                                >
                                  <TextField
                                    placeholder="Ответственный"
                                    key={`stack_sec_input_${sections[sectionId].sectionUuid}_assignedTo`}
                                    name={`_toc.sections[${sectionId}].assignedTo`}
                                    value={section.assignedTo}
                                    multiline
                                    autoAdjustHeight
                                    resizable={false}
                                    styles={{ root: { width: "100%" } }}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                  />
                                  <ErrorMessage
                                    render={(msg) => (
                                      <>
                                        <span style={{ color: "red " }}>
                                          {msg}
                                        </span>
                                      </>
                                    )}
                                    name={`_toc.sections.${sectionId}.assignedTo`}
                                  />
                                </Stack>
                              </Stack>
                            </div>
                          </>
                        )
                      )}

                    <Stack
                      key={`stack_sec_add_bottom`}
                      tokens={{ padding: "0" }}
                      style={{
                        boxShadow: Depths.depth8,
                        display: "flow",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <IconButton
                        styles={stylesAddButtonBig}
                        iconProps={{ iconName: "add" }}
                        onClick={() => arrayHelpers.push(new Section())}
                      />
                    </Stack>
                  </>
                )}
              />
              <Stack horizontal styles={{ root: { marginTop: "2vh" } }}>
                {isNewFile ? (
                  <TextField
                    placeholder="Сохранить как"
                    errorMessage={fileNameError}
                    onChange={onNewFileNameChange}
                    value={currentFileName}
                    styles={{ root: { width: "100%" } }}
                  />
                ) : (
                  <Dropdown
                    styles={{ root: { width: "100%" } }}
                    placeholder="Сохранить как"
                    onChange={onExistingFileNameChange}
                    options={
                      props.existingFiles?.length
                        ? props.existingFiles
                        : [{ key: null, text: "No files found" }]
                    }
                    disabled={!props.existingFiles?.length}
                    selectedKey={
                      props.existingFiles?.length
                        ? props.existingFiles.find(
                            (file) => file.text === currentFileName
                          )?.key
                        : null
                    }
                  />
                )}
                <Toggle onChange={onNewFileToggleChange} />
              </Stack>

              <PrimaryButton
                onClick={() => handleSubmit()}
                text="Сохранить"
                style={{ width: "100%", marginTop: "1vh" }}
              />

              {values.operationStatus == "success" && (
                <MessageBar
                  messageBarType={MessageBarType.success}
                  onDismiss={() => setFieldValue("operationStatus", "")}
                >
                  Оглавление успешно создано
                </MessageBar>
              )}

              {values.operationStatus == "error" && (
                <MessageBar
                  messageBarType={MessageBarType.error}
                  onDismiss={() => setFieldValue("operationStatus", "")}
                >
                  Произошла ошибка при создании оглавления
                </MessageBar>
              )}
            </Form>
          </>
        )}
      </Formik>
    </>
  );
};

export default TocForm;
