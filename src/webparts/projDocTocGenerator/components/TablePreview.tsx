import React, { ReactElement } from 'react'
import { Section, Toc } from '../model/ToC'

interface TablePreviewProps {
    toc: Toc
    section: Section
    currentSubsectionNumber: number
}

const TablePreview = ({ toc, section, currentSubsectionNumber }: TablePreviewProps): ReactElement => {
    return (
        <>
            <table  >
                <tr>
                    <th style={{ width: '15%' }}>№/№</th>
                    <th style={{ width: '15%' }}>ОБОЗНАЧЕНИЕ</th>
                    <th style={{ width: '60%' }}>НАИМЕНОВАНИЕ</th>
                    <th style={{ width: '10%' }}>ПРИМЕЧАНИЕ</th>
                </tr>
                <tr>
                    <td colSpan={4}>
                        Раздел {section.section}. {section.sectionTitle}
                    </td>
                </tr>
                <tr>
                    <td>
                        {section.section}
                        {section.subsections[currentSubsectionNumber].subsection != '' ?
                            '.' + section.subsections[currentSubsectionNumber].subsection
                            : ''
                        }
                        {section.subsections[currentSubsectionNumber].chapter != '' ?
                            '.' + section.subsections[currentSubsectionNumber].chapter
                            : ''
                        }
                        {section.subsections[currentSubsectionNumber].book != '' ?
                            '.' + section.subsections[currentSubsectionNumber].book
                            : ''
                        }
                    </td>
                    <td>
                        {toc.projectCode}
                        {section.subsections[currentSubsectionNumber].block != '' ?
                            '-' + section.subsections[currentSubsectionNumber].block
                            : ''
                        }
                        {section.subsections[currentSubsectionNumber].subblock != '' ?
                            '.' + section.subsections[currentSubsectionNumber].subblock
                            : ''
                        }
                        -
                        {section.subsections[currentSubsectionNumber].subsectionStamp || section.sectionStamp}
                        {section.subsections[currentSubsectionNumber].subsection}
                        {section.subsections[currentSubsectionNumber].chapter != '' ?
                            '.' + section.subsections[currentSubsectionNumber].chapter
                            : ''
                        }
                        {section.subsections[currentSubsectionNumber].book != '' ?
                            '.' + section.subsections[currentSubsectionNumber].book
                            : ''
                        }
                    </td>
                    <td>
                        Раздел {section.section}. {section.sectionTitle}.

                        {section.subsections[currentSubsectionNumber].subsection != '' ?
                            ' Подраздел ' + section.subsections[currentSubsectionNumber].subsection + '.'
                            + (section.subsections[currentSubsectionNumber].subsectionTitle != '' ?
                                ' ' + section.subsections[currentSubsectionNumber].subsectionTitle : '') + '.'
                            : ''
                        }
                        {section.subsections[currentSubsectionNumber].chapter != '' ?
                            ' Часть ' + section.subsections[currentSubsectionNumber].chapter + '.'
                            + (section.subsections[currentSubsectionNumber].chapterTitle != '' ?
                                ' ' + section.subsections[currentSubsectionNumber].chapterTitle : '') + '.'
                            : ''
                        }
                        {section.subsections[currentSubsectionNumber].book != '' ?
                            ' Книга ' + section.subsections[currentSubsectionNumber].book + '.'
                            + (section.subsections[currentSubsectionNumber].bookTitle != '' ?
                                ' ' + section.subsections[currentSubsectionNumber].bookTitle : '') + '.'
                            : ''
                        }
                        {section.subsections[currentSubsectionNumber].block != '' ?
                            ' Корпус ' + section.subsections[currentSubsectionNumber].block + '.'
                            + (section.subsections[currentSubsectionNumber].subblock != '' ?
                                '' + section.subsections[currentSubsectionNumber].subblock : '')
                            : ''
                        }
                    </td>
                    <td></td>
                </tr>
            </table>
        </>
    )
}


export default TablePreview