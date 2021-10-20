import { FormikErrors } from "formik";
import React, { ReactElement } from "react";
import { Section, Subsection, Toc } from "../model/ToC";
import styles from "./styles/style.module.scss";

interface TablePreviewProps {
  toc: Toc;
  section: Section;
  currentSubsectionNumber: number;
  errors: FormikErrors<Section>;
}

const TablePreview = ({
  toc,
  section,
  currentSubsectionNumber,
  errors,
}: TablePreviewProps): ReactElement => {
  const hasErrors = (id: number): boolean => {
    const _subsection =
      errors?.subsections[id] && (errors?.subsections[id] as Subsection);
    for (const error in _subsection) {
      if (error != "") {
        return true;
      }
    }
    return false;
  };
  return (
    <>
      <table>
        <tr>
          <th>№/№</th>
          <th>ОБОЗНАЧЕНИЕ</th>
          <th>НАИМЕНОВАНИЕ</th>
          <th>ПРИМЕЧАНИЕ</th>
        </tr>
        <tr>
          <td colSpan={4}>
            {section.section
              ? "Раздел " + section.section + ". " + section.sectionTitle
              : ""}
          </td>
        </tr>
        {currentSubsectionNumber > 0 && (
          <tr
            className={
              hasErrors(currentSubsectionNumber - 1) && styles.row_error
            }
          >
            <td>
              {section.section +
                (section.subsections[currentSubsectionNumber - 1].subsection
                  ? "." +
                    section.subsections[currentSubsectionNumber - 1].subsection
                  : "") +
                (section.subsections[currentSubsectionNumber - 1].chapter
                  ? "." +
                    section.subsections[currentSubsectionNumber - 1].chapter
                  : "") +
                (section.subsections[currentSubsectionNumber - 1].book
                  ? "." + section.subsections[currentSubsectionNumber - 1].book
                  : "")}
            </td>
            <td>
              {toc.projectCode +
                (section.subsections[currentSubsectionNumber - 1].block
                  ? "-" + section.subsections[currentSubsectionNumber - 1].block
                  : "") +
                (section.subsections[currentSubsectionNumber - 1].subblock
                  ? "." +
                    section.subsections[currentSubsectionNumber - 1].subblock
                  : "") +
                (section.subsections[currentSubsectionNumber - 1]
                  .subsectionStamp || section.sectionStamp
                  ? "-" +
                    (section.subsections[currentSubsectionNumber - 1]
                      .subsectionStamp || section.sectionStamp)
                  : "") +
                section.subsections[currentSubsectionNumber - 1].subsection +
                (section.subsections[currentSubsectionNumber - 1].chapter
                  ? "." +
                    section.subsections[currentSubsectionNumber - 1].chapter
                  : "") +
                (section.subsections[currentSubsectionNumber - 1].book
                  ? "." + section.subsections[currentSubsectionNumber - 1].book
                  : "")}
            </td>
            <td>
              {(section.section
                ? "Раздел " +
                  section.section +
                  ". " +
                  (section.sectionTitle ? section.sectionTitle + "." : "")
                : "") +
                (section.subsections[currentSubsectionNumber - 1].subsection
                  ? " Подраздел " +
                    section.subsections[currentSubsectionNumber - 1]
                      .subsection +
                    "." +
                    (section.subsections[currentSubsectionNumber - 1]
                      .subsectionTitle
                      ? " " +
                        section.subsections[currentSubsectionNumber - 1]
                          .subsectionTitle +
                        "."
                      : "")
                  : "") +
                (section.subsections[currentSubsectionNumber - 1].chapter
                  ? " Часть " +
                    section.subsections[currentSubsectionNumber - 1].chapter +
                    "." +
                    (section.subsections[currentSubsectionNumber - 1]
                      .chapterTitle
                      ? " " +
                        section.subsections[currentSubsectionNumber - 1]
                          .chapterTitle +
                        "."
                      : "")
                  : "") +
                (section.subsections[currentSubsectionNumber - 1].book
                  ? " Книга " +
                    section.subsections[currentSubsectionNumber - 1].book +
                    "." +
                    (section.subsections[currentSubsectionNumber - 1].bookTitle
                      ? " " +
                        section.subsections[currentSubsectionNumber - 1]
                          .bookTitle +
                        "."
                      : "")
                  : "") +
                (section.subsections[currentSubsectionNumber - 1].block
                  ? " Корпус " +
                    section.subsections[currentSubsectionNumber - 1].block +
                    "." +
                    (section.subsections[currentSubsectionNumber - 1].subblock
                      ? "" +
                        section.subsections[currentSubsectionNumber - 1]
                          .subblock
                      : "")
                  : "")}
            </td>
            <td></td>
          </tr>
        )}
        <tr
          className={`
            ${styles.row_current} ${
            hasErrors(currentSubsectionNumber) && styles.row_error
          }
          `}
        >
          <td>
            {section.section +
              (section.subsections[currentSubsectionNumber].subsection
                ? "." + section.subsections[currentSubsectionNumber].subsection
                : "") +
              (section.subsections[currentSubsectionNumber].chapter
                ? "." + section.subsections[currentSubsectionNumber].chapter
                : "") +
              (section.subsections[currentSubsectionNumber].book
                ? "." + section.subsections[currentSubsectionNumber].book
                : "")}
          </td>
          <td>
            {toc.projectCode +
              (section.subsections[currentSubsectionNumber].block
                ? "-" + section.subsections[currentSubsectionNumber].block
                : "") +
              (section.subsections[currentSubsectionNumber].subblock
                ? "." + section.subsections[currentSubsectionNumber].subblock
                : "") +
              (section.subsections[currentSubsectionNumber].subsectionStamp ||
              section.sectionStamp
                ? "-" +
                  (section.subsections[currentSubsectionNumber]
                    .subsectionStamp || section.sectionStamp)
                : "") +
              section.subsections[currentSubsectionNumber].subsection +
              (section.subsections[currentSubsectionNumber].chapter
                ? "." + section.subsections[currentSubsectionNumber].chapter
                : "") +
              (section.subsections[currentSubsectionNumber].book
                ? "." + section.subsections[currentSubsectionNumber].book
                : "")}
          </td>
          <td>
            {(section.section
              ? "Раздел " +
                section.section +
                ". " +
                (section.sectionTitle ? section.sectionTitle + "." : "")
              : "") +
              (section.subsections[currentSubsectionNumber].subsection
                ? " Подраздел " +
                  section.subsections[currentSubsectionNumber].subsection +
                  "." +
                  (section.subsections[currentSubsectionNumber].subsectionTitle
                    ? " " +
                      section.subsections[currentSubsectionNumber]
                        .subsectionTitle +
                      "."
                    : "")
                : "") +
              (section.subsections[currentSubsectionNumber].chapter
                ? " Часть " +
                  section.subsections[currentSubsectionNumber].chapter +
                  "." +
                  (section.subsections[currentSubsectionNumber].chapterTitle
                    ? " " +
                      section.subsections[currentSubsectionNumber]
                        .chapterTitle +
                      "."
                    : "")
                : "") +
              (section.subsections[currentSubsectionNumber].book
                ? " Книга " +
                  section.subsections[currentSubsectionNumber].book +
                  "." +
                  (section.subsections[currentSubsectionNumber].bookTitle
                    ? " " +
                      section.subsections[currentSubsectionNumber].bookTitle +
                      "."
                    : "")
                : "") +
              (section.subsections[currentSubsectionNumber].block
                ? " Корпус " +
                  section.subsections[currentSubsectionNumber].block +
                  "." +
                  (section.subsections[currentSubsectionNumber].subblock
                    ? "" + section.subsections[currentSubsectionNumber].subblock
                    : "")
                : "")}
          </td>
          <td></td>
        </tr>
        {currentSubsectionNumber + 1 < section.subsections.length && (
          <tr
            className={
              hasErrors(currentSubsectionNumber + 1) && styles.row_error
            }
          >
            <td>
              {section.section +
                (section.subsections[currentSubsectionNumber + 1].subsection
                  ? "." +
                    section.subsections[currentSubsectionNumber + 1].subsection
                  : "") +
                (section.subsections[currentSubsectionNumber + 1].chapter
                  ? "." +
                    section.subsections[currentSubsectionNumber + 1].chapter
                  : "") +
                (section.subsections[currentSubsectionNumber + 1].book
                  ? "." + section.subsections[currentSubsectionNumber + 1].book
                  : "")}
            </td>
            <td>
              {toc.projectCode +
                (section.subsections[currentSubsectionNumber + 1].block
                  ? "-" + section.subsections[currentSubsectionNumber + 1].block
                  : "") +
                (section.subsections[currentSubsectionNumber + 1].subblock
                  ? "." +
                    section.subsections[currentSubsectionNumber + 1].subblock
                  : "") +
                (section.subsections[currentSubsectionNumber + 1]
                  .subsectionStamp || section.sectionStamp
                  ? "-" +
                    (section.subsections[currentSubsectionNumber + 1]
                      .subsectionStamp || section.sectionStamp)
                  : "") +
                section.subsections[currentSubsectionNumber + 1].subsection +
                (section.subsections[currentSubsectionNumber + 1].chapter
                  ? "." +
                    section.subsections[currentSubsectionNumber + 1].chapter
                  : "") +
                (section.subsections[currentSubsectionNumber + 1].book
                  ? "." + section.subsections[currentSubsectionNumber + 1].book
                  : "")}
            </td>
            <td>
              {(section.section
                ? "Раздел " +
                  section.section +
                  ". " +
                  (section.sectionTitle ? section.sectionTitle + "." : "")
                : "") +
                (section.subsections[currentSubsectionNumber + 1].subsection
                  ? " Подраздел " +
                    section.subsections[currentSubsectionNumber + 1]
                      .subsection +
                    "." +
                    (section.subsections[currentSubsectionNumber + 1]
                      .subsectionTitle
                      ? " " +
                        section.subsections[currentSubsectionNumber + 1]
                          .subsectionTitle +
                        "."
                      : "")
                  : "") +
                (section.subsections[currentSubsectionNumber + 1].chapter
                  ? " Часть " +
                    section.subsections[currentSubsectionNumber + 1].chapter +
                    "." +
                    (section.subsections[currentSubsectionNumber + 1]
                      .chapterTitle
                      ? " " +
                        section.subsections[currentSubsectionNumber + 1]
                          .chapterTitle +
                        "."
                      : "")
                  : "") +
                (section.subsections[currentSubsectionNumber + 1].book
                  ? " Книга " +
                    section.subsections[currentSubsectionNumber + 1].book +
                    "." +
                    (section.subsections[currentSubsectionNumber + 1].bookTitle
                      ? " " +
                        section.subsections[currentSubsectionNumber + 1]
                          .bookTitle +
                        "."
                      : "")
                  : "") +
                (section.subsections[currentSubsectionNumber + 1].block
                  ? " Корпус " +
                    section.subsections[currentSubsectionNumber + 1].block +
                    "." +
                    (section.subsections[currentSubsectionNumber + 1].subblock
                      ? "" +
                        section.subsections[currentSubsectionNumber + 1]
                          .subblock
                      : "")
                  : "")}
            </td>
            <td></td>
          </tr>
        )}
      </table>
    </>
  );
};

export default TablePreview;
