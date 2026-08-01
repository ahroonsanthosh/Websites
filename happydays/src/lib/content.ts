import fs from 'fs'
import path from 'path'

export interface MenuItem {
  name: string
  price: string
}

export interface HourEntry {
  day: string
  open?: string
  close?: string
  closed: boolean
}

export interface SiteData {
  menu: {
    breakfast: MenuItem[]
    lunch: MenuItem[]
    drinks: MenuItem[]
  }
  hours: HourEntry[]
  about: string
  contact: {
    address: string
    instagram: string
    facebook: string
  }
  galleryCaptions: string[]
}

const dataPath = path.join(process.cwd(), 'src/data/site-data.json')

export async function getSiteData(): Promise<SiteData> {
  const raw = fs.readFileSync(dataPath, 'utf-8')
  return JSON.parse(raw)
}

export function getSiteDataSync(): SiteData {
  const raw = fs.readFileSync(dataPath, 'utf-8')
  return JSON.parse(raw)
}

export function writeSiteData(data: SiteData): void {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf-8')
}
