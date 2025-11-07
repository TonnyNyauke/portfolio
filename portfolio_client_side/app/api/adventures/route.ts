import { NextResponse } from 'next/server'
import { readJsonFile } from '@/lib/fileStore'
import type { Adventure } from '@/app/api/admin/adventures/route'

const FILE = 'adventures.json'

export async function GET() {
  const adventures = await readJsonFile<Adventure[]>(FILE, [])
  return NextResponse.json({ adventures })
}

