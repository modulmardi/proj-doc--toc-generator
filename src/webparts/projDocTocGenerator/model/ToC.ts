import { v4 as uuidv4 } from 'uuid';

export class Toc { //Table of Contents
	public buildingName: string
	public address: string
	public projectCode: string
	public sections: Section[]
	constructor() {
		this.sections = []
	}

}
export class Section {
	public section: string
	public sectionTitle: string
	public subsections: Subsection[]
	public readonly sectionUuid: string
	constructor() {
		this.sectionUuid = uuidv4()
		this.subsections = []
	}
}
export class Subsection {
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