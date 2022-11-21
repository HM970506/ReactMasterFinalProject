export function makeImagePath(id: string, format?: string) {
    //image를 받아옵니다
    return `https://image.tmdb.org/t/p/${format ? format : "original"}/${id}`;
  }