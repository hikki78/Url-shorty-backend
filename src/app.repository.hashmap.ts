import { Observable, of } from 'rxjs';

export class AppRepositoryHashmap {
  private hashMap: Map<string, string> = new Map();

  get(hash: string): Observable<string> {
    return of(this.hashMap.get(hash) || '');
  }

  put(hash: string, url: string): Observable<string> {
    this.hashMap.set(hash, url);
    return of(this.hashMap.get(hash) || '');
  }

  async delete(hash: string): Promise<void> {
    this.hashMap.delete(hash);
  }
}
