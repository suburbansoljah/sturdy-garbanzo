import { loadNrsChapter, loadNrsIndex } from "@/lib/nrs.functions";

export function getNrsIndex() {
  return loadNrsIndex();
}

export function getNrsChapter(file: string) {
  return loadNrsChapter({ data: file });
}
