import {
  Checkbox,
  createTheme,
  FontSizes,
  ITheme,
  Modal,
  PrimaryButton,
  Stack,
} from "@fluentui/react";
import { Form, Formik } from "formik";
import React from "react";
import { Section, Toc } from "../model/ToC";
import BackContinueButtonGroup from "./BackContinueButtonGroup";

const sectionsPreset: Section[] = [
  {
    ...new Section(),
    section: "1",
    sectionStamp: "ПЗ",
    sectionTitle: "Пояснительная записка",
  },
  {
    ...new Section(),
    section: "2",
    sectionStamp: "ПЗУ",
    sectionTitle: "Схема планировочной организации земельного участка",
  },
  {
    ...new Section(),
    section: "3",
    sectionStamp: "АР",
    sectionTitle: "Архитектурные решения",
  },
  {
    ...new Section(),
    section: "4",
    sectionStamp: "КР",
    sectionTitle: "Конструктивные и объемно-планировочные решения",
  },
  {
    ...new Section(),
    section: "5",
    sectionStamp: "ИОС",
    sectionTitle:
      "Сведения об инженерном оборудовании, о сетях инженерно-технического обеспечения, перечень инженерно-технических мероприятий, содержание технологических решений",
  },
  {
    ...new Section(),
    section: "6",
    sectionStamp: "ПОС",
    sectionTitle: "Проект организации строительства",
  },
  {
    ...new Section(),
    section: "7",
    sectionStamp: "ПОД",
    sectionTitle:
      "Проект организации работ по сносу или демонтажу объектов капитального строительства",
  },
  {
    ...new Section(),
    section: "8",
    sectionStamp: "ООС",
    sectionTitle: "Перечень мероприятий по охране окружающей среды",
  },
  {
    ...new Section(),
    section: "9",
    sectionStamp: "ПБ",
    sectionTitle: "Мероприятия по обеспечению пожарной безопасности",
  },
  {
    ...new Section(),
    section: "10",
    sectionStamp: "ОДИ",
    sectionTitle: "Мероприятия по обеспечению доступа инвалидов",
  },
  {
    ...new Section(),
    section: "10.1",
    sectionStamp: "ЭЭ",
    sectionTitle:
      "Мероприятия по обеспечению соблюдения требований энергетической эффективности и требований оснащенности зданий, строений и сооружений приборами учета используемых энергетических ресурсов",
  },
  {
    ...new Section(),
    section: "11",
    sectionStamp: "СМ",
    sectionTitle: "Смета на строительство объектов капитального строительства",
  },
  {
    ...new Section(),
    section: "11.1",
    sectionStamp: "ПКР",
    sectionTitle:
      "Сведения о нормативной периодичности выполнения работ по капитальному ремонту многоквартирного дома",
  },
  {
    ...new Section(),
    section: "12",
    sectionStamp: "",
    sectionTitle:
      "Иная документация в случаях, предусмотренных федеральными законами",
  },
];

const theme: ITheme = createTheme({
  fonts: {
    medium: {
      fontFamily: "Monaco, Menlo, Consolas",
      fontSize: FontSizes.size32,
    },
  },
});
const stackTokens = { childrenGap: 10 };

interface GenerateSectionsModalProps {
  setTocSections: (sections: Section[]) => void;
}

const GenerateSectionsModal = ({
  setTocSections,
}: GenerateSectionsModalProps) => {
  return (
    <>
      <Formik
        initialValues={{
          newProjectTemplateChecks: new Array<boolean>(
            sectionsPreset.length
          ).fill(true),
          isGenerateSectionsModalOpen: false,
        }}
        onSubmit={(values, formikHelpers): void | Promise<any> => {
          let _presetSections: Section[];

          _presetSections = sectionsPreset.filter(
            (sec, secId) => values.newProjectTemplateChecks[secId]
          );

          setTocSections(_presetSections);
          formikHelpers.setFieldValue("isGenerateSectionsModalOpen", false);
        }}
      >
        {({ values, ...formikProps }) => (
          <>
            <PrimaryButton
              text="Сгенерировать разделы"
              name="isGenerateSectionsModalOpen"
              onClick={() =>
                formikProps.setFieldValue("isGenerateSectionsModalOpen", true)
              }
              styles={{ root: { width: "100%" } }}
            />

            <Form>
              <Modal
                titleAriaId="createNewProjectModal"
                isOpen={values.isGenerateSectionsModalOpen}
                onDismiss={() =>
                  formikProps.setFieldValue(
                    "isGenerateSectionsModalOpen",
                    false
                  )
                }
                isBlocking={false}
                styles={{
                  main: {
                    height: "wrap-content",
                    width: "40vw",
                    borderRadius: "0,5vh",
                    padding: "2vh 2vw",
                    position: "relative",
                  },
                }}
              >
                <Stack>
                  <h2 {...theme}>Добавить разделы</h2>
                  <Stack
                    tokens={stackTokens}
                    style={{ padding: "2vh 0 0 1vw" }}
                  >
                    {sectionsPreset.map((sectionItem, checkboxId) => (
                      <>
                        <Checkbox
                          key={`template_checkbox_${checkboxId}`}
                          name={`newProjectTemplateChecks[${checkboxId}]`}
                          styles={{
                            label: { width: "100%", alignItems: "baseline" },
                          }}
                          onChange={formikProps.handleChange}
                          checked={values.newProjectTemplateChecks[checkboxId]}
                          onRenderLabel={() => (
                            <Stack horizontal style={{ width: "100%" }}>
                              <div
                                style={{
                                  fontSize: "1.1em",
                                  width: "7%",
                                  position: "relative",
                                  display: "block",
                                  left: "1%",
                                }}
                              >
                                {sectionItem.section}
                              </div>
                              <div
                                style={{
                                  fontSize: "1.1em",
                                  width: "75%",
                                  position: "relative",
                                  display: "block",
                                }}
                              >
                                {sectionItem.sectionTitle}
                              </div>
                              <div
                                style={{
                                  fontSize: "1.1em",
                                  width: "18%",
                                  position: "relative",
                                  display: "block",
                                  textAlign: "right",
                                }}
                              >
                                {sectionItem.sectionStamp}
                              </div>
                            </Stack>
                          )}
                        />
                      </>
                    ))}
                  </Stack>
                </Stack>
                <BackContinueButtonGroup
                  onClickBack={() =>
                    formikProps.setFieldValue(
                      "isGenerateSectionsModalOpen",
                      false
                    )
                  }
                  onClickContinue={() => formikProps.handleSubmit()}
                />
              </Modal>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
};

export default GenerateSectionsModal;
