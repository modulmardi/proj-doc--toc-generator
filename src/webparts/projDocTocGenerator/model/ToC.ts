import { v4 as uuidv4 } from 'uuid';

export class Toc { //Table of Contents
	public projectCode: string = ''
	public buildingName: string = ''
	public address: string = ''
	public projectStage: string = ''
	public gipName: string = ''						//Главный инженер проекта
	public gapName: string = ''						//Главный архитектор проекта
	public nContr: string = ''						//Нормоконтроль
	public sections: Section[] = []
}
export class Section {
	public section: string = ''
	public sectionTitle: string = ''
	public sectionStamp: string = ''
	public subsections: Subsection[] = []
	public readonly sectionUuid: string = uuidv4()
}
export class Subsection {
	public subsection: string = ''
	public subsectionTitle: string = ''
	public subsectionStamp: string = ''
	public chapter: string = ''
	public chapterTitle: string = ''
	public book: string = ''
	public bookTitle: string = ''
	public block: string = ''
	public subblock: string = ''
	public readonly subsectionUuid: string = uuidv4()
}